import openai
from django.conf import settings
import base64
from io import BytesIO
from PIL import Image
import logging
import json

logger = logging.getLogger(__name__)

class MedicalAIService:
    def __init__(self):
        api_key = getattr(settings, 'OPENAI_API_KEY', None)
        if not api_key:
            logger.warning("OPENAI_API_KEY not set. Medical AI services will not be available.")
            self.client = None
        else:
            self.client = openai.OpenAI(api_key=api_key)

    def _make_chat_completion_request(self, messages, model="gpt-3.5-turbo", max_tokens=1500, temperature=0.5, response_format=None):
        if not self.client:
            return None, "OpenAI API key not configured."
        try:
            params = {
                "model": model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "timeout": 20.0,  # 20 second timeout for OpenAI API
            }
            if response_format:
                 params["response_format"] = response_format

            response = self.client.chat.completions.create(**params)
            content = response.choices[0].message.content
            return content.strip(), None
        except openai.APIError as e:
            logger.error(f"OpenAI API Error: {e}")
            error_message = f"OpenAI API error: {e.status_code} - {getattr(e, 'message', str(e))}"
            if hasattr(e, 'body') and e.body and 'message' in e.body:
                 error_message = f"OpenAI API error: {e.status_code} - {e.body['message']}"
            return None, error_message
        except Exception as e:
            logger.error(f"Unexpected error calling OpenAI: {e}")
            return None, f"An unexpected error occurred with AI service: {str(e)}"

    def anonymize_document_text(self, text_content):
        system_prompt = """
You are an expert data anonymization tool. Analyze the following text and redact all Personally Identifiable Information (PII).
Replace PII with placeholders like [PATIENT_NAME], [DATE], [DOCTOR_NAME], [CONTACT_NUMBER], [MEDICAL_RECORD_ID], [ADDRESS], [AGE], [HOSPITAL_NAME], [LOCATION], etc.
Provide the anonymized text. Also, provide a JSON summary of the count of each type of PII redacted.
PII categories to consider:
- Patient Names (and initials if clearly identifying)
- Doctor Names (and other healthcare provider names)
- Dates (All specific dates like Birth, Admission, Discharge, Procedure, Report dates)
- Contact Information (Phone numbers, Email addresses, Fax numbers)
- Addresses (Street addresses, City, State, ZIP codes if specific and identifying)
- Medical Record Numbers (MRN), Patient IDs, Account Numbers
- Social Security Numbers (or equivalents)
- Vehicle Identifiers, Device Serial Numbers
- Biometric Identifiers
- Full face photographic images (description if text refers to one)
- Any other unique identifying number, characteristic, or code (e.g., Accession Numbers, Study IDs if they are unique and traceable)
- Ages over 89 or specific ages if contextually identifying. Replace with [AGE_OVER_89] or [AGE].
- Names of relatives if identifying.
- Geographic subdivisions smaller than a state, including street address, city, county, precinct, zip code, and their equivalent geocodes.
Output format MUST be a JSON object with two keys:
1.  "anonymized_text": "The full anonymized text content."
2.  "redaction_summary": A JSON object detailing counts, e.g., {"Patient Names": 2, "Dates": 3, "Contact Information": 1}
Example of redaction_summary: {"Patient Names": 1, "Dates": 2, "Medical Record IDs": 1}
If no PII of a certain type is found, do not include it in the summary or set its count to 0.
"""
        user_prompt = f"Anonymize the following text:\n\n---\n{text_content}\n---"

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        raw_response, error = self._make_chat_completion_request(
            messages,
            model="gpt-3.5-turbo-0125",
            max_tokens=2000,
            temperature=0.2,
            response_format={ "type": "json_object" }
        )

        if error:
            return None, None, error

        if not raw_response:
            return None, None, "AI service returned an empty response."

        try:
            parsed_json = json.loads(raw_response)
            anonymized_text = parsed_json.get("anonymized_text")
            redaction_summary = parsed_json.get("redaction_summary", {})
            if not anonymized_text:
                return None, None, "AI response missing 'anonymized_text'."
            return anonymized_text, redaction_summary, None
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from anonymization AI response: {raw_response[:500]}")
            return raw_response, {}, "AI response was not valid JSON, but text was returned."
        except Exception as e:
            logger.error(f"Error processing AI response for anonymization: {e}")
            return None, None, str(e)

    def analyze_medical_report(self, report_text, report_type="general"):
        """Analyze medical reports for potential errors and inconsistencies"""
        system_prompt = f"""
Analyze this {report_type} medical report for errors. Return JSON with:
- `original_text`: exact input text
- `flagged_issues`: array of errors with type, description, segment, suggestion
- `accuracy_score`: 0-100 accuracy rating
- `error_distribution`: count of error types
Focus on spelling, grammar, medical terminology, and clarity issues.
"""
        user_prompt = f"Analyze this {report_type} report:\n\n---\n{report_text}\n---"
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        raw_response, error = self._make_chat_completion_request(
            messages,
            model="gpt-3.5-turbo-0125",
            max_tokens=2000,
            temperature=0.15,
            response_format={ "type": "json_object" }
        )

        if error:
            return None, error

        if not raw_response:
            return None, "AI service returned an empty response for report analysis."

        try:
            analysis_result = json.loads(raw_response)

            if "original_text" not in analysis_result or not analysis_result.get("original_text"):
                logger.warning("LLM did not return 'original_text'. Using input report_text instead.")
                analysis_result["original_text"] = report_text

            if not all(k in analysis_result for k in ['flagged_issues', 'accuracy_score', 'error_distribution']):
                logger.error(f"Report analysis AI response missing some required keys: {raw_response[:500]}")
                analysis_result.setdefault('flagged_issues', [])
                analysis_result.setdefault('accuracy_score', 0.0)
                analysis_result.setdefault('error_distribution', {})
                return analysis_result, "AI response structure is incomplete."

            processed_issues = []
            for issue_idx, issue in enumerate(analysis_result.get("flagged_issues", [])):
                required_keys = ['type', 'description', 'segment', 'suggestion']
                if not all(k_issue in issue for k_issue in required_keys):
                    logger.warning(f"A flagged issue (index {issue_idx}) is missing required keys: {issue}")
                    continue

                segment_value = issue.get('segment')
                if not isinstance(segment_value, str) or not segment_value.strip():
                    logger.warning(f"A flagged issue (index {issue_idx}) has an invalid segment: {issue}")
                    continue

                issue.pop('startIndex', None)
                issue.pop('endIndex', None)

                processed_issues.append(issue)
            analysis_result['flagged_issues'] = processed_issues

            return analysis_result, None

        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from report analysis AI response: {raw_response[:500]}")
            return {
                "original_text": report_text,
                "flagged_issues": [],
                "accuracy_score": 0,
                "error_distribution": {},
                "parsing_error": "AI response was not valid JSON."
            }, "Failed to parse AI response."
        except Exception as e:
            logger.error(f"Error processing AI response for report analysis: {e}")
            return None, str(e)

    def analyze_radiology_report(self, report_text):
        """Specialized method for radiology reports"""
        return self.analyze_medical_report(report_text, report_type="radiology")

    def _prepare_image_for_openai(self, image_file_obj):
        if image_file_obj is None:
            return None, None
        try:
            image_file_obj.seek(0)
            img = Image.open(image_file_obj)
            if img.mode not in ('RGB', 'L'):
                img = img.convert('RGB')
            buffered = BytesIO()
            img.save(buffered, format="JPEG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            return f"data:image/jpeg;base64,{img_base64}", None
        except Exception as e:
            logger.error(f"Error preparing image for OpenAI: {e}")
            return None, f"Error processing image: {str(e)}"

    def query_image_with_text(self, image_file_obj, text_query: str, report_context: str = "", conversation_history: list = None):
        if not self.client:
            return None, "OpenAI API key not configured."

        base64_image_url, image_error = self._prepare_image_for_openai(image_file_obj)
        if image_error:
            if image_file_obj is not None:
                return None, image_error

        system_prompt_parts = ["You are an expert medical imaging assistant."]
        if base64_image_url and report_context:
            system_prompt_parts.append("Analyze the provided medical image in conjunction with the user's query, the provided report context, and conversation history.")
        elif base64_image_url:
            system_prompt_parts.append("Analyze the provided medical image in conjunction with the user's query and conversation history.")
            system_prompt_parts.append("If the user asks 'what is in this image?' or similar, describe the image's content from a medical perspective.")
        elif report_context:
            system_prompt_parts.append("Analyze the provided medical report context in conjunction with the user's query and conversation history.")
        else:
            system_prompt_parts.append("Answer the user's query based on your general medical knowledge and conversation history.")

        system_prompt_parts.append("Provide clear, concise, and medically accurate answers.")
        system_prompt_parts.append("If asked to localize findings (and an image is available), describe the location clearly.")

        system_prompt = " ".join(system_prompt_parts)

        messages = [{"role": "system", "content": system_prompt}]

        if conversation_history:
            for msg in conversation_history:
                if isinstance(msg, dict) and "role" in msg and "content" in msg:
                    content_str = msg["content"]
                    if not isinstance(content_str, str):
                        try:
                            content_str = json.dumps(content_str)
                        except TypeError:
                            content_str = str(content_str)
                    messages.append({"role": msg["role"], "content": content_str})

        user_message_content = []

        current_query_text = text_query
        if report_context:
            current_query_text += f"\n\nRelevant context from the medical report:\n---\n{report_context}\n---"

        user_message_content.append({"type": "text", "text": current_query_text})

        if base64_image_url:
            user_message_content.append({
                "type": "image_url",
                "image_url": {"url": base64_image_url}
            })

        messages.append({"role": "user", "content": user_message_content})

        response_content, error = self._make_chat_completion_request(
            messages,
            model="gpt-4o" if self.client else "gpt-3.5-turbo",
            max_tokens=1500,
            temperature=0.3
        )

        if error:
            return None, error

        return response_content, None

# Create singleton instance
medical_ai_service = MedicalAIService()
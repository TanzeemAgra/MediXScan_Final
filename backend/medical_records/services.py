"""Services for Report Correction pipeline.

This module provides a PoC implementation for:
- Layer 1: grammar/fluency correction using a small Hugging Face seq2seq model (t5-small)
- Layer 2: simple medical-term normalization via a synonym map
- RAG retrieval placeholder
- Aggregation and a synchronous processing helper for local testing

Replace the PoC pieces with production-grade models, ontology lookups
and vector DB clients for a real deployment.
"""
from typing import Dict, Any, List
import logging
import os

from .models import ReportCorrectionVersion, ReportCorrectionRequest

# Import transformers lazily in helper to avoid hard dependency if not used
logger = logging.getLogger(__name__)

# If an external generative AI API key is present, prefer it for generation to avoid
# loading heavy local transformer models on CPU. Use env var OPENAI_API_KEY for OpenAI.
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')


def _load_grammar_model():
    """Lazily load a small T5 model for text-to-text grammatical correction.

    Uses `t5-small` as a lightweight PoC model. If transformers/torch are not
    installed, this will raise an informative ImportError.
    """
    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    except Exception as e:
        raise ImportError(
            "transformers and torch are required for the PoC grammar model. "
            "Install them via backend/requirements.txt"
        ) from e

    model_name = "t5-small"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return tokenizer, model


def run_grammar_correction(text: str, max_length: int = 512) -> Dict[str, Any]:
    """Run a lightweight grammar/fluency correction using a seq2seq model.

    Returns a dict with `corrected_text`, `confidence` (estimated), and
    `explain` (simple placeholder edits list).
    Note: This is a PoC suitable for CPU. Replace with a tuned domain model
    for production.
    """
    if not text or not text.strip():
        return {"corrected_text": text, "confidence": 0.0, "explain": []}

    tokenizer, model = _load_grammar_model()
    # Use a simple prefix to request correction; T5 is generic text-to-text.
    prompt = f"correct: {text.strip()}"
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=max_length)
    outputs = model.generate(**inputs, max_length=max_length, num_beams=4, early_stopping=True)
    corrected = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Prefer an external Generative API to avoid CPU-heavy local models
    if OPENAI_API_KEY:
        try:
            import requests
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a medical report editor. Improve grammar and clarity without changing medical meaning."},
                    {"role": "user", "content": text}
                ],
                "temperature": 0.0
            }
            headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
            r = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=30)
            r.raise_for_status()
            j = r.json()
            corrected = j["choices"][0]["message"]["content"].strip()
        except Exception as e:
            logger.exception("OpenAI API call failed, falling back to rule-based correction: %s", e)
            corrected = _rule_based_correction(text)
    else:
        # If no API key, fall back to local transformers only if available; otherwise use rule-based lightweight correction
        try:
            tokenizer, model = _load_grammar_model()
            # Use a simple prefix to request correction; T5 is generic text-to-text.
            prompt = f"correct: {text.strip()}"
            inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=max_length)
            outputs = model.generate(**inputs, max_length=max_length, num_beams=4, early_stopping=True)
            corrected = tokenizer.decode(outputs[0], skip_special_tokens=True)
        except Exception:
            # Transformers not available or failed — use simple rule-based correction
            corrected = _rule_based_correction(text)
    # Naive confidence heuristic: length ratio similarity
    src_len = len(text.split())
    tgt_len = len(corrected.split())
    len_score = 1.0 - abs(src_len - tgt_len) / max(1, max(src_len, tgt_len))
    confidence = max(0.1, min(0.99, len_score))

    explain = ["PoC grammar corrections produced by t5-small; replace with tuned model for production"]

    return {"corrected_text": corrected, "confidence": confidence, "explain": explain}


def _rule_based_correction(text: str) -> str:
    """A very small generative-like fallback that fixes punctuation, spacing and a few common grammar cases.

    This is intentionally simple and deterministic to keep CPU usage minimal. It is not a replacement for an LLM.
    """
    if not text:
        return text
    out = text.strip()
    # Ensure sentences end with punctuation
    out = out.replace('\n', ' ')
    out = ' '.join(out.split())
    if not out.endswith('.') and not out.endswith('?') and not out.endswith('!'):
        out += '.'
    # Basic capitalization after periods
    import re
    def cap(match):
        return match.group(1) + match.group(2).upper()
    out = re.sub(r'([\.\!\?]\s+)([a-z])', cap, out)
    # Fix obvious double spaces
    out = out.replace('  ', ' ')
    return out


# Very small synonym map for medical terms as PoC. In production, replace with
# a RadLex / SNOMED CT normalization lookup and fuzzy matching.
_MEDICAL_SYNONYMS = {
    "cardiomegaly": "cardiomegaly",
    "cardiomegally": "cardiomegaly",
    "pneumonia": "pneumonia",
    "pnemonia": "pneumonia",
    "atelectasis": "atelectasis",
}


def run_medical_term_check(text: str) -> Dict[str, Any]:
    """Identify simple misspellings of common terms and normalize them.

    Returns `normalized_text` and `changes` list with entries {from,to,reason}.
    This is intentionally simple — it demonstrates the interface and audit
    trail for changes.
    """
    if not text:
        return {"normalized_text": text, "changes": []}

    normalized = text
    changes: List[Dict[str, Any]] = []
    lowered = text.lower()
    for misspelling, canonical in _MEDICAL_SYNONYMS.items():
        if misspelling in lowered and misspelling != canonical:
            # Replace occurrences (case-insensitive)
            import re

            pattern = re.compile(re.escape(misspelling), re.IGNORECASE)
            new_text, count = pattern.subn(canonical, normalized)
            if count > 0:
                changes.append({"from": misspelling, "to": canonical, "reason": "synonym_map"})
                normalized = new_text

    return {"normalized_text": normalized, "changes": changes}


def rag_retrieval(context: str, query: str) -> List[Dict[str, Any]]:
    """Placeholder for RAG retrieval. Returns list of grounding strings.

    For PoC this returns an empty list. Replace with vector DB + knowledge base.
    """
    return []


def aggregate_corrections(grammar_res: Dict[str, Any], medical_res: Dict[str, Any]) -> Dict[str, Any]:
    """Aggregate results into a final version dict suitable for DB storage.

    This simple aggregator places the grammar-corrected text into `findings`.
    """
    findings = grammar_res.get("corrected_text") if grammar_res else None
    normalized = medical_res.get("normalized_text") if medical_res else findings

    # Merge confidence: favor grammar model's confidence, lower if medical changes present
    grammar_conf = float(grammar_res.get("confidence", 0.0)) if grammar_res else 0.0
    penalty = 0.05 * len(medical_res.get("changes", [])) if medical_res else 0.0
    confidence_score = max(0.0, grammar_conf - penalty)

    return {
        "patient_info": {},
        "clinical_indication": None,
        "findings": findings,
        "impression": None,
        "corrections": {
            "grammar": grammar_res,
            "medical": medical_res
        },
        "confidence_score": confidence_score,
    }


def process_report_correction_sync(request: ReportCorrectionRequest) -> ReportCorrectionVersion:
    """Synchronous processing path for testing without Celery.

    Processes the latest submitted text (assumed stored in request.notes or a linked record)
    and writes a ReportCorrectionVersion to the database. Returns the created version.
    """
    # For POC, assume the raw report text is stored in request.notes
    raw = (request.notes or "").strip()
    grammar_res = run_grammar_correction(raw)
    medical_res = run_medical_term_check(grammar_res.get("corrected_text", raw))
    aggregated = aggregate_corrections(grammar_res, medical_res)

    version = ReportCorrectionVersion.objects.create(
        correction_request=request,
        patient_info=aggregated.get("patient_info", {}),
        clinical_indication=aggregated.get("clinical_indication"),
        findings=aggregated.get("findings"),
        impression=aggregated.get("impression"),
        corrections=aggregated.get("corrections", {}),
        confidence_score=aggregated.get("confidence_score", 0.0),
    )

    request.status = ReportCorrectionRequest.STATUS_PROCESSED
    request.processed_at = version.created_at
    request.save()

    return version


def standard_analysis(text: str) -> Dict[str, Any]:
    """Perform a non-persistent standard analysis: grammar correction + medical term normalization.

    Returns a serializable dict with fields similar to a stored ReportCorrectionVersion so the frontend
    can display highlights, corrected text, corrections metadata and confidence.
    """
    if not text:
        return {
            'findings': '',
            'impression': None,
            'corrections': {},
            'confidence_score': 0.0,
            'explain': ['No text provided']
        }

    grammar_res = run_grammar_correction(text)
    medical_res = run_medical_term_check(grammar_res.get('corrected_text', text))
    aggregated = aggregate_corrections(grammar_res, medical_res)

    # Shape the response to the frontend expectations
    response = {
        'findings': aggregated.get('findings'),
        'impression': aggregated.get('impression'),
        'corrections': aggregated.get('corrections'),
        'confidence_score': aggregated.get('confidence_score'),
        'explain': []
    }

    # Add grammar explain strings if available
    if grammar_res and grammar_res.get('explain'):
        response['explain'].extend(grammar_res.get('explain'))

    # Add medical changes explanation
    if medical_res and medical_res.get('changes'):
        response['explain'].append(f"Medical changes: {len(medical_res.get('changes'))} items")

    return response
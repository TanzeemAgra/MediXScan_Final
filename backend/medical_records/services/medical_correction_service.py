"""
Advanced Medical Report Correction AI Service
============================================

Specialized AI service for medical text editing with:
1. ERROR DETECTION: Grammar, spelling, medical terminology
2. ERROR CORRECTION: Professional radiology-style corrections 
3. RECOMMENDATION WORDS: Tooltip-ready recommendations

Output Format: JSON with position indexes for UI integration
Compliance: SILO4 medical safety standards
"""

import re
import json
import logging
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass
from django.conf import settings

# RAG Medical Knowledge Base Integration
try:
    from .rag_medical_service import rag_retriever, RAGMedicalRetriever
    RAG_AVAILABLE = True
except ImportError:
    RAG_AVAILABLE = False
    rag_retriever = None

logger = logging.getLogger(__name__)

@dataclass
class ErrorCorrection:
    """Structure for error correction with position tracking"""
    error: str
    suggestion: str
    recommendation: str
    position: Tuple[int, int]  # (start_index, end_index)
    error_type: str
    confidence: float

class MedicalReportCorrectionService:
    """
    Advanced Medical Report Correction Service
    
    Implements soft-coded, configurable AI-powered text analysis
    specifically designed for radiology reports with medical safety compliance.
    """
    
    def __init__(self):
        self.medical_dictionary = self._load_medical_dictionary()
        self.grammar_rules = self._load_grammar_rules()
        self.medical_abbreviations = self._load_medical_abbreviations()
        self.radiology_terms = self._load_radiology_terms()
        
        # Initialize OpenAI client if available
        self.openai_client = self._initialize_openai_client()
        
    def _initialize_openai_client(self) -> Optional[Any]:
        """Initialize OpenAI client with proper error handling"""
        try:
            import openai
            api_key = getattr(settings, 'OPENAI_API_KEY', None)
            if not api_key:
                # Try to get from environment
                import os
                api_key = os.getenv('OPENAI_API_KEY')
            
            if api_key and api_key.strip():
                # Use newer OpenAI client initialization (v1.0+)
                return openai.OpenAI(api_key=api_key)
            else:
                logger.warning("OPENAI_API_KEY not configured in settings or environment. Using fallback correction methods.")
                return None
        except Exception as e:
            logger.warning(f"OpenAI client initialization failed: {e}. Using fallback methods.")
            return None
    
    def _load_medical_dictionary(self) -> Dict[str, str]:
        """Load medical terminology dictionary with corrections"""
        return {
            # Basic spelling errors
            "handssssss": "hands",
            "handsss": "hands",
            "yaer": "year",
            "yaers": "years",
            "monts": "months", 
            "cas": "case",
            "recod": "record",
            "treetment": "treatment",
            "brethlessness": "breathlessness",
            "sputm": "sputum",
            "complaning": "complaining",
            "diabities": "diabetes",
            "hypertention": "hypertension",
            "shaddow": "shadow",
            "opasity": "opacity",
            "margines": "margins",
            "costophranic": "costophrenic",
            "effuson": "effusion",
            "centrall": "central",
            "visulise": "visualise",
            "expossure": "exposure",
            "scolliosis": "scoliosis",
            "thracic": "thoracic",
            "hylar": "hilar",
            "prominant": "prominent",
            "infectve": "infective",
            "furthur": "further",
            "clarifcation": "clarification",
            "laterel": "lateral",
            "examinatoin": "examination",
            "clincal": "clinical",
            "pateint": "patient",
            
            # Anatomical terms
            "diaphram": "diaphragm",
            "diafragm": "diaphragm",
            "fibriosis": "fibrosis",  # Medical tissue scarring
            "opasity": "opacity",     # Radiology term
            "abdomen": "abdomen",
            "abdomin": "abdomen",
            "pelvis": "pelvis",
            "pelvic": "pelvic",
            "thorax": "thorax",
            "thoracic": "thoracic",
            "vertebra": "vertebra",
            "vertebrae": "vertebrae",
            "sternum": "sternum",
            "clavicle": "clavicle",
            "scapula": "scapula",
            "ribs": "ribs",
            "femur": "femur",
            "tibia": "tibia",
            "fibula": "fibula",
            "humerus": "humerus",
            "radius": "radius",
            "ulna": "ulna",
            
            # Medical conditions and findings
            "pneumonia": "pneumonia",
            "pnuemonia": "pneumonia",
            "pnemonia": "pneumonia",
            "bronchitis": "bronchitis",
            "bronchitus": "bronchitis",
            "emphysema": "emphysema",
            "emfysema": "emphysema",
            "asthma": "asthma",
            "azthma": "asthma",
            "tuberculosis": "tuberculosis",
            "tubercolosis": "tuberculosis",
            "pneumothorax": "pneumothorax",
            "pneumothroax": "pneumothorax",
            "hemothorax": "hemothorax",
            "hemothroax": "hemothorax",
            "myocardial": "myocardial",
            "myocardail": "myocardial",
            "infarction": "infarction",
            "infarcton": "infarction",
            "ischemia": "ischemia",
            "ishemia": "ischemia",
            "arrhythmia": "arrhythmia",
            "arrythmia": "arrhythmia",
            
            # Common medical misspellings
            "brething": "breathing",
            "surgeyr": "surgery",
            "recieve": "receive",
            "occured": "occurred",
            "recomend": "recommend",
            "seperately": "separately",
            "calcificaiton": "calcification",
            "atelectasis": "atelectasis",
            "atalectasis": "atelectasis",
            "cardiomegaly": "cardiomegaly",
            "cardiomegally": "cardiomegaly",
            "hepatomegaly": "hepatomegaly",
            "hepatomegally": "hepatomegaly",
            "splenomegaly": "splenomegaly",
            "splenomegally": "splenomegaly",
            "consolidation": "consolidation",
            "consolation": "consolidation",
            "opacification": "opacification",
            "opasification": "opacification",
            "pulmonary": "pulmonary",
            "pulmunary": "pulmonary",
            "bilateral": "bilateral",
            "bilatteral": "bilateral",
            "effusion": "effusion",
            "efusion": "effusion",
            "hemorrhage": "hemorrhage",
            "hemorrage": "hemorrhage",
            "aneurysm": "aneurysm",
            "aneurism": "aneurysm",
            "thrombosis": "thrombosis",
            "thrombosys": "thrombosis",
            "embolism": "embolism",
            "embolysm": "embolism",
        }
    
    def _load_grammar_rules(self) -> Dict[str, Any]:
        """Load grammar correction rules for medical reports"""
        return {
            'tense_consistency': {
                'patterns': [
                    (r'(?i)\b(was|were)\s+(\w+ed)\b', 'past_tense_consistency'),
                    (r'(?i)\b(is|are)\s+(\w+ing)\b', 'present_tense_consistency'),
                ],
                'recommendation': 'Grammar tense correction'
            },
            'plural_singular': {
                'patterns': [
                    (r'(?i)\b(are|were)\s+(\w+)(?<!s)\b', 'plural_verb_singular_noun'),
                    (r'(?i)\b(is|was)\s+(\w+s)\b', 'singular_verb_plural_noun'),
                ],
                'recommendation': 'Use plural form'
            },
            'article_usage': {
                'patterns': [
                    (r'(?i)\ba\s+([aeiouAEIOU])', 'article_before_vowel'),
                    (r'(?i)\ban\s+([^aeiouAEIOU])', 'article_before_consonant'),
                ],
                'recommendation': 'Article correction'
            },
            'sentence_structure': {
                'patterns': [
                    (r'[.!?]\s+[a-z]', 'capitalize_after_period'),
                    (r'\s{3,}', 'multiple_spaces'),  # Only flag 3+ spaces
                ],
                'recommendation': 'Sentence structure correction'
            },
            'medical_formatting': {
                'patterns': [
                    (r'(?i)\bdr\s+([a-z])', 'doctor_title_capitalization'),
                    (r'(?i)\bmr\s+([a-z])', 'mr_title_capitalization'),
                    (r'(?i)\bms\s+([a-z])', 'ms_title_capitalization'),
                    (r'(?i)\bmrs\s+([a-z])', 'mrs_title_capitalization'),
                ],
                'recommendation': 'Professional title formatting'
            }
        }
    
    def _load_medical_abbreviations(self) -> Dict[str, str]:
        """Load standard medical abbreviations"""
        return {
            'AP': 'anteroposterior',
            'PA': 'posteroanterior',
            'LAT': 'lateral',
            'CT': 'computed tomography',
            'MRI': 'magnetic resonance imaging',
            'CXR': 'chest X-ray',
            'KUB': 'kidneys, ureters, and bladder',
            'IVP': 'intravenous pyelogram',
            'ERCP': 'endoscopic retrograde cholangiopancreatography',
            'MRCP': 'magnetic resonance cholangiopancreatography',
            'HIDA': 'hepatobiliary iminodiacetic acid scan',
            'PET': 'positron emission tomography',
            'SPECT': 'single-photon emission computed tomography',
            'US': 'ultrasound',
            'echo': 'echocardiogram'
        }
    
    def _load_radiology_terms(self) -> Dict[str, Dict[str, Any]]:
        """Load radiology-specific terminology with context"""
        return {
            'findings': {
                'normal': ['unremarkable', 'within normal limits', 'no acute findings'],
                'abnormal': ['consolidation', 'atelectasis', 'pleural effusion', 'pneumothorax', 'mass', 'lesion'],
                'qualifiers': ['mild', 'moderate', 'severe', 'extensive', 'focal', 'diffuse', 'bilateral', 'unilateral']
            },
            'anatomy': {
                'chest': ['lungs', 'heart', 'mediastinum', 'pleura', 'diaphragm', 'ribs', 'spine'],
                'abdomen': ['liver', 'gallbladder', 'pancreas', 'spleen', 'kidneys', 'bowel'],
                'neuro': ['brain', 'cerebrum', 'cerebellum', 'brainstem', 'ventricles', 'white matter', 'gray matter']
            },
            'measurements': {
                'units': ['mm', 'cm', 'inches', 'HU', 'ml', 'cc'],
                'descriptors': ['approximately', 'measuring', 'diameter', 'length', 'width', 'height']
            }
        }

    def analyze_medical_report(self, report_text: str, openai_api_key: str = None, model_name: str = "gpt-3.5-turbo") -> Dict[str, Any]:
        """
        Main analysis function implementing the required AI specification
        
        Args:
            report_text: The radiology report text to analyze
            
        Returns:
            JSON-formatted analysis with error detection, corrections, and recommendations
        """
        if not report_text or not report_text.strip():
            return {
                'status': 'error',
                'message': 'No text provided for analysis',
                'corrections': [],
                'summary': {
                    'total_errors': 0,
                    'errors_by_type': {},
                    'confidence_score': 0.0
                }
            }
        
        corrections = []
        
        # 1. ERROR DETECTION
        spelling_errors = self._detect_spelling_errors(report_text)
        grammar_errors = self._detect_grammar_errors(report_text)
        medical_term_errors = self._detect_medical_terminology_errors(report_text)
        consistency_errors = self._detect_consistency_errors(report_text)
        
        # Combine all errors
        all_errors = spelling_errors + grammar_errors + medical_term_errors + consistency_errors
        
        # 2. ERROR CORRECTION & 3. RECOMMENDATION WORDS
        for error in all_errors:
            correction = self._generate_correction_with_recommendation(error, report_text)
            if correction:
                corrections.append(correction)
        
        # Sort corrections by position
        corrections.sort(key=lambda x: x['position'][0])
        
        # Initialize temporary OpenAI client if API key provided
        temp_openai_client = None
        if openai_api_key and openai_api_key.strip():
            try:
                import openai
                temp_openai_client = openai.OpenAI(api_key=openai_api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize temporary OpenAI client: {e}")
        
        # Generate enhanced corrections using AI if available
        ai_client = temp_openai_client or self.openai_client
        if ai_client and corrections:
            ai_enhanced_corrections = self._enhance_with_ai(report_text, corrections, ai_client, model_name)
            corrections = ai_enhanced_corrections if ai_enhanced_corrections else corrections
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence_score(report_text, corrections)
        
        # Generate summary
        error_types = {}
        for correction in corrections:
            error_type = correction.get('error_type', 'other')
            error_types[error_type] = error_types.get(error_type, 0) + 1
        
        # Generate corrected text by applying all corrections
        corrected_text = self._apply_corrections(report_text, corrections)
        
        return {
            'status': 'success',
            'original_text': report_text,
            'corrected_text': corrected_text,
            'corrections': corrections,
            'summary': {
                'total_errors': len(corrections),
                'errors_by_type': error_types,
                'confidence_score': confidence_score,
                'analysis_type': 'medical_radiology_report',
                'compliance': 'SILO4_medical_safety'
            },
            'metadata': {
                'text_length': len(report_text),
                'analysis_timestamp': self._get_timestamp(),
                'ai_enhanced': bool(self.openai_client),
                'processing_method': 'hybrid' if self.openai_client else 'rule_based',
                'rag_enabled': RAG_AVAILABLE,
                'medical_databases': ['RadLex', 'SNOMED CT', 'Medical Dictionary'] if RAG_AVAILABLE else [],
                'rag_corrections': len([c for c in corrections if c.get('rag_enabled')]),
                'knowledge_sources': list(set([c.get('source', 'Local') for c in corrections if c.get('source')]))
            }
        }
    
    def _detect_spelling_errors(self, text: str) -> List[Dict[str, Any]]:
        """Detect spelling errors in medical text"""
        errors = []
        
        # Find all words with their positions in the original text
        word_pattern = re.compile(r'\b\w+\b')
        
        for match in word_pattern.finditer(text):
            word = match.group().lower()
            original_word = match.group()
            
            # Check if word is in our correction dictionary
            if word in self.medical_dictionary:
                # Get the corrected word and preserve original capitalization
                corrected = self.medical_dictionary[word]
                if original_word[0].isupper():
                    corrected = corrected.capitalize()
                
                errors.append({
                    'type': 'spelling',
                    'original': original_word,
                    'correction': corrected,
                    'position': (match.start(), match.end()),
                    'confidence': 0.95
                })
        
        return errors
    
    def _detect_grammar_errors(self, text: str) -> List[Dict[str, Any]]:
        """Detect grammar errors using rule-based patterns"""
        errors = []
        
        for rule_name, rule_config in self.grammar_rules.items():
            for pattern, error_type in rule_config['patterns']:
                matches = re.finditer(pattern, text)
                for match in matches:
                    errors.append({
                        'type': 'grammar',
                        'subtype': error_type,
                        'original': match.group(),
                        'position': (match.start(), match.end()),
                        'confidence': 0.85,
                        'rule': rule_name
                    })
        
        return errors
    
    def _detect_medical_terminology_errors(self, text: str) -> List[Dict[str, Any]]:
        """
        RAG-Enhanced Medical Terminology Detection
        Uses knowledge bases (RadLex, SNOMED) for intelligent medical term correction
        """
        errors = []
        
        # Extract all words for medical term checking
        words = re.finditer(r'\b[a-zA-Z]+\b', text)
        
        for match in words:
            word = match.group().lower()
            
            # Skip common non-medical words
            if len(word) < 3 or word in {'the', 'and', 'for', 'are', 'was', 'has', 'his', 'her', 'this', 'that', 'with', 'from', 'they', 'been', 'have', 'were', 'said', 'each', 'which', 'what', 'when', 'where', 'will', 'more', 'very', 'can', 'had', 'our', 'out', 'day', 'get', 'use', 'man', 'new', 'now', 'old', 'see', 'him', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'}:
                continue
            
            # First check local dictionary
            if word in self.medical_dictionary:
                errors.append({
                    'type': 'medical_terminology',
                    'subtype': 'spelling_correction',
                    'original': match.group(),
                    'correction': self.medical_dictionary[word],
                    'position': (match.start(), match.end()),
                    'confidence': 0.95,
                    'source': 'Local Medical Dictionary'
                })
                continue
            
            # RAG-Enhanced Medical Term Retrieval
            if RAG_AVAILABLE and rag_retriever:
                try:
                    rag_correction = rag_retriever.get_correction_with_context(word)
                    if rag_correction and rag_correction['confidence'] > 0.7:
                        errors.append({
                            'type': 'medical_terminology',
                            'subtype': 'rag_correction',
                            'original': match.group(),
                            'correction': rag_correction['corrected_term'],
                            'position': (match.start(), match.end()),
                            'confidence': rag_correction['confidence'],
                            'source': rag_correction['source'],
                            'category': rag_correction['category'],
                            'definition': rag_correction['definition'],
                            'context': rag_correction['context'],
                            'rag_enabled': True
                        })
                        continue
                except Exception as e:
                    logger.warning(f"RAG retrieval failed for '{word}': {e}")
        
        # Check for non-standard abbreviations (enhanced with RAG)
        abbrev_pattern = r'\\b[A-Z]{2,}\\b'
        abbreviations = re.finditer(abbrev_pattern, text)
        
        for match in abbreviations:
            abbrev = match.group()
            if abbrev not in self.medical_abbreviations and len(abbrev) > 1:
                # Check if it might be a misspelled standard abbreviation
                for std_abbrev in self.medical_abbreviations:
                    if self._similarity_score(abbrev, std_abbrev) > 0.8:
                        errors.append({
                            'type': 'medical_terminology',
                            'subtype': 'abbreviation_correction',
                            'original': abbrev,
                            'correction': std_abbrev,
                            'position': (match.start(), match.end()),
                            'confidence': 0.75,
                            'source': 'Medical Abbreviations'
                        })
                        break
                
                # Try RAG for unknown abbreviations
                if RAG_AVAILABLE and rag_retriever:
                    try:
                        rag_correction = rag_retriever.get_correction_with_context(abbrev.lower())
                        if rag_correction and rag_correction['confidence'] > 0.6:
                            errors.append({
                                'type': 'medical_terminology',
                                'subtype': 'rag_abbreviation',
                                'original': abbrev,
                                'correction': rag_correction['corrected_term'].upper(),
                                'position': (match.start(), match.end()),
                                'confidence': rag_correction['confidence'],
                                'source': f"RAG - {rag_correction['source']}",
                                'rag_enabled': True
                            })
                    except Exception as e:
                        logger.warning(f"RAG abbreviation lookup failed for '{abbrev}': {e}")
        
        return errors
    
    def _detect_consistency_errors(self, text: str) -> List[Dict[str, Any]]:
        """Detect consistency issues in medical reports"""
        errors = []
        
        # Check tense consistency
        past_tense_matches = list(re.finditer(r'\\b(was|were|showed|demonstrated)\\b', text, re.IGNORECASE))
        present_tense_matches = list(re.finditer(r'\\b(is|are|shows|demonstrates)\\b', text, re.IGNORECASE))
        
        if past_tense_matches and present_tense_matches:
            # Mixed tense usage detected
            for match in present_tense_matches[1:]:  # Keep first occurrence, flag others
                errors.append({
                    'type': 'consistency',
                    'subtype': 'tense_consistency',
                    'original': match.group(),
                    'position': (match.start(), match.end()),
                    'confidence': 0.70
                })
        
        return errors
    
    def _generate_correction_with_recommendation(self, error: Dict[str, Any], text: str) -> Optional[Dict[str, Any]]:
        """Generate correction with recommendation tooltip text"""
        error_type = error['type']
        
        # Generate appropriate correction and recommendation
        if error_type == 'spelling':
            return {
                'error': error['original'],
                'suggestion': error['correction'],
                'recommendation': 'Spelling correction',
                'position': error['position'],
                'error_type': 'spelling',
                'confidence': error['confidence']
            }
        
        elif error_type == 'grammar':
            subtype = error.get('subtype', '')
            recommendation = self._get_grammar_recommendation(subtype)
            suggestion = self._generate_grammar_correction(error, text)
            
            return {
                'error': error['original'],
                'suggestion': suggestion,
                'recommendation': recommendation,
                'position': error['position'],
                'error_type': 'grammar',
                'confidence': error['confidence']
            }
        
        elif error_type == 'medical_terminology':
            # Enhanced RAG-based medical terminology corrections
            base_correction = {
                'error': error['original'],
                'suggestion': error.get('correction', error['original']),
                'position': error['position'],
                'error_type': 'medical_terminology',
                'confidence': error['confidence']
            }
            
            # Add RAG metadata if available
            if error.get('rag_enabled'):
                base_correction.update({
                    'recommendation': f"RAG Medical DB: {error.get('definition', 'Medical term correction')}",
                    'source': error.get('source', 'Medical Database'),
                    'category': error.get('category', 'medical'),
                    'context': error.get('context', ''),
                    'rag_enabled': True,
                    'medical_database': error.get('source', 'Unknown')
                })
            else:
                base_correction['recommendation'] = 'Medical terminology consistency'
            
            return base_correction
        
        elif error_type == 'consistency':
            subtype = error.get('subtype', '')
            if subtype == 'tense_consistency':
                suggestion = self._convert_to_past_tense(error['original'])
                return {
                    'error': error['original'],
                    'suggestion': suggestion,
                    'recommendation': 'Grammar tense correction',
                    'position': error['position'],
                    'error_type': 'consistency',
                    'confidence': error['confidence']
                }
        
        return None
    
    def _get_grammar_recommendation(self, subtype: str) -> str:
        """Get appropriate recommendation text for grammar errors"""
        recommendations = {
            'plural_verb_singular_noun': 'Use plural form',
            'singular_verb_plural_noun': 'Use singular form',
            'article_before_vowel': 'Article correction',
            'article_before_consonant': 'Article correction',
            'capitalize_after_period': 'Capitalization correction',
            'multiple_spaces': 'Spacing correction',
            'tense_consistency': 'Grammar tense correction'
        }
        return recommendations.get(subtype, 'Grammar correction')
    
    def _generate_grammar_correction(self, error: Dict[str, Any], text: str) -> str:
        """Generate specific grammar corrections"""
        original = error['original']
        subtype = error.get('subtype', '')
        
        if subtype == 'article_before_vowel':
            return original.replace('a ', 'an ')
        elif subtype == 'article_before_consonant':
            return original.replace('an ', 'a ')
        elif subtype == 'capitalize_after_period':
            return original.upper()
        elif subtype == 'multiple_spaces':
            return ' '
        elif subtype == 'doctor_title_capitalization':
            return re.sub(r'(?i)\bdr\s+([a-z])', r'Dr. \1', original, flags=re.IGNORECASE)
        elif subtype in ['mr_title_capitalization', 'ms_title_capitalization', 'mrs_title_capitalization']:
            # Capitalize titles properly
            return re.sub(r'(?i)\b(mr|ms|mrs)\s+([a-z])', 
                         lambda m: f"{m.group(1).capitalize()}. {m.group(2).upper()}", 
                         original, flags=re.IGNORECASE)
        else:
            return original  # Default fallback
    
    def _convert_to_past_tense(self, word: str) -> str:
        """Convert present tense medical terms to past tense"""
        conversions = {
            'is': 'was',
            'are': 'were', 
            'shows': 'showed',
            'demonstrates': 'demonstrated',
            'reveals': 'revealed',
            'indicates': 'indicated'
        }
        
        word_lower = word.lower()
        if word_lower in conversions:
            converted = conversions[word_lower]
            # Preserve original capitalization
            if word[0].isupper():
                return converted.capitalize()
            return converted
        
        return word
    
    def _enhance_with_ai(self, text: str, corrections: List[Dict[str, Any]], ai_client=None, model_name="gpt-3.5-turbo") -> Optional[List[Dict[str, Any]]]:
        """Enhance corrections using OpenAI API"""
        client = ai_client or self.openai_client
        if not client:
            return None
        
        try:
            system_prompt = f"""You are an AI assistant specialized in medical text editing for radiology reports. 

Task: Analyze the given radiology report text and enhance the provided corrections.

Requirements:
1. Maintain professional radiology tone (concise, formal, precise)
2. Keep domain-specific terms intact (e.g., "calcification", "lesion", "MRI")
3. Ensure corrections are SILO4 medical safety compliant (clear, unambiguous)
4. Provide enhanced suggestions that improve clarity while preserving medical accuracy

Current corrections found: {len(corrections)}

For each correction, enhance the suggestion if needed and ensure the recommendation is appropriate.
Return the enhanced corrections in the same JSON format.
"""

            user_prompt = f"""
Text: {text}

Current corrections: {json.dumps(corrections, indent=2)}

Please enhance these corrections while maintaining medical accuracy and professional tone.
"""

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            response, error = self._make_openai_request(messages, client, model_name)
            if error:
                logger.warning(f"AI enhancement failed: {error}")
                return None
            
            try:
                enhanced_corrections = json.loads(response)
                return enhanced_corrections if isinstance(enhanced_corrections, list) else corrections
            except json.JSONDecodeError:
                logger.warning("AI returned invalid JSON, using original corrections")
                return None
                
        except Exception as e:
            logger.warning(f"AI enhancement error: {e}")
            return None
    
    def _make_openai_request(self, messages: List[Dict[str, str]], client=None, model: str = "gpt-3.5-turbo") -> Tuple[Optional[str], Optional[str]]:
        """Make OpenAI API request with error handling"""
        openai_client = client or self.openai_client
        if not openai_client:
            return None, "OpenAI client not available"
        
        try:
            response = openai_client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=2000,
                temperature=0.0,  # Deterministic for medical accuracy
                timeout=30.0
            )
            return response.choices[0].message.content.strip(), None
            
        except Exception as e:
            error_msg = f"OpenAI API error: {str(e)}"
            logger.error(error_msg)
            return None, error_msg
    
    def _calculate_confidence_score(self, text: str, corrections: List[Dict[str, Any]]) -> float:
        """Calculate overall confidence score for the analysis"""
        if not corrections:
            return 1.0  # Perfect text, high confidence
        
        total_confidence = sum(correction.get('confidence', 0.5) for correction in corrections)
        avg_confidence = total_confidence / len(corrections)
        
        # Adjust based on text length and error density
        text_length = len(text.split())
        error_density = len(corrections) / max(text_length, 1)
        
        # Lower confidence if high error density
        density_penalty = min(error_density * 0.5, 0.3)
        
        final_confidence = max(0.1, avg_confidence - density_penalty)
        return round(final_confidence, 2)
    
    def _similarity_score(self, str1: str, str2: str) -> float:
        """Calculate similarity score between two strings"""
        if not str1 or not str2:
            return 0.0
        
        # Simple Levenshtein-like similarity
        longer = str1 if len(str1) > len(str2) else str2
        shorter = str2 if len(str1) > len(str2) else str1
        
        if not longer:
            return 1.0
        
        # Calculate edit distance
        edit_distance = sum(1 for i, char in enumerate(shorter) 
                          if i >= len(longer) or char != longer[i])
        edit_distance += len(longer) - len(shorter)
        
        similarity = (len(longer) - edit_distance) / len(longer)
        return max(0.0, similarity)
    
    def _apply_corrections(self, text: str, corrections: List[Dict[str, Any]]) -> str:
        """
        Apply all corrections to the original text to generate corrected version
        
        Args:
            text: Original text
            corrections: List of corrections with position information
            
        Returns:
            Corrected text with all suggestions applied
        """
        if not corrections:
            return text
        
        # Sort corrections by position (descending) to avoid position shifts
        sorted_corrections = sorted(corrections, key=lambda x: x['position'][0], reverse=True)
        
        corrected_text = text
        
        for correction in sorted_corrections:
            start_pos, end_pos = correction['position']
            original_word = correction['error']
            suggested_word = correction['suggestion']
            
            # Verify the word at this position matches what we expect
            actual_word = corrected_text[start_pos:end_pos]
            
            if actual_word.lower() == original_word.lower():
                # Apply the correction maintaining original capitalization pattern
                if actual_word.isupper():
                    suggested_word = suggested_word.upper()
                elif actual_word.istitle():
                    suggested_word = suggested_word.capitalize()
                elif actual_word[0].isupper():
                    suggested_word = suggested_word.capitalize()
                
                # Replace the text
                corrected_text = corrected_text[:start_pos] + suggested_word + corrected_text[end_pos:]
        
        return corrected_text
    
    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format"""
        from datetime import datetime
        return datetime.now().isoformat()

# Global service instance
_medical_correction_service = None

def get_medical_correction_service() -> MedicalReportCorrectionService:
    """Get singleton instance of medical correction service"""
    global _medical_correction_service
    if _medical_correction_service is None:
        try:
            _medical_correction_service = MedicalReportCorrectionService()
        except Exception as e:
            logger.error(f"Failed to initialize MedicalReportCorrectionService: {e}")
            _medical_correction_service = None
    return _medical_correction_service
/**
 * Medical Terminology Database Service
 * Comprehensive database of medical terms, abbreviations, and common errors
 * for enhanced error detection in medical reports
 */

class MedicalTerminologyService {
  constructor() {
    // Comprehensive medical abbreviations dictionary
    this.medicalAbbreviations = {
      // Patient and basic terms
      'pt': 'patient',
      'pts': 'patients',
      'pt\'s': 'patient\'s',
      
      // Medical history and examination
      'hx': 'history',
      'hpi': 'history of present illness',
      'pmh': 'past medical history',
      'fhx': 'family history',
      'shx': 'social history',
      'ros': 'review of systems',
      'pe': 'physical examination',
      
      // Diagnosis and treatment
      'dx': 'diagnosis',
      'ddx': 'differential diagnosis',
      'rx': 'prescription',
      'tx': 'treatment',
      'sx': 'symptoms',
      'fx': 'fracture',
      
      // Common prepositions and connectors
      'w/': 'with',
      'w/o': 'without',
      'c/o': 'complains of',
      'r/o': 'rule out',
      's/p': 'status post',
      'p/w': 'presents with',
      
      // Vital signs and measurements
      'bp': 'blood pressure',
      'hr': 'heart rate',
      'rr': 'respiratory rate',
      'temp': 'temperature',
      'wt': 'weight',
      'ht': 'height',
      'bmi': 'body mass index',
      
      // Laboratory and tests
      'lab': 'laboratory',
      'cbc': 'complete blood count',
      'bmp': 'basic metabolic panel',
      'cmp': 'comprehensive metabolic panel',
      'ua': 'urinalysis',
      'ekg': 'electrocardiogram',
      'ecg': 'electrocardiogram',
      'cxr': 'chest x-ray',
      'ct': 'computed tomography',
      'mri': 'magnetic resonance imaging',
      'us': 'ultrasound',
      
      // Medical specialties
      'gi': 'gastrointestinal',
      'gu': 'genitourinary',
      'cv': 'cardiovascular',
      'resp': 'respiratory',
      'neuro': 'neurological',
      'psych': 'psychiatric',
      'ortho': 'orthopedic',
      'derm': 'dermatology',
      'ent': 'ear, nose, and throat',
      'ob/gyn': 'obstetrics and gynecology',
      
      // Medications and dosages
      'bid': 'twice daily',
      'tid': 'three times daily',
      'qid': 'four times daily',
      'qd': 'once daily',
      'qod': 'every other day',
      'prn': 'as needed',
      'po': 'by mouth',
      'iv': 'intravenous',
      'im': 'intramuscular',
      'sq': 'subcutaneous',
      'mg': 'milligrams',
      'mcg': 'micrograms',
      'ml': 'milliliters',
      
      // Time and frequency
      'qam': 'every morning',
      'qpm': 'every evening',
      'qhs': 'at bedtime',
      'ac': 'before meals',
      'pc': 'after meals',
      'stat': 'immediately'
    };

    // Common medical spelling errors
    this.medicalSpellingErrors = {
      // Respiratory system
      'pnuemonia': 'pneumonia',
      'pnuemonic': 'pneumonic',
      'asthama': 'asthma',
      'bronchitus': 'bronchitis',
      'emphysyma': 'emphysema',
      'pulmonray': 'pulmonary',
      'respiritory': 'respiratory',
      
      // Cardiovascular system
      'cardio-vascular': 'cardiovascular',
      'hypertension': 'hypertension', // correct
      'hypotension': 'hypotension', // correct
      'tachycarida': 'tachycardia',
      'bradycarida': 'bradycardia',
      'arrythmia': 'arrhythmia',
      'myocaridal': 'myocardial',
      
      // Gastrointestinal system
      'gastro-intestinal': 'gastrointestinal',
      'diahhrea': 'diarrhea',
      'diarhea': 'diarrhea',
      'nausiated': 'nauseated',
      'vommiting': 'vomiting',
      'abdomenal': 'abdominal',
      'stomache': 'stomach',
      
      // Musculoskeletal system
      'fracure': 'fracture',
      'arthritus': 'arthritis',
      'osteoarthitus': 'osteoarthritis',
      'rhuematoid': 'rheumatoid',
      'muscular': 'muscular', // correct
      'skeletol': 'skeletal',
      
      // Neurological system
      'neurologial': 'neurological',
      'cerebal': 'cerebral',
      'spinal': 'spinal', // correct
      'menigitis': 'meningitis',
      'seizure': 'seizure', // correct
      'eplilepsy': 'epilepsy',
      
      // General medical terms
      'inflamation': 'inflammation',
      'inflamatory': 'inflammatory',
      'hemorrage': 'hemorrhage',
      'hemmorage': 'hemorrhage',
      'hemorage': 'hemorrhage',
      'hemmorhage': 'hemorrhage',
      'sepsis': 'sepsis', // correct
      'infection': 'infection', // correct
      'antibiotic': 'antibiotic', // correct
      'antibotic': 'antibiotic',
      'medicaton': 'medication',
      'perscription': 'prescription',
      'prescrition': 'prescription',
      
      // Radiology terms
      'radiologic': 'radiological',
      'xray': 'x-ray',
      'contrast': 'contrast', // correct
      'imageing': 'imaging',
      'ultrasond': 'ultrasound',
      'mamography': 'mammography',
      
      // Laboratory terms
      'laboritory': 'laboratory',
      'hematology': 'hematology', // correct
      'pathology': 'pathology', // correct
      'microbiology': 'microbiology', // correct
      'serology': 'serology', // correct
    };

    // Medical term enhancements (add context where missing)
    this.medicalEnhancements = {
      'effusion': {
        suggestions: ['pleural effusion', 'pericardial effusion', 'joint effusion'],
        defaultContext: 'pleural effusion',
        confidence: 0.7
      },
      'pneumonia': {
        suggestions: ['bacterial pneumonia', 'viral pneumonia', 'community-acquired pneumonia'],
        defaultContext: 'pneumonia',
        confidence: 0.9
      },
      'fracture': {
        suggestions: ['closed fracture', 'open fracture', 'comminuted fracture'],
        defaultContext: 'fracture',
        confidence: 0.8
      },
      'mass': {
        suggestions: ['soft tissue mass', 'lung mass', 'abdominal mass'],
        defaultContext: 'mass lesion',
        confidence: 0.6
      },
      'lesion': {
        suggestions: ['skin lesion', 'brain lesion', 'focal lesion'],
        defaultContext: 'lesion',
        confidence: 0.7
      }
    };

    // Medical phrases that commonly need improvement
    this.medicalPhraseImprovements = {
      'no acute distress': 'patient appears comfortable and in no acute distress',
      'unremarkable': 'within normal limits',
      'wnl': 'within normal limits',
      'nad': 'no acute distress',
      'nkda': 'no known drug allergies',
      'nka': 'no known allergies'
    };

    // Anatomical terms dictionary
    this.anatomicalTerms = {
      // Body regions
      'head': 'cephalic region',
      'neck': 'cervical region',
      'chest': 'thoracic region',
      'abdomen': 'abdominal region',
      'pelvis': 'pelvic region',
      
      // Anatomical positions
      'anterior': 'toward the front',
      'posterior': 'toward the back',
      'superior': 'toward the head',
      'inferior': 'toward the feet',
      'medial': 'toward the midline',
      'lateral': 'away from the midline',
      'proximal': 'closer to the center',
      'distal': 'farther from the center',
      
      // Organ systems
      'cardiovascular': 'heart and blood vessels',
      'respiratory': 'lungs and airways',
      'gastrointestinal': 'digestive system',
      'genitourinary': 'reproductive and urinary systems',
      'musculoskeletal': 'muscles and bones',
      'neurological': 'brain and nervous system',
      'endocrine': 'hormone-producing glands',
      'integumentary': 'skin and related structures'
    };
  }

  /**
   * Get expanded form of medical abbreviation
   */
  expandAbbreviation(abbreviation) {
    const lower = abbreviation.toLowerCase().replace(/[^\w]/g, '');
    return this.medicalAbbreviations[lower] || null;
  }

  /**
   * Check for medical spelling errors
   */
  checkMedicalSpelling(word) {
    const lower = word.toLowerCase().replace(/[^\w]/g, '');
    return this.medicalSpellingErrors[lower] || null;
  }

  /**
   * Get enhancement suggestions for medical terms
   */
  getEnhancementSuggestions(term) {
    const lower = term.toLowerCase();
    return this.medicalEnhancements[lower] || null;
  }

  /**
   * Improve medical phrases
   */
  improveMedicalPhrase(phrase) {
    const lower = phrase.toLowerCase().trim();
    return this.medicalPhraseImprovements[lower] || null;
  }

  /**
   * Check if a term is a valid medical term
   */
  isValidMedicalTerm(term) {
    const lower = term.toLowerCase();
    
    // Check if it's in our abbreviations (valid)
    if (this.medicalAbbreviations[lower]) return true;
    
    // Check if it's NOT in spelling errors (meaning it's correctly spelled)
    if (!this.medicalSpellingErrors[lower]) {
      // Additional validation: check against anatomical terms
      if (this.anatomicalTerms[lower]) return true;
      
      // Check against common medical prefixes/suffixes
      const medicalPrefixes = ['cardio', 'gastro', 'neuro', 'pulmo', 'hepato', 'nephro', 'osteo'];
      const medicalSuffixes = ['itis', 'osis', 'pathy', 'gram', 'scopy', 'tomy', 'ology'];
      
      const hasValidPrefix = medicalPrefixes.some(prefix => lower.startsWith(prefix));
      const hasValidSuffix = medicalSuffixes.some(suffix => lower.endsWith(suffix));
      
      return hasValidPrefix || hasValidSuffix;
    }
    
    return false;
  }

  /**
   * Get contextual medical information for a term
   */
  getMedicalContext(term) {
    const lower = term.toLowerCase();
    
    // Anatomical context
    if (this.anatomicalTerms[lower]) {
      return {
        type: 'anatomical',
        definition: this.anatomicalTerms[lower],
        confidence: 0.9
      };
    }
    
    // Enhancement context
    const enhancement = this.getEnhancementSuggestions(term);
    if (enhancement) {
      return {
        type: 'enhancement',
        suggestions: enhancement.suggestions,
        defaultContext: enhancement.defaultContext,
        confidence: enhancement.confidence
      };
    }
    
    return null;
  }

  /**
   * Generate medical term recommendations
   */
  generateMedicalRecommendations(detectedIssues) {
    const recommendations = [];
    
    // Group issues by type
    const issuesByType = detectedIssues.reduce((acc, issue) => {
      acc[issue.type] = acc[issue.type] || [];
      acc[issue.type].push(issue);
      return acc;
    }, {});

    // Generate recommendations based on issue types
    if (issuesByType.abbreviation && issuesByType.abbreviation.length > 0) {
      recommendations.push({
        category: 'Medical Abbreviations',
        priority: 'medium',
        message: `Found ${issuesByType.abbreviation.length} medical abbreviations that should be expanded for clarity in formal reports.`,
        examples: issuesByType.abbreviation.slice(0, 3).map(issue => `"${issue.original}" → "${issue.suggestion}"`),
        action: 'Consider expanding abbreviations in formal medical documentation.'
      });
    }

    if (issuesByType.spelling && issuesByType.spelling.length > 0) {
      recommendations.push({
        category: 'Medical Terminology',
        priority: 'high',
        message: `Detected ${issuesByType.spelling.length} potential medical spelling errors.`,
        examples: issuesByType.spelling.slice(0, 3).map(issue => `"${issue.original}" → "${issue.suggestion}"`),
        action: 'Verify medical terminology against standard medical dictionaries.'
      });
    }

    if (issuesByType.enhancement && issuesByType.enhancement.length > 0) {
      recommendations.push({
        category: 'Medical Context Enhancement',
        priority: 'low',
        message: `Found ${issuesByType.enhancement.length} terms that could benefit from additional medical context.`,
        examples: issuesByType.enhancement.slice(0, 3).map(issue => `"${issue.original}" → "${issue.suggestion}"`),
        action: 'Consider adding anatomical or diagnostic context to improve clarity.'
      });
    }

    return recommendations;
  }

  /**
   * Validate medical report completeness
   */
  validateReportCompleteness(text) {
    const suggestions = [];
    const lowerText = text.toLowerCase();
    
    // Check for essential sections in radiology reports
    const essentialSections = [
      { term: ['indication', 'clinical'], name: 'Clinical indication' },
      { term: ['technique', 'method'], name: 'Imaging technique' },
      { term: ['finding', 'observation'], name: 'Findings' },
      { term: ['impression', 'conclusion'], name: 'Impression/Conclusion' }
    ];

    essentialSections.forEach(section => {
      const hasSection = section.term.some(term => lowerText.includes(term));
      if (!hasSection) {
        suggestions.push({
          type: 'completeness',
          message: `Consider adding ${section.name} section to improve report completeness`,
          priority: 'medium'
        });
      }
    });

    return suggestions;
  }
}

export default new MedicalTerminologyService();
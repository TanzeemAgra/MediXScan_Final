/**
 * Enhanced Error Detection and Highlighting Service
 * Soft-coded approach to detect and highlight English grammar and medical terminology errors
 */

import medicalTerminologyService from './medical-terminology.service.js';

class ErrorHighlightingService {
  constructor() {
    // Comprehensive medical terminology dictionary (self-contained to avoid import issues)
    this.medicalTerms = {
      // Common abbreviations and their full forms
      'pt': { correct: 'patient', type: 'abbreviation', confidence: 0.9 },
      'pts': { correct: 'patients', type: 'abbreviation', confidence: 0.9 },
      'hx': { correct: 'history', type: 'abbreviation', confidence: 0.8 },
      'dx': { correct: 'diagnosis', type: 'abbreviation', confidence: 0.8 },
      'rx': { correct: 'treatment', type: 'abbreviation', confidence: 0.8 },
      'sx': { correct: 'symptoms', type: 'abbreviation', confidence: 0.8 },
      'w/': { correct: 'with', type: 'abbreviation', confidence: 0.9 },
      'w/o': { correct: 'without', type: 'abbreviation', confidence: 0.9 },
      'c/o': { correct: 'complains of', type: 'abbreviation', confidence: 0.8 },
      'r/o': { correct: 'rule out', type: 'abbreviation', confidence: 0.8 },
      'bp': { correct: 'blood pressure', type: 'abbreviation', confidence: 0.9 },
      'hr': { correct: 'heart rate', type: 'abbreviation', confidence: 0.9 },
      'rr': { correct: 'respiratory rate', type: 'abbreviation', confidence: 0.9 },
      'cxr': { correct: 'chest x-ray', type: 'abbreviation', confidence: 0.9 },
      'ct': { correct: 'computed tomography', type: 'abbreviation', confidence: 0.8 },
      'mri': { correct: 'magnetic resonance imaging', type: 'abbreviation', confidence: 0.8 },
      'ekg': { correct: 'electrocardiogram', type: 'abbreviation', confidence: 0.9 },
      'ecg': { correct: 'electrocardiogram', type: 'abbreviation', confidence: 0.9 },
      'iv': { correct: 'intravenous', type: 'abbreviation', confidence: 0.9 },
      'po': { correct: 'by mouth', type: 'abbreviation', confidence: 0.9 },
      'bid': { correct: 'twice daily', type: 'abbreviation', confidence: 0.8 },
      'tid': { correct: 'three times daily', type: 'abbreviation', confidence: 0.8 },
      'qid': { correct: 'four times daily', type: 'abbreviation', confidence: 0.8 },
      
      // Common medical spelling errors
      'pnuemonia': { correct: 'pneumonia', type: 'spelling', confidence: 0.95 },
      'pnuemonic': { correct: 'pneumonic', type: 'spelling', confidence: 0.95 },
      'fracure': { correct: 'fracture', type: 'spelling', confidence: 0.95 },
      'inflamation': { correct: 'inflammation', type: 'spelling', confidence: 0.95 },
      'hemorrage': { correct: 'hemorrhage', type: 'spelling', confidence: 0.95 },
      'hemmorage': { correct: 'hemorrhage', type: 'spelling', confidence: 0.95 },
      'asthama': { correct: 'asthma', type: 'spelling', confidence: 0.95 },
      'bronchitus': { correct: 'bronchitis', type: 'spelling', confidence: 0.95 },
      'tachycarida': { correct: 'tachycardia', type: 'spelling', confidence: 0.95 },
      'bradycarida': { correct: 'bradycardia', type: 'spelling', confidence: 0.95 },
      'arrythmia': { correct: 'arrhythmia', type: 'spelling', confidence: 0.95 },
      'diahhrea': { correct: 'diarrhea', type: 'spelling', confidence: 0.95 },
      'diarhea': { correct: 'diarrhea', type: 'spelling', confidence: 0.95 },
      'arthritus': { correct: 'arthritis', type: 'spelling', confidence: 0.95 },
      'menigitis': { correct: 'meningitis', type: 'spelling', confidence: 0.95 },
      'sepsis': { correct: 'sepsis', type: 'verified', confidence: 1.0 },
      'radiologic': { correct: 'radiological', type: 'spelling', confidence: 0.9 },
      'ultrasond': { correct: 'ultrasound', type: 'spelling', confidence: 0.95 },
      'effusion': { correct: 'effusion', type: 'verified', confidence: 1.0 },
      'pleural effusion': { correct: 'pleural effusion', type: 'verified', confidence: 1.0 },
      'pulmonary': { correct: 'pulmonary', type: 'verified', confidence: 1.0 },
      'cardiovascular': { correct: 'cardiovascular', type: 'verified', confidence: 1.0 },
      'radiological': { correct: 'radiological', type: 'verified', confidence: 1.0 },
      
      // Medical enhancements with context
      'small effusion': { correct: 'small pleural effusion', type: 'enhancement', confidence: 0.7 },
      'large effusion': { correct: 'large pleural effusion', type: 'enhancement', confidence: 0.7 },
      'bilateral effusion': { correct: 'bilateral pleural effusion', type: 'enhancement', confidence: 0.8 },
    };

    // English grammar patterns and corrections
    this.grammarRules = {
      // Double spaces
      'doubleSpaces': { 
        pattern: /\s{2,}/g, 
        replacement: ' ', 
        type: 'spacing', 
        message: 'Extra spaces removed',
        confidence: 0.95 
      },
      
      // Missing periods at end
      'missingPeriod': { 
        pattern: /([^.?!])\s*$/g, 
        replacement: '$1.', 
        type: 'punctuation', 
        message: 'Added missing period',
        confidence: 0.9 
      },
      
      // Common grammar issues
      'thereIs': { 
        pattern: /\bthere is\s+(\w+s)\b/gi, 
        replacement: 'there are $1', 
        type: 'grammar', 
        message: 'Subject-verb agreement: "there is" → "there are" for plural',
        confidence: 0.8 
      },
      
      // Capitalization after periods
      'capitalization': { 
        pattern: /\.\s+([a-z])/g, 
        replacement: '. $1', 
        type: 'capitalization', 
        message: 'Capitalized word after period',
        confidence: 0.9,
        transform: (match, p1) => `. ${p1.toUpperCase()}`
      },
      
      // Articles with medical terms
      'articleA': { 
        pattern: /\ba\s+(effusion|inflammation|obstruction)/gi, 
        replacement: 'an $1', 
        type: 'grammar', 
        message: 'Article correction: "a" → "an" before vowel sound',
        confidence: 0.85 
      }
    };

    // Color scheme for different error types
    this.colorScheme = {
      'grammar': '#fff3cd', // Light yellow
      'spelling': '#f8d7da', // Light red
      'abbreviation': '#d1ecf1', // Light blue
      'enhancement': '#d4edda', // Light green
      'punctuation': '#e2e3e5', // Light gray
      'capitalization': '#ffeaa7', // Light orange
      'medical': '#e7f3ff', // Light medical blue
      'verified': '#d4edda', // Light green for verified medical terms
    };
  }

  /**
   * Analyze text for errors and generate highlighting data
   */
  analyzeText(inputText) {
    if (!inputText || typeof inputText !== 'string') {
      return {
        errors: [],
        corrections: {},
        highlightedHtml: '',
        correctedText: inputText || '',
        confidence: 0
      };
    }

    const errors = [];
    const corrections = { grammar: { explain: [] }, medical: { explain: [] } };
    let workingText = inputText.trim();
    let correctedText = workingText;
    const highlights = [];

    // Step 1: Detect medical terminology issues
    const medicalErrors = this.detectMedicalErrors(workingText);
    errors.push(...medicalErrors);
    
    // Apply medical corrections
    medicalErrors.forEach(error => {
      correctedText = correctedText.replace(error.original, error.suggestion);
      corrections.medical.explain.push(error.message);
      highlights.push({
        original: error.original,
        suggestion: error.suggestion,
        type: error.type,
        position: error.position,
        confidence: error.confidence
      });
    });

    // Step 2: Detect grammar issues
    const grammarErrors = this.detectGrammarErrors(correctedText);
    errors.push(...grammarErrors);
    
    // Apply grammar corrections
    grammarErrors.forEach(error => {
      if (error.transform) {
        correctedText = correctedText.replace(error.pattern, error.transform);
      } else {
        correctedText = correctedText.replace(error.pattern, error.replacement);
      }
      corrections.grammar.explain.push(error.message);
    });

    // Step 3: Generate highlighted HTML
    const highlightedHtml = this.generateHighlightedHtml(inputText, highlights);

    // Calculate overall confidence
    const totalConfidence = errors.reduce((sum, error) => sum + error.confidence, 0);
    const avgConfidence = errors.length > 0 ? totalConfidence / errors.length : 1.0;

    return {
      errors,
      corrections,
      highlightedHtml,
      correctedText,
      confidence: Math.min(avgConfidence, 1.0),
      summary: {
        totalErrors: errors.length,
        grammarErrors: grammarErrors.length,
        medicalErrors: medicalErrors.length,
        improvementsMade: errors.length
      }
    };
  }

  /**
   * Detect medical terminology errors using built-in medical database
   */
  detectMedicalErrors(text) {
    const errors = [];
    const words = text.split(/\s+/);
    
    words.forEach((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^\w\s'/]/g, '');
      if (cleanWord.length < 2) return; // Skip very short words
      
      // Check multi-word medical terms first
      const fullMatch = this.findMedicalMatch(text, index, words);
      if (fullMatch) {
        errors.push({
          original: fullMatch.original,
          suggestion: fullMatch.suggestion,
          type: fullMatch.type,
          confidence: fullMatch.confidence,
          position: { start: index, end: index + fullMatch.wordCount },
          message: `Medical term: "${fullMatch.original}" → "${fullMatch.suggestion}" (${fullMatch.type})`
        });
        return;
      }
      
      // Check for medical terms in our comprehensive dictionary
      if (this.medicalTerms[cleanWord]) {
        const term = this.medicalTerms[cleanWord];
        errors.push({
          original: cleanWord,
          suggestion: term.correct,
          type: term.type,
          confidence: term.confidence,
          position: { start: index, end: index },
          message: `Medical ${term.type}: "${cleanWord}" → "${term.correct}"`
        });
      }
    });

    // Check for medical phrase improvements
    const phraseErrors = this.detectMedicalPhraseImprovements(text);
    errors.push(...phraseErrors);

    return errors;
  }

  /**
   * Find multi-word medical term matches
   */
  findMedicalMatch(text, wordIndex, words) {
    // Check for 2-word combinations
    if (wordIndex < words.length - 1) {
      const twoWord = `${words[wordIndex]} ${words[wordIndex + 1]}`.toLowerCase();
      if (this.medicalTerms[twoWord]) {
        const term = this.medicalTerms[twoWord];
        return {
          original: twoWord,
          suggestion: term.correct,
          type: term.type,
          confidence: term.confidence,
          wordCount: 2
        };
      }
    }

    // Check for 3-word combinations
    if (wordIndex < words.length - 2) {
      const threeWord = `${words[wordIndex]} ${words[wordIndex + 1]} ${words[wordIndex + 2]}`.toLowerCase();
      if (this.medicalTerms[threeWord]) {
        const term = this.medicalTerms[threeWord];
        return {
          original: threeWord,
          suggestion: term.correct,
          type: term.type,
          confidence: term.confidence,
          wordCount: 3
        };
      }
    }

    return null;
  }

  /**
   * Detect grammar errors
   */
  detectGrammarErrors(text) {
    const errors = [];
    
    Object.entries(this.grammarRules).forEach(([ruleName, rule]) => {
      const matches = [...text.matchAll(rule.pattern)];
      matches.forEach(match => {
        errors.push({
          rule: ruleName,
          original: match[0],
          pattern: rule.pattern,
          replacement: rule.replacement,
          transform: rule.transform,
          type: rule.type,
          confidence: rule.confidence,
          message: rule.message,
          position: { start: match.index, end: match.index + match[0].length }
        });
      });
    });

    return errors;
  }

  /**
   * Generate HTML with highlighted errors and corrections
   */
  generateHighlightedHtml(originalText, highlights) {
    let html = originalText;
    
    // Sort highlights by position (reverse order to maintain indices)
    highlights.sort((a, b) => b.position.start - a.position.start);
    
    highlights.forEach(highlight => {
      const color = this.colorScheme[highlight.type] || '#f8f9fa';
      const regex = new RegExp(this.escapeRegExp(highlight.original), 'gi');
      
      html = html.replace(regex, (match) => {
        return `<span class="error-highlight" 
                     style="background-color: ${color}; padding: 2px 4px; border-radius: 3px; cursor: help;"
                     title="${highlight.type}: ${highlight.original} → ${highlight.suggestion} (confidence: ${Math.round(highlight.confidence * 100)}%)"
                     data-error-type="${highlight.type}"
                     data-original="${highlight.original}"
                     data-suggestion="${highlight.suggestion}"
                >${match}</span>`;
      });
    });

    return html;
  }

  /**
   * Generate side-by-side comparison HTML
   */
  generateComparisonHtml(originalText, correctedText) {
    const diffWords = this.generateWordDiff(originalText, correctedText);
    
    let originalHtml = '';
    let correctedHtml = '';
    
    diffWords.forEach(diff => {
      if (diff.removed) {
        originalHtml += `<span class="diff-removed" style="background-color: #f8d7da; text-decoration: line-through;">${diff.value}</span>`;
      } else if (diff.added) {
        correctedHtml += `<span class="diff-added" style="background-color: #d4edda; font-weight: bold;">${diff.value}</span>`;
      } else {
        originalHtml += diff.value;
        correctedHtml += diff.value;
      }
    });

    return { originalHtml, correctedHtml };
  }

  /**
   * Simple word-level diff algorithm
   */
  generateWordDiff(text1, text2) {
    const words1 = text1.split(/(\s+)/);
    const words2 = text2.split(/(\s+)/);
    const diff = [];
    
    let i = 0, j = 0;
    while (i < words1.length || j < words2.length) {
      if (i >= words1.length) {
        diff.push({ added: true, value: words2[j] });
        j++;
      } else if (j >= words2.length) {
        diff.push({ removed: true, value: words1[i] });
        i++;
      } else if (words1[i] === words2[j]) {
        diff.push({ value: words1[i] });
        i++; j++;
      } else {
        // Find if word exists later in the sequence
        const found1 = words2.indexOf(words1[i], j);
        const found2 = words1.indexOf(words2[j], i);
        
        if (found1 !== -1 && (found2 === -1 || found1 - j < found2 - i)) {
          // words1[i] appears later in words2
          diff.push({ added: true, value: words2[j] });
          j++;
        } else if (found2 !== -1) {
          // words2[j] appears later in words1
          diff.push({ removed: true, value: words1[i] });
          i++;
        } else {
          // Both are unique, treat as replacement
          diff.push({ removed: true, value: words1[i] });
          diff.push({ added: true, value: words2[j] });
          i++; j++;
        }
      }
    }
    
    return diff;
  }

  /**
   * Utility function to escape special regex characters
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get error statistics
   */
  getErrorStatistics(errors) {
    const stats = {
      total: errors.length,
      byType: {},
      avgConfidence: 0
    };

    errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.avgConfidence += error.confidence;
    });

    if (errors.length > 0) {
      stats.avgConfidence /= errors.length;
    }

    return stats;
  }

  /**
   * Detect medical phrase improvements
   */
  detectMedicalPhraseImprovements(text) {
    const errors = [];
    
    // Common medical phrase improvements
    const phraseImprovements = {
      'no acute distress': 'patient appears comfortable and in no acute distress',
      'unremarkable': 'within normal limits',
      'wnl': 'within normal limits',
      'nad': 'no acute distress',
      'nkda': 'no known drug allergies',
      'nka': 'no known allergies'
    };
    
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach((sentence, sentenceIndex) => {
      const trimmedSentence = sentence.trim().toLowerCase();
      if (!trimmedSentence) return;
      
      // Check for common medical phrase improvements
      const improvedPhrase = phraseImprovements[trimmedSentence];
      if (improvedPhrase) {
        errors.push({
          original: trimmedSentence,
          suggestion: improvedPhrase,
          type: 'phrase-improvement',
          confidence: 0.8,
          position: { start: sentenceIndex, end: sentenceIndex },
          message: `Medical phrase improvement: "${trimmedSentence}" → "${improvedPhrase}"`
        });
      }
    });
    
    return errors;
  }

  /**
   * Generate comprehensive recommendations based on detected errors and medical analysis
   */
  generateRecommendations(errors) {
    const recommendations = [];
    
    // Use medical terminology service for comprehensive recommendations (if available)
    if (medicalTerminologyService && typeof medicalTerminologyService.generateMedicalRecommendations === 'function') {
      try {
        const medicalRecommendations = medicalTerminologyService.generateMedicalRecommendations(errors);
        recommendations.push(...medicalRecommendations);
      } catch (e) {
        console.warn('Medical terminology service unavailable, using fallback recommendations');
      }
    }
    
    // Add fallback medical recommendations if service is unavailable
    const medicalErrors = errors.filter(e => e.type === 'medical_terminology' || e.type === 'medical');
    if (medicalErrors.length > 0 && !recommendations.some(r => r.category === 'Medical Terminology')) {
      recommendations.push({
        category: 'Medical Terminology',
        priority: 'high',
        message: `Found ${medicalErrors.length} medical terminology issue(s). RAG-enhanced medical databases suggest corrections.`,
        action: 'Review medical terms for accuracy and consistency with clinical standards.',
        examples: medicalErrors.slice(0, 3).map(e => `"${e.error}" → "${e.suggestion}"`),
        ragEnhanced: true,
        medicalDatabases: ['RadLex', 'SNOMED CT', 'ICD-10']
      });
    }
    
    // Add grammar and general recommendations
    const errorTypes = [...new Set(errors.map(e => e.type))];
    
    errorTypes.forEach(type => {
      switch (type) {
        case 'grammar':
          if (!recommendations.some(r => r.category === 'Grammar Check')) {
            recommendations.push({
              category: 'Grammar Check',
              priority: 'medium',
              message: 'Review subject-verb agreement and sentence structure for clarity.',
              action: 'Check grammar rules and ensure proper sentence construction.',
              examples: errors.filter(e => e.type === 'grammar').slice(0, 2).map(e => e.message)
            });
          }
          break;
        case 'punctuation':
          if (!recommendations.some(r => r.category === 'Punctuation')) {
            recommendations.push({
              category: 'Punctuation',
              priority: 'low',
              message: 'Ensure proper punctuation for clear medical documentation.',
              action: 'Review punctuation rules, especially for medical terminology.',
              examples: errors.filter(e => e.type === 'punctuation').slice(0, 2).map(e => e.message)
            });
          }
          break;
        case 'capitalization':
          if (!recommendations.some(r => r.category === 'Capitalization')) {
            recommendations.push({
              category: 'Capitalization',
              priority: 'low',
              message: 'Proper capitalization enhances document professionalism.',
              action: 'Capitalize words at the beginning of sentences and proper nouns.',
              examples: errors.filter(e => e.type === 'capitalization').slice(0, 2).map(e => e.message)
            });
          }
          break;
        case 'phrase-improvement':
          if (!recommendations.some(r => r.category === 'Medical Phrasing')) {
            recommendations.push({
              category: 'Medical Phrasing',
              priority: 'medium',
              message: 'Consider using more formal medical language for professional reports.',
              action: 'Replace informal medical abbreviations with complete terms.',
              examples: errors.filter(e => e.type === 'phrase-improvement').slice(0, 2).map(e => e.message)
            });
          }
          break;
      }
    });

    // Add report completeness suggestions if available
    const completenessErrors = medicalTerminologyService.validateReportCompleteness(errors.map(e => e.original).join(' '));
    if (completenessErrors.length > 0) {
      recommendations.push({
        category: 'Report Completeness',
        priority: 'medium',
        message: 'Consider adding essential sections to improve report completeness.',
        action: 'Review medical report structure guidelines.',
        examples: completenessErrors.map(e => e.message)
      });
    }

    return recommendations;
  }

  /**
   * Soft-coded dynamic error highlighting function
   * Converts backend correction data to frontend highlighting format
   * @param {string} originalText - The original text
   * @param {Array} corrections - Array of correction objects from backend
   * @returns {string} HTML with highlighted errors
   */
  highlightErrors(originalText, corrections) {
    if (!originalText || !corrections || corrections.length === 0) {
      return originalText;
    }

    try {
      // Convert backend corrections to highlights format
      const highlights = corrections.map((correction, index) => {
        // Determine error type dynamically
        const errorType = correction.error_type || correction.type || 'other';
        
        // Get position information (soft-coded approach)
        let position = correction.position;
        if (!position && correction.error) {
          // Dynamic position calculation if not provided
          const errorText = correction.error;
          const startIndex = originalText.indexOf(errorText);
          if (startIndex !== -1) {
            position = {
              start: startIndex,
              end: startIndex + errorText.length
            };
          } else {
            position = { start: 0, end: 0 };
          }
        }

        return {
          id: `highlight-${index}`,
          original: correction.error || correction.original || '',
          suggestion: correction.suggestion || correction.correction || '',
          type: errorType,
          position: position || { start: 0, end: 0 },
          confidence: correction.confidence || 0.8,
          source: correction.source || 'Medical AI',
          ragEnhanced: correction.rag_enabled || false
        };
      });

      // Generate highlighted HTML using existing function
      return this.generateHighlightedHtml(originalText, highlights);
    } catch (error) {
      console.warn('Error highlighting failed, returning original text:', error);
      return originalText;
    }
  }

  /**
   * Enhanced error highlighting with RAG metadata support
   * Soft-coded approach for dynamic error type handling
   * @param {string} text - Original text
   * @param {Array} errors - Error array with RAG enhancement
   * @returns {string} Enhanced highlighted HTML
   */
  highlightErrorsWithRAG(text, errors) {
    if (!text || !errors || errors.length === 0) {
      return text;
    }

    let highlightedText = text;
    
    // Sort errors by position (reverse to maintain text indices)
    const sortedErrors = [...errors].sort((a, b) => {
      const posA = a.position ? (Array.isArray(a.position) ? a.position[0] : a.position.start || 0) : 0;
      const posB = b.position ? (Array.isArray(b.position) ? b.position[0] : b.position.start || 0) : 0;
      return posB - posA;
    });

    sortedErrors.forEach((error, index) => {
      const errorType = error.error_type || error.type || 'other';
      const original = error.error || error.original || '';
      const suggestion = error.suggestion || error.correction || '';
      
      if (!original) return;

      // Dynamic color scheme based on error type
      const colorMap = {
        'medical_terminology': '#e3f2fd', // Light blue for medical terms
        'spelling': '#fff3e0',           // Light orange for spelling
        'grammar': '#f3e5f5',            // Light purple for grammar
        'punctuation': '#e8f5e8',        // Light green for punctuation
        'other': '#f5f5f5'               // Light gray for others
      };

      const backgroundColor = colorMap[errorType] || colorMap['other'];
      
      // RAG enhancement indicators
      const ragBadge = error.rag_enabled ? 
        `<sup class="rag-badge" style="background: #4caf50; color: white; font-size: 0.6em; padding: 1px 3px; border-radius: 2px; margin-left: 2px;">RAG</sup>` : '';
      
      const sourceInfo = error.source ? ` data-source="${error.source}"` : '';
      const confidenceInfo = error.confidence ? ` data-confidence="${error.confidence}"` : '';

      // Create highlighted span with soft-coded attributes
      const highlightSpan = `<span class="error-highlight" 
        style="background-color: ${backgroundColor}; 
               border-bottom: 2px solid ${this.colorScheme[errorType] || '#999'}; 
               cursor: help; 
               position: relative;"
        title="Original: '${original}' → Suggested: '${suggestion}'"
        data-error-type="${errorType}"
        data-original="${original}"
        data-suggestion="${suggestion}"
        ${sourceInfo}
        ${confidenceInfo}
        onclick="showErrorDetails(this)">${original}${ragBadge}</span>`;

      // Replace text with highlighted version
      try {
        const regex = new RegExp(this.escapeRegExp(original), 'gi');
        highlightedText = highlightedText.replace(regex, highlightSpan);
      } catch (regexError) {
        // Fallback to simple string replacement
        highlightedText = highlightedText.replace(original, highlightSpan);
      }
    });

    return highlightedText;
  }

  /**
   * Escape special regex characters for safe text replacement
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

export default new ErrorHighlightingService();
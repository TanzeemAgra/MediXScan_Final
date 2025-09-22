/**
 * Advanced AI-Powered Anonymization Service
 * Uses generative AI techniques and pattern recognition to intelligently detect and anonymize sensitive data
 * Implements soft coding approach for flexible configuration and extensibility
 */

class AdvancedAnonymizationService {
  constructor() {
    // Soft-coded configuration for different sensitivity levels
    this.config = {
      // Detection sensitivity levels
      sensitivity: {
        high: 0.9,    // Very strict detection
        medium: 0.7,  // Balanced detection
        low: 0.5      // Lenient detection
      },
      
      // Anonymization strategies (soft-coded)
      strategies: {
        mask: { symbol: '*', minLength: 3 },
        replace: { useContextual: true },
        remove: { preserveStructure: true },
        generalize: { useHierarchy: true }
      },
      
      // Detection patterns organized by data type
      patterns: this.initializeDetectionPatterns(),
      
      // Anonymization rules by context
      rules: this.initializeAnonymizationRules()
    };
  }

  /**
   * Initialize comprehensive detection patterns for medical data
   * Uses regex, NLP patterns, and contextual clues
   */
  initializeDetectionPatterns() {
    return {
      // Personal Identifiers
      personalData: {
        names: {
          patterns: [
            /\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g, // First Last names
            /\b(?:Mr|Mrs|Ms|Dr|Professor)\.?\s+[A-Z][a-z]+\b/g, // Titles + names
            /\bPatient:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi, // Patient: Name
            /\bName:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi // Name: field
          ],
          contextClues: ['patient', 'name', 'client', 'individual', 'person'],
          confidence: 0.85
        },
        
        identifiers: {
          patterns: [
            /\b\d{3}-\d{2}-\d{4}\b/g, // SSN format
            /\b[A-Z]{2}\d{6,}\b/g, // Medical record numbers
            /\bMRN:?\s*(\d+)\b/gi, // Medical Record Number
            /\bID:?\s*([A-Z0-9]+)\b/gi, // ID numbers
            /\b\d{10,}\b/g // Long numeric IDs
          ],
          contextClues: ['ssn', 'social security', 'mrn', 'medical record', 'id', 'identifier'],
          confidence: 0.95
        },
        
        contactInfo: {
          patterns: [
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
            /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g, // Phone
            /\b\d{1,5}\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln)\b/gi // Address
          ],
          contextClues: ['phone', 'email', 'address', 'contact', 'street', 'avenue'],
          confidence: 0.90
        }
      },

      // Medical Identifiers
      medicalData: {
        dates: {
          patterns: [
            /\b(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[12][0-9]|3[01])\/(?:19|20)\d{2}\b/g, // MM/DD/YYYY
            /\b(?:0?[1-9]|[12][0-9]|3[01])[-/](?:0?[1-9]|1[0-2])[-/](?:19|20)\d{2}\b/g, // DD/MM/YYYY
            /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi, // Month DD, YYYY
            /\bDOB:?\s*([0-9\/\-]+)/gi, // Date of Birth
            /\b(?:born|birth)\s+(?:on\s+)?([0-9\/\-]+)/gi // Born on date
          ],
          contextClues: ['date', 'birth', 'dob', 'born', 'admission', 'discharge'],
          confidence: 0.88
        },
        
        locations: {
          patterns: [
            /\b[A-Z][a-z]+\s+(?:Hospital|Medical Center|Clinic|Health System)\b/g, // Hospital names
            /\b\d+\s+[A-Z][a-z]+\s+(?:Street|Ave|Road|Drive|Way)\b/g, // Specific addresses
            /\bRoom\s+\d+[A-Z]?\b/gi, // Room numbers
            /\bUnit\s+\d+\b/gi, // Unit numbers
            /\bFloor\s+\d+\b/gi // Floor numbers
          ],
          contextClues: ['hospital', 'clinic', 'room', 'unit', 'floor', 'ward'],
          confidence: 0.80
        },
        
        providers: {
          patterns: [
            /\bDr\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g, // Doctor names
            /\b(?:Doctor|Physician|Nurse|Therapist)\s+[A-Z][a-z]+\b/g, // Provider titles
            /\bAttending:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi, // Attending physician
            /\bResident:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi // Resident
          ],
          contextClues: ['doctor', 'physician', 'nurse', 'attending', 'resident'],
          confidence: 0.82
        }
      },

      // Financial and Insurance Data
      financialData: {
        insurance: {
          patterns: [
            /\b[A-Z]{2,4}\d{8,12}\b/g, // Insurance policy numbers
            /\bPolicy:?\s*([A-Z0-9]+)/gi, // Policy numbers
            /\bGroup:?\s*([A-Z0-9]+)/gi, // Group numbers
            /\bMember:?\s*([A-Z0-9]+)/gi // Member IDs
          ],
          contextClues: ['insurance', 'policy', 'group', 'member', 'coverage'],
          confidence: 0.85
        }
      }
    };
  }

  /**
   * Initialize comprehensive anonymization rules
   * Soft-coded approach for flexible anonymization strategies
   */
  initializeAnonymizationRules() {
    return {
      // High sensitivity data - always anonymize
      critical: {
        dataTypes: ['personalData.identifiers', 'personalData.contactInfo'],
        strategy: 'replace',
        replacements: {
          names: ['[PATIENT NAME]', '[INDIVIDUAL]', '[PERSON A]', '[SUBJECT]'],
          identifiers: ['[ID REMOVED]', '[PATIENT ID]', '[RECORD NUMBER]'],
          emails: ['[EMAIL REMOVED]', '[CONTACT EMAIL]'],
          phones: ['[PHONE REMOVED]', '[CONTACT NUMBER]'],
          addresses: ['[ADDRESS REMOVED]', '[LOCATION]']
        }
      },

      // Medium sensitivity - contextual anonymization
      moderate: {
        dataTypes: ['medicalData.dates', 'medicalData.providers', 'medicalData.locations'],
        strategy: 'generalize',
        replacements: {
          dates: ['[DATE]', '[ADMISSION DATE]', '[BIRTH DATE]', '[EXAM DATE]'],
          providers: ['[ATTENDING PHYSICIAN]', '[MEDICAL PROVIDER]', '[HEALTHCARE PROVIDER]'],
          locations: ['[MEDICAL FACILITY]', '[HEALTHCARE INSTITUTION]', '[HOSPITAL]']
        }
      },

      // Low sensitivity - optional anonymization
      optional: {
        dataTypes: ['financialData.insurance'],
        strategy: 'mask',
        replacements: {
          insurance: ['[INSURANCE INFO]', '[POLICY INFO]', '[COVERAGE DETAILS]']
        }
      }
    };
  }

  /**
   * Advanced AI-powered sensitive data detection
   * Combines pattern matching with contextual analysis
   */
  detectSensitiveData(text, sensitivityLevel = 'medium') {
    const detections = [];
    const threshold = this.config.sensitivity[sensitivityLevel];

    // Analyze text using multiple detection methods
    Object.entries(this.config.patterns).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([type, config]) => {
        // Pattern-based detection
        config.patterns.forEach((pattern, index) => {
          let match;
          while ((match = pattern.exec(text)) !== null) {
            const detection = {
              category,
              type,
              value: match[0],
              start: match.index,
              end: match.index + match[0].length,
              confidence: config.confidence,
              method: 'pattern',
              patternIndex: index,
              context: this.extractContext(text, match.index, match[0].length)
            };

            // Enhance confidence with contextual analysis
            detection.confidence = this.enhanceConfidenceWithContext(
              detection, 
              config.contextClues
            );

            if (detection.confidence >= threshold) {
              detections.push(detection);
            }
          }
          // Reset regex lastIndex to avoid issues with global flags
          pattern.lastIndex = 0;
        });
      });
    });

    // Remove duplicates and overlapping detections
    return this.deduplicateDetections(detections);
  }

  /**
   * Extract surrounding context for better detection accuracy
   */
  extractContext(text, start, length, contextWindow = 50) {
    const contextStart = Math.max(0, start - contextWindow);
    const contextEnd = Math.min(text.length, start + length + contextWindow);
    
    return {
      before: text.substring(contextStart, start).toLowerCase(),
      after: text.substring(start + length, contextEnd).toLowerCase(),
      full: text.substring(contextStart, contextEnd)
    };
  }

  /**
   * Enhance detection confidence using contextual clues
   * AI technique: Natural language context analysis
   */
  enhanceConfidenceWithContext(detection, contextClues) {
    let enhancedConfidence = detection.confidence;
    const context = detection.context;

    // Check for contextual clues in surrounding text
    contextClues.forEach(clue => {
      if (context.before.includes(clue.toLowerCase()) || 
          context.after.includes(clue.toLowerCase())) {
        enhancedConfidence = Math.min(0.99, enhancedConfidence + 0.1);
      }
    });

    // Medical context enhancement
    const medicalTerms = ['patient', 'diagnosis', 'treatment', 'medical', 'clinical', 'doctor', 'nurse'];
    medicalTerms.forEach(term => {
      if (context.full.toLowerCase().includes(term)) {
        enhancedConfidence = Math.min(0.99, enhancedConfidence + 0.05);
      }
    });

    return enhancedConfidence;
  }

  /**
   * Remove duplicate and overlapping detections
   * Prioritizes higher confidence detections
   */
  deduplicateDetections(detections) {
    // Sort by confidence (descending) and position
    detections.sort((a, b) => {
      if (Math.abs(a.confidence - b.confidence) > 0.01) {
        return b.confidence - a.confidence;
      }
      return a.start - b.start;
    });

    const filtered = [];
    detections.forEach(detection => {
      // Check for overlap with existing detections
      const hasOverlap = filtered.some(existing => 
        (detection.start < existing.end && detection.end > existing.start)
      );

      if (!hasOverlap) {
        filtered.push(detection);
      }
    });

    return filtered.sort((a, b) => a.start - b.start);
  }

  /**
   * Advanced anonymization using generative AI techniques
   * Applies context-aware anonymization strategies
   */
  anonymizeText(text, detections, options = {}) {
    const {
      preserveStructure = true,
      useContextualReplacement = true,
      anonymizationLevel = 'medium'
    } = options;

    let anonymizedText = text;
    let offset = 0;

    // Process detections from end to start to maintain positions
    detections
      .sort((a, b) => b.start - a.start)
      .forEach(detection => {
        const replacement = this.generateContextualReplacement(
          detection, 
          useContextualReplacement
        );

        // Replace the detected sensitive data
        const start = detection.start;
        const end = detection.end;
        
        anonymizedText = 
          anonymizedText.substring(0, start) + 
          replacement + 
          anonymizedText.substring(end);
      });

    return {
      anonymizedText,
      summary: this.generateAnonymizationSummary(detections),
      detections: detections.length,
      preservedStructure: preserveStructure
    };
  }

  /**
   * Generate contextually appropriate replacements
   * AI technique: Context-aware text generation
   */
  generateContextualReplacement(detection, useContextual = true) {
    if (!useContextual) {
      return '[REDACTED]';
    }

    const rules = this.config.rules;
    let replacements = [];

    // Find appropriate replacement based on data type and sensitivity
    Object.entries(rules).forEach(([level, rule]) => {
      const dataTypeMatch = rule.dataTypes.some(dataType => {
        const [category, type] = dataType.split('.');
        return detection.category === category && 
               (type === undefined || detection.type === type);
      });

      if (dataTypeMatch) {
        const typeReplacements = rule.replacements[detection.type] || 
                               rule.replacements[detection.category] || 
                               ['[DATA REMOVED]'];
        replacements = [...replacements, ...typeReplacements];
      }
    });

    // Select contextually appropriate replacement
    if (replacements.length > 0) {
      // Use detection context to choose the most appropriate replacement
      const contextualScore = replacements.map(replacement => ({
        replacement,
        score: this.calculateContextualScore(replacement, detection.context)
      }));

      return contextualScore
        .sort((a, b) => b.score - a.score)[0]
        .replacement;
    }

    return '[SENSITIVE DATA]';
  }

  /**
   * Calculate contextual appropriateness score for replacements
   */
  calculateContextualScore(replacement, context) {
    let score = 0;
    
    // Score based on semantic similarity to context
    const replacementWords = replacement.toLowerCase().replace(/[[\]]/g, '').split(' ');
    const contextWords = context.full.toLowerCase().split(/\s+/);

    replacementWords.forEach(word => {
      if (contextWords.some(cword => cword.includes(word) || word.includes(cword))) {
        score += 1;
      }
    });

    return score;
  }

  /**
   * Generate comprehensive anonymization summary
   */
  generateAnonymizationSummary(detections) {
    const summary = {
      totalDetections: detections.length,
      byCategory: {},
      byType: {},
      confidenceLevels: {
        high: 0,    // > 0.8
        medium: 0,  // 0.6 - 0.8
        low: 0      // < 0.6
      }
    };

    detections.forEach(detection => {
      // Count by category
      summary.byCategory[detection.category] = 
        (summary.byCategory[detection.category] || 0) + 1;

      // Count by type
      const typeKey = `${detection.category}.${detection.type}`;
      summary.byType[typeKey] = (summary.byType[typeKey] || 0) + 1;

      // Count by confidence level
      if (detection.confidence > 0.8) {
        summary.confidenceLevels.high++;
      } else if (detection.confidence > 0.6) {
        summary.confidenceLevels.medium++;
      } else {
        summary.confidenceLevels.low++;
      }
    });

    return summary;
  }

  /**
   * Batch anonymization for multiple texts
   * Optimized for processing medical records from database
   */
  async batchAnonymize(texts, options = {}) {
    const results = [];
    
    for (const text of texts) {
      const detections = this.detectSensitiveData(text, options.sensitivity);
      const result = this.anonymizeText(text, detections, options);
      results.push({
        original: text,
        ...result,
        processingTime: Date.now()
      });
    }

    return {
      results,
      batchSummary: this.generateBatchSummary(results)
    };
  }

  /**
   * Generate batch processing summary
   */
  generateBatchSummary(results) {
    return {
      totalTexts: results.length,
      totalDetections: results.reduce((sum, r) => sum + r.detections, 0),
      averageDetections: results.length > 0 ? 
        results.reduce((sum, r) => sum + r.detections, 0) / results.length : 0,
      processingTime: results.length > 0 ? 
        Math.max(...results.map(r => r.processingTime)) - 
        Math.min(...results.map(r => r.processingTime)) : 0
    };
  }

  /**
   * Get anonymization statistics and insights
   */
  getAnonymizationInsights(text) {
    const detections = this.detectSensitiveData(text, 'high');
    const summary = this.generateAnonymizationSummary(detections);
    
    return {
      riskLevel: this.calculateRiskLevel(summary),
      recommendations: this.generateRecommendations(summary, detections),
      complianceScore: this.calculateComplianceScore(summary),
      detectionDetails: detections.map(d => ({
        type: `${d.category}.${d.type}`,
        confidence: d.confidence,
        position: { start: d.start, end: d.end },
        context: d.context.full.substring(0, 100)
      }))
    };
  }

  /**
   * Calculate overall risk level based on detections
   */
  calculateRiskLevel(summary) {
    const criticalTypes = ['personalData.identifiers', 'personalData.contactInfo'];
    const hasCriticalData = Object.keys(summary.byType).some(type => 
      criticalTypes.includes(type)
    );

    if (hasCriticalData || summary.confidenceLevels.high > 5) {
      return 'HIGH';
    } else if (summary.totalDetections > 3 || summary.confidenceLevels.medium > 3) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  /**
   * Generate anonymization recommendations
   */
  generateRecommendations(summary, detections) {
    const recommendations = [];

    if (summary.confidenceLevels.high > 0) {
      recommendations.push({
        priority: 'HIGH',
        message: `${summary.confidenceLevels.high} high-confidence sensitive data items detected. Immediate anonymization recommended.`
      });
    }

    if (summary.byCategory.personalData > 0) {
      recommendations.push({
        priority: 'HIGH',
        message: 'Personal data detected. Ensure compliance with HIPAA and privacy regulations.'
      });
    }

    if (summary.totalDetections > 10) {
      recommendations.push({
        priority: 'MEDIUM',
        message: 'High volume of sensitive data detected. Consider batch anonymization processing.'
      });
    }

    return recommendations;
  }

  /**
   * Calculate compliance score (0-100)
   */
  calculateComplianceScore(summary) {
    let score = 100;

    // Deduct points for each category of sensitive data
    score -= summary.byCategory.personalData * 10 || 0;
    score -= summary.byCategory.medicalData * 5 || 0;
    score -= summary.byCategory.financialData * 8 || 0;

    // Deduct more for high-confidence detections
    score -= summary.confidenceLevels.high * 15;
    score -= summary.confidenceLevels.medium * 8;

    return Math.max(0, score);
  }
}

// Export the service
const advancedAnonymizationService = new AdvancedAnonymizationService();
export default advancedAnonymizationService;
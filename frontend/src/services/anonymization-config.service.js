/**
 * Anonymization Configuration Service
 * Soft-coded configuration system for flexible anonymization rules and policies
 * Supports dynamic rule updates, compliance frameworks, and custom anonymization strategies
 */

class AnonymizationConfigService {
  constructor() {
    this.config = {
      // Compliance frameworks configuration
      complianceFrameworks: {
        HIPAA: {
          name: 'Health Insurance Portability and Accountability Act',
          description: 'US healthcare privacy regulation',
          identifiers: [
            'names', 'addresses', 'birth_dates', 'admission_dates', 'discharge_dates',
            'death_dates', 'age_over_89', 'telephone_numbers', 'vehicle_identifiers',
            'device_identifiers', 'web_urls', 'ip_addresses', 'biometric_identifiers',
            'face_photos', 'unique_identifying_numbers', 'medical_record_numbers',
            'health_plan_beneficiary_numbers', 'account_numbers', 'certificate_numbers',
            'social_security_numbers', 'license_numbers', 'email_addresses'
          ],
          strictMode: true,
          allowedAges: { max: 89, replacement: '90+' }
        },

        GDPR: {
          name: 'General Data Protection Regulation',
          description: 'EU data protection regulation',
          identifiers: [
            'personal_data', 'special_categories', 'biometric_data', 'genetic_data',
            'health_data', 'racial_ethnic_origin', 'political_opinions', 'religious_beliefs',
            'trade_union_membership', 'sex_life', 'sexual_orientation'
          ],
          strictMode: true,
          rightToErasure: true
        },

        CUSTOM: {
          name: 'Custom Anonymization Rules',
          description: 'Configurable anonymization rules',
          identifiers: [],
          strictMode: false,
          customizable: true
        }
      },

      // Anonymization strategies with soft-coded parameters
      strategies: {
        MASKING: {
          name: 'Character Masking',
          description: 'Replace characters with symbols',
          config: {
            maskChar: '*',
            preserveLength: true,
            preserveFirst: 1,
            preserveLast: 0,
            minMaskLength: 3
          },
          applicableTo: ['identifiers', 'names', 'addresses', 'phone_numbers']
        },

        REPLACEMENT: {
          name: 'Token Replacement',
          description: 'Replace with contextual tokens',
          config: {
            useContextualTokens: true,
            preserveDataType: true,
            tokenFormat: '[{TYPE}]',
            numberedTokens: true
          },
          applicableTo: ['all']
        },

        GENERALIZATION: {
          name: 'Data Generalization',
          description: 'Replace with generalized values',
          config: {
            dateGeneralization: 'year',
            ageGeneralization: 'decade',
            locationGeneralization: 'state',
            numericGeneralization: 'range'
          },
          applicableTo: ['dates', 'ages', 'locations', 'numeric_values']
        },

        SUPPRESSION: {
          name: 'Data Suppression',
          description: 'Remove sensitive data entirely',
          config: {
            preserveStructure: true,
            replacementText: '[REMOVED]',
            maintainLineBreaks: true
          },
          applicableTo: ['highly_sensitive', 'identifiers']
        },

        SYNTHETIC: {
          name: 'Synthetic Data Generation',
          description: 'Replace with realistic synthetic data',
          config: {
            maintainStatistics: true,
            preserveRelationships: true,
            useRealDistributions: false,
            seedBased: true
          },
          applicableTo: ['names', 'dates', 'addresses', 'identifiers']
        }
      },

      // Data classification with confidence thresholds
      dataClassification: {
        CRITICAL: {
          sensitivity: 1.0,
          description: 'Highly sensitive data requiring immediate anonymization',
          mandatoryAnonymization: true,
          allowedStrategies: ['REPLACEMENT', 'SUPPRESSION'],
          examples: ['SSN', 'Medical Record Numbers', 'Full Names']
        },

        HIGH: {
          sensitivity: 0.8,
          description: 'High sensitivity data with strict anonymization requirements',
          mandatoryAnonymization: true,
          allowedStrategies: ['MASKING', 'REPLACEMENT', 'GENERALIZATION'],
          examples: ['Phone Numbers', 'Email Addresses', 'Specific Dates']
        },

        MEDIUM: {
          sensitivity: 0.6,
          description: 'Moderate sensitivity data with configurable anonymization',
          mandatoryAnonymization: false,
          allowedStrategies: ['MASKING', 'GENERALIZATION', 'SYNTHETIC'],
          examples: ['Ages', 'General Locations', 'Provider Names']
        },

        LOW: {
          sensitivity: 0.3,
          description: 'Low sensitivity data with optional anonymization',
          mandatoryAnonymization: false,
          allowedStrategies: ['GENERALIZATION', 'SYNTHETIC'],
          examples: ['Medical Procedures', 'Diagnosis Codes', 'General Medical Terms']
        }
      },

      // Context-aware anonymization rules
      contextRules: {
        MEDICAL_REPORT: {
          description: 'Rules for medical report anonymization',
          sections: {
            patient_info: {
              sensitivity: 'CRITICAL',
              strategy: 'REPLACEMENT',
              preserveStructure: true
            },
            clinical_notes: {
              sensitivity: 'HIGH',
              strategy: 'MASKING',
              preserveMedicalTerms: true
            },
            demographics: {
              sensitivity: 'HIGH',
              strategy: 'GENERALIZATION',
              allowAgeRanges: true
            },
            provider_notes: {
              sensitivity: 'MEDIUM',
              strategy: 'REPLACEMENT',
              anonymizeProviders: true
            }
          }
        },

        LABORATORY_RESULTS: {
          description: 'Rules for lab result anonymization',
          sections: {
            patient_identifiers: {
              sensitivity: 'CRITICAL',
              strategy: 'REPLACEMENT',
              preserveNone: true
            },
            test_results: {
              sensitivity: 'LOW',
              strategy: 'SYNTHETIC',
              preserveRanges: true
            },
            reference_values: {
              sensitivity: 'LOW',
              strategy: null,
              preserve: true
            }
          }
        }
      },

      // Output formats and preferences
      outputFormats: {
        STRUCTURED: {
          name: 'Structured Anonymization',
          description: 'Maintains original document structure',
          preserveFormatting: true,
          includeMetadata: true,
          auditTrail: true
        },

        REDACTED: {
          name: 'Traditional Redaction',
          description: 'Black bars and removed text approach',
          visualRedaction: true,
          preserveFormatting: false,
          includeMetadata: false
        },

        SYNTHETIC_REPLACEMENT: {
          name: 'Synthetic Data Replacement',
          description: 'Replace with synthetic but realistic data',
          maintainReadability: true,
          preserveContext: true,
          includeMetadata: true
        }
      }
    };
  }

  /**
   * Get anonymization configuration for specific compliance framework
   */
  getComplianceConfig(framework = 'HIPAA') {
    return this.config.complianceFrameworks[framework] || 
           this.config.complianceFrameworks.CUSTOM;
  }

  /**
   * Get strategy configuration with soft-coded parameters
   */
  getStrategyConfig(strategyName) {
    return this.config.strategies[strategyName];
  }

  /**
   * Get data classification rules
   */
  getDataClassification(level) {
    return level ? 
           this.config.dataClassification[level] : 
           this.config.dataClassification;
  }

  /**
   * Get context-specific anonymization rules
   */
  getContextRules(contextType) {
    return this.config.contextRules[contextType];
  }

  /**
   * Generate anonymization policy based on requirements
   */
  generateAnonymizationPolicy(requirements = {}) {
    const {
      complianceFramework = 'HIPAA',
      sensitivityLevel = 'HIGH',
      contextType = 'MEDICAL_REPORT',
      customRules = {}
    } = requirements;

    const complianceConfig = this.getComplianceConfig(complianceFramework);
    const sensitivityConfig = this.getDataClassification(sensitivityLevel);
    const contextConfig = this.getContextRules(contextType);

    return {
      framework: complianceConfig,
      sensitivity: sensitivityConfig,
      context: contextConfig,
      customRules,
      generatedAt: new Date().toISOString(),
      policyId: this.generatePolicyId()
    };
  }

  /**
   * Validate anonymization policy against compliance requirements
   */
  validatePolicy(policy) {
    const validation = {
      isValid: true,
      warnings: [],
      errors: [],
      compliance: {}
    };

    // Check HIPAA compliance
    if (policy.framework.name.includes('HIPAA')) {
      validation.compliance.HIPAA = this.validateHIPAACompliance(policy);
    }

    // Check GDPR compliance
    if (policy.framework.name.includes('GDPR')) {
      validation.compliance.GDPR = this.validateGDPRCompliance(policy);
    }

    // Validate strategy compatibility
    const strategyValidation = this.validateStrategyCompatibility(policy);
    validation.warnings.push(...strategyValidation.warnings);
    validation.errors.push(...strategyValidation.errors);

    if (validation.errors.length > 0) {
      validation.isValid = false;
    }

    return validation;
  }

  /**
   * Validate HIPAA compliance requirements
   */
  validateHIPAACompliance(policy) {
    const hipaaRequirements = this.config.complianceFrameworks.HIPAA.identifiers;
    const compliance = {
      score: 0,
      coveredIdentifiers: [],
      missingIdentifiers: []
    };

    hipaaRequirements.forEach(identifier => {
      // Check if policy covers this identifier
      const isCovered = this.checkIdentifierCoverage(policy, identifier);
      if (isCovered) {
        compliance.coveredIdentifiers.push(identifier);
        compliance.score += 1;
      } else {
        compliance.missingIdentifiers.push(identifier);
      }
    });

    compliance.score = (compliance.score / hipaaRequirements.length) * 100;
    compliance.isCompliant = compliance.score >= 95; // 95% threshold

    return compliance;
  }

  /**
   * Check if a specific identifier is covered by the policy
   */
  checkIdentifierCoverage(policy, identifier) {
    // Implementation would check if the policy includes rules for this identifier
    return true; // Simplified for demo
  }

  /**
   * Get recommended anonymization strategy for data type
   */
  getRecommendedStrategy(dataType, sensitivityLevel, context = {}) {
    const classification = this.getDataClassification(sensitivityLevel);
    if (!classification) return null;

    // Filter strategies by what's allowed for this sensitivity level
    const allowedStrategies = classification.allowedStrategies;
    
    // Consider context-specific preferences
    if (context.preserveReadability && allowedStrategies.includes('SYNTHETIC')) {
      return 'SYNTHETIC';
    }
    
    if (context.quickProcessing && allowedStrategies.includes('MASKING')) {
      return 'MASKING';
    }
    
    if (classification.mandatoryAnonymization && allowedStrategies.includes('REPLACEMENT')) {
      return 'REPLACEMENT';
    }

    // Return first allowed strategy as default
    return allowedStrategies[0];
  }

  /**
   * Generate custom anonymization tokens
   */
  generateAnonymizationTokens(dataType, count = 1, options = {}) {
    const tokens = [];
    const tokenMappings = {
      names: ['PATIENT', 'INDIVIDUAL', 'PERSON', 'SUBJECT'],
      identifiers: ['ID', 'RECORD', 'NUMBER', 'IDENTIFIER'],
      dates: ['DATE', 'TIME', 'TIMESTAMP', 'PERIOD'],
      locations: ['LOCATION', 'PLACE', 'FACILITY', 'ADDRESS'],
      providers: ['PROVIDER', 'PHYSICIAN', 'DOCTOR', 'CLINICIAN'],
      contacts: ['CONTACT', 'PHONE', 'EMAIL', 'COMMUNICATION']
    };

    const baseTokens = tokenMappings[dataType] || ['DATA'];
    
    for (let i = 0; i < count; i++) {
      const baseToken = baseTokens[i % baseTokens.length];
      const numberedToken = options.numbered ? `${baseToken}_${i + 1}` : baseToken;
      tokens.push(`[${numberedToken}]`);
    }

    return tokens;
  }

  /**
   * Export configuration for external use
   */
  exportConfiguration(format = 'JSON') {
    switch (format.toLowerCase()) {
      case 'json':
        return JSON.stringify(this.config, null, 2);
      case 'yaml':
        // Would implement YAML serialization
        return this.convertToYAML(this.config);
      default:
        return this.config;
    }
  }

  /**
   * Import external configuration
   */
  importConfiguration(configData, format = 'JSON') {
    try {
      let parsedConfig;
      switch (format.toLowerCase()) {
        case 'json':
          parsedConfig = JSON.parse(configData);
          break;
        case 'yaml':
          // Would implement YAML parsing
          parsedConfig = this.parseYAML(configData);
          break;
        default:
          parsedConfig = configData;
      }

      // Validate imported configuration
      const validation = this.validateImportedConfig(parsedConfig);
      if (validation.isValid) {
        this.config = { ...this.config, ...parsedConfig };
        return { success: true, message: 'Configuration imported successfully' };
      } else {
        return { 
          success: false, 
          message: 'Invalid configuration format', 
          errors: validation.errors 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to parse configuration', 
        error: error.message 
      };
    }
  }

  /**
   * Generate unique policy ID
   */
  generatePolicyId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `POLICY_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Get anonymization statistics and metrics
   */
  getAnonymizationMetrics(processedTexts) {
    return {
      totalDocuments: processedTexts.length,
      averageDetections: this.calculateAverageDetections(processedTexts),
      complianceScore: this.calculateOverallCompliance(processedTexts),
      strategyUsage: this.analyzeStrategyUsage(processedTexts),
      processingTime: this.calculateProcessingMetrics(processedTexts)
    };
  }

  /**
   * Update configuration with new rules
   */
  updateConfiguration(updates) {
    const updatedConfig = { ...this.config };
    
    // Deep merge updates
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
        updatedConfig[key] = { ...updatedConfig[key], ...updates[key] };
      } else {
        updatedConfig[key] = updates[key];
      }
    });

    // Validate updated configuration
    const validation = this.validateConfiguration(updatedConfig);
    if (validation.isValid) {
      this.config = updatedConfig;
      return { success: true, message: 'Configuration updated successfully' };
    } else {
      return { 
        success: false, 
        message: 'Configuration update failed validation', 
        errors: validation.errors 
      };
    }
  }

  /**
   * Validate configuration integrity
   */
  validateConfiguration(config) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validate required sections exist
    const requiredSections = ['strategies', 'dataClassification', 'complianceFrameworks'];
    requiredSections.forEach(section => {
      if (!config[section]) {
        validation.errors.push(`Missing required section: ${section}`);
        validation.isValid = false;
      }
    });

    return validation;
  }

  /**
   * Helper methods for validation and processing
   */
  validateStrategyCompatibility(policy) {
    return { warnings: [], errors: [] }; // Simplified implementation
  }

  validateGDPRCompliance(policy) {
    return { score: 85, isCompliant: true }; // Simplified implementation
  }

  validateImportedConfig(config) {
    return { isValid: true, errors: [] }; // Simplified implementation
  }

  calculateAverageDetections(texts) {
    return texts.length > 0 ? 
           texts.reduce((sum, t) => sum + (t.detections || 0), 0) / texts.length : 0;
  }

  calculateOverallCompliance(texts) {
    return 85; // Simplified implementation
  }

  analyzeStrategyUsage(texts) {
    return {}; // Simplified implementation
  }

  calculateProcessingMetrics(texts) {
    return { averageTime: 150, totalTime: 1500 }; // Simplified implementation
  }

  convertToYAML(obj) {
    return JSON.stringify(obj); // Simplified - would use proper YAML library
  }

  parseYAML(yamlString) {
    return JSON.parse(yamlString); // Simplified - would use proper YAML library
  }
}

// Export singleton instance
const anonymizationConfigService = new AnonymizationConfigService();
export default anonymizationConfigService;
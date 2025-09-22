/**
 * Advanced File Processing Service
 * Handles multiple file formats with soft-coded parsers and processors
 * Supports PDF, DOCX, TXT, CSV, JSON, XML, HTML, RTF and more
 */

class FileProcessingService {
    constructor() {
        // Soft-coded file format configurations
        this.fileConfigs = {
            // Text-based formats
            'text/plain': {
                extension: '.txt',
                parser: 'textParser',
                maxSize: 10 * 1024 * 1024, // 10MB
                mimeTypes: ['text/plain'],
                description: 'Plain text files'
            },
            'text/csv': {
                extension: '.csv',
                parser: 'csvParser',
                maxSize: 50 * 1024 * 1024, // 50MB
                mimeTypes: ['text/csv', 'application/csv'],
                description: 'Comma-separated values'
            },
            'application/json': {
                extension: '.json',
                parser: 'jsonParser',
                maxSize: 10 * 1024 * 1024, // 10MB
                mimeTypes: ['application/json'],
                description: 'JSON data files'
            },
            'text/xml': {
                extension: '.xml',
                parser: 'xmlParser',
                maxSize: 20 * 1024 * 1024, // 20MB
                mimeTypes: ['text/xml', 'application/xml'],
                description: 'XML documents'
            },
            'text/html': {
                extension: '.html',
                parser: 'htmlParser',
                maxSize: 10 * 1024 * 1024, // 10MB
                mimeTypes: ['text/html'],
                description: 'HTML documents'
            },
            // Document formats
            'application/pdf': {
                extension: '.pdf',
                parser: 'pdfParser',
                maxSize: 100 * 1024 * 1024, // 100MB
                mimeTypes: ['application/pdf'],
                description: 'PDF documents',
                requiresServer: true
            },
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
                extension: '.docx',
                parser: 'docxParser',
                maxSize: 50 * 1024 * 1024, // 50MB
                mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                description: 'Microsoft Word documents',
                requiresServer: true
            },
            'application/msword': {
                extension: '.doc',
                parser: 'docParser',
                maxSize: 50 * 1024 * 1024, // 50MB
                mimeTypes: ['application/msword'],
                description: 'Legacy Microsoft Word documents',
                requiresServer: true
            },
            'application/rtf': {
                extension: '.rtf',
                parser: 'rtfParser',
                maxSize: 20 * 1024 * 1024, // 20MB
                mimeTypes: ['application/rtf', 'text/rtf'],
                description: 'Rich Text Format documents'
            },
            // Spreadsheet formats
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                extension: '.xlsx',
                parser: 'xlsxParser',
                maxSize: 100 * 1024 * 1024, // 100MB
                mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
                description: 'Microsoft Excel spreadsheets',
                requiresServer: true
            }
        };

        // Soft-coded extraction patterns for different file types
        this.extractionPatterns = {
            medical: {
                patientInfo: /(?:patient|pt)\s*(?:name|id|number)?\s*:?\s*([A-Za-z\s]+)/gi,
                mrn: /(?:mrn|medical\s*record\s*(?:number|#)?)\s*:?\s*([A-Za-z0-9\-]+)/gi,
                dob: /(?:dob|date\s*of\s*birth|birth\s*date)\s*:?\s*([0-9\/\-\.]+)/gi,
                diagnosis: /(?:diagnosis|dx|icd[0-9]*)\s*:?\s*([A-Za-z0-9\s\.\-]+)/gi,
                medication: /(?:medication|med|rx)\s*:?\s*([A-Za-z\s]+)/gi
            },
            financial: {
                ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
                creditCard: /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,
                bankAccount: /\b\d{9,12}\b/g
            },
            personal: {
                email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
                phone: /\b(\+1\s?)?(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}\b/g,
                address: /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln)/gi
            }
        };
    }

    /**
     * Get supported file formats for UI display
     */
    getSupportedFormats() {
        return Object.entries(this.fileConfigs).map(([mimeType, config]) => ({
            mimeType,
            extension: config.extension,
            description: config.description,
            maxSize: config.maxSize,
            requiresServer: config.requiresServer || false
        }));
    }

    /**
     * Validate file before processing
     */
    validateFile(file) {
        const config = this.getFileConfig(file.type);
        
        if (!config) {
            return {
                valid: false,
                error: `Unsupported file type: ${file.type}. Supported formats: ${Object.values(this.fileConfigs).map(c => c.extension).join(', ')}`
            };
        }

        if (file.size > config.maxSize) {
            return {
                valid: false,
                error: `File size exceeds maximum limit of ${this.formatFileSize(config.maxSize)}`
            };
        }

        return { valid: true, config };
    }

    /**
     * Get file configuration by MIME type
     */
    getFileConfig(mimeType) {
        return this.fileConfigs[mimeType] || 
               Object.values(this.fileConfigs).find(config => 
                   config.mimeTypes.includes(mimeType)
               );
    }

    /**
     * Process file based on its type
     */
    async processFile(file) {
        try {
            const validation = this.validateFile(file);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            const config = validation.config;
            const parser = this[config.parser];
            
            if (!parser) {
                throw new Error(`Parser not found for ${config.parser}`);
            }

            const content = await parser.call(this, file);
            const metadata = this.extractMetadata(file, config);

            return {
                success: true,
                content,
                metadata,
                fileInfo: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    config
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fileInfo: {
                    name: file.name,
                    size: file.size,
                    type: file.type
                }
            };
        }
    }

    /**
     * Text file parser
     */
    async textParser(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read text file'));
            reader.readAsText(file);
        });
    }

    /**
     * CSV file parser
     */
    async csvParser(file) {
        const text = await this.textParser(file);
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
            return { raw: text, parsed: [], headers: [] };
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });

        return {
            raw: text,
            parsed: data,
            headers,
            rowCount: data.length
        };
    }

    /**
     * JSON file parser
     */
    async jsonParser(file) {
        const text = await this.textParser(file);
        try {
            const parsed = JSON.parse(text);
            return {
                raw: text,
                parsed,
                type: Array.isArray(parsed) ? 'array' : typeof parsed
            };
        } catch (error) {
            throw new Error(`Invalid JSON format: ${error.message}`);
        }
    }

    /**
     * XML file parser
     */
    async xmlParser(file) {
        const text = await this.textParser(file);
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'text/xml');
            
            const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
            if (parseError) {
                throw new Error('Invalid XML format');
            }

            return {
                raw: text,
                parsed: xmlDoc,
                rootElement: xmlDoc.documentElement.tagName
            };
        } catch (error) {
            throw new Error(`XML parsing error: ${error.message}`);
        }
    }

    /**
     * HTML file parser
     */
    async htmlParser(file) {
        const text = await this.textParser(file);
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        
        // Extract text content from HTML
        const textContent = htmlDoc.body ? htmlDoc.body.textContent : htmlDoc.textContent;
        
        return {
            raw: text,
            textContent: textContent.trim(),
            title: htmlDoc.title || '',
            hasImages: htmlDoc.getElementsByTagName('img').length > 0,
            hasLinks: htmlDoc.getElementsByTagName('a').length > 0
        };
    }

    /**
     * RTF file parser (basic text extraction)
     */
    async rtfParser(file) {
        const text = await this.textParser(file);
        
        // Basic RTF text extraction (removes RTF formatting)
        let cleanText = text
            .replace(/\\[a-zA-Z]+\d*\s?/g, '') // Remove RTF control words
            .replace(/[{}]/g, '') // Remove braces
            .replace(/\\\\/g, '\\') // Unescape backslashes
            .replace(/\\'/g, "'") // Unescape quotes
            .trim();

        return {
            raw: text,
            textContent: cleanText,
            format: 'rtf'
        };
    }

    /**
     * PDF parser placeholder (requires server-side processing)
     */
    async pdfParser(file) {
        // This will be handled by the backend
        return {
            requiresServer: true,
            message: 'PDF processing requires server-side handling'
        };
    }

    /**
     * DOCX parser placeholder (requires server-side processing)
     */
    async docxParser(file) {
        // This will be handled by the backend
        return {
            requiresServer: true,
            message: 'DOCX processing requires server-side handling'
        };
    }

    /**
     * DOC parser placeholder (requires server-side processing)
     */
    async docParser(file) {
        // This will be handled by the backend
        return {
            requiresServer: true,
            message: 'DOC processing requires server-side handling'
        };
    }

    /**
     * XLSX parser placeholder (requires server-side processing)
     */
    async xlsxParser(file) {
        // This will be handled by the backend
        return {
            requiresServer: true,
            message: 'XLSX processing requires server-side handling'
        };
    }

    /**
     * Extract metadata from file
     */
    extractMetadata(file, config) {
        return {
            fileName: file.name,
            fileSize: this.formatFileSize(file.size),
            fileType: config.description,
            lastModified: new Date(file.lastModified).toLocaleString(),
            extension: config.extension,
            mimeType: file.type,
            processingMethod: config.requiresServer ? 'server-side' : 'client-side'
        };
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Extract sensitive content from parsed file data
     */
    extractSensitiveContent(content, fileType = 'text') {
        const findings = {
            medical: [],
            financial: [],
            personal: [],
            total: 0
        };

        // Convert content to text for pattern matching
        let textContent = '';
        if (typeof content === 'string') {
            textContent = content;
        } else if (content.textContent) {
            textContent = content.textContent;
        } else if (content.raw) {
            textContent = content.raw;
        } else if (Array.isArray(content.parsed)) {
            textContent = JSON.stringify(content.parsed);
        }

        // Apply extraction patterns
        Object.entries(this.extractionPatterns).forEach(([category, patterns]) => {
            Object.entries(patterns).forEach(([type, regex]) => {
                const matches = textContent.match(regex) || [];
                matches.forEach(match => {
                    findings[category].push({
                        type,
                        value: match.trim(),
                        position: textContent.indexOf(match),
                        confidence: this.calculateConfidence(match, type)
                    });
                });
            });
        });

        // Calculate total findings
        findings.total = Object.values(findings)
            .filter(Array.isArray)
            .reduce((sum, arr) => sum + arr.length, 0);

        return findings;
    }

    /**
     * Calculate confidence score for detected patterns
     */
    calculateConfidence(match, type) {
        const confidenceRules = {
            patientInfo: 0.7,
            mrn: 0.9,
            dob: 0.8,
            diagnosis: 0.6,
            medication: 0.7,
            ssn: 0.95,
            creditCard: 0.9,
            bankAccount: 0.8,
            email: 0.95,
            phone: 0.85,
            address: 0.7
        };

        return confidenceRules[type] || 0.5;
    }

    /**
     * Generate file processing report
     */
    generateProcessingReport(results) {
        if (!results.success) {
            return {
                status: 'error',
                message: results.error,
                fileInfo: results.fileInfo
            };
        }

        const sensitiveContent = this.extractSensitiveContent(results.content);
        
        return {
            status: 'success',
            fileInfo: results.fileInfo,
            metadata: results.metadata,
            contentSummary: {
                hasContent: Boolean(results.content),
                contentType: typeof results.content,
                requiresServer: results.content.requiresServer || false
            },
            sensitiveFindings: sensitiveContent,
            recommendations: this.generateRecommendations(sensitiveContent)
        };
    }

    /**
     * Generate anonymization recommendations
     */
    generateRecommendations(findings) {
        const recommendations = [];

        if (findings.medical.length > 0) {
            recommendations.push({
                category: 'Medical Information',
                severity: 'high',
                message: `Found ${findings.medical.length} medical identifiers. Consider HIPAA compliance measures.`
            });
        }

        if (findings.financial.length > 0) {
            recommendations.push({
                category: 'Financial Information',
                severity: 'critical',
                message: `Found ${findings.financial.length} financial identifiers. Immediate anonymization required.`
            });
        }

        if (findings.personal.length > 0) {
            recommendations.push({
                category: 'Personal Information',
                severity: 'medium',
                message: `Found ${findings.personal.length} personal identifiers. Consider GDPR compliance.`
            });
        }

        return recommendations;
    }
}

// Export singleton instance
export default new FileProcessingService();
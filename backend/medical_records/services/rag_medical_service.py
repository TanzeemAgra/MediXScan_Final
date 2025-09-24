"""
RAG Medical Knowledge Base Service
Retrieval-Augmented Generation for Medical Terminology

This service connects to medical terminology databases (RadLex, SNOMED, ICD-10)
to provide intelligent medical term corrections and suggestions.
"""

import json
import sqlite3
import os
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from difflib import SequenceMatcher
import requests
from django.conf import settings
from django.core.cache import cache


@dataclass
class MedicalTerm:
    """Represents a medical term with context and metadata."""
    term: str
    correct_spelling: str
    category: str  # anatomy, pathology, procedure, etc.
    definition: str
    source: str   # RadLex, SNOMED, ICD-10
    confidence: float
    context: str  # Additional context for the term


class MedicalKnowledgeBase:
    """
    RAG-enabled medical knowledge base for intelligent terminology correction.
    """
    
    def __init__(self):
        self.db_path = os.path.join(settings.BASE_DIR, 'medical_data', 'medical_knowledge.db')
        self.initialize_database()
        self.load_medical_terminologies()
    
    def initialize_database(self):
        """Initialize SQLite database for medical knowledge storage."""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables for medical terminology
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS medical_terms (
                id INTEGER PRIMARY KEY,
                term TEXT NOT NULL,
                correct_spelling TEXT NOT NULL,
                category TEXT,
                definition TEXT,
                source TEXT,
                synonyms TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS radlex_terms (
                id INTEGER PRIMARY KEY,
                radlex_id TEXT UNIQUE,
                preferred_name TEXT,
                synonyms TEXT,
                definition TEXT,
                body_part TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS snomed_terms (
                id INTEGER PRIMARY KEY,
                snomed_id TEXT UNIQUE,
                term TEXT,
                synonyms TEXT,
                semantic_tag TEXT,
                definition TEXT
            )
        ''')
        
        # Create indexes for fast retrieval
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_term ON medical_terms(term)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_correct_spelling ON medical_terms(correct_spelling)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_radlex_name ON radlex_terms(preferred_name)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_snomed_term ON snomed_terms(term)')
        
        conn.commit()
        conn.close()
    
    def load_medical_terminologies(self):
        """Load comprehensive medical terminology databases."""
        self._load_radlex_terms()
        self._load_snomed_terms()
        self._load_common_misspellings()
        self._load_anatomical_terms()
        self._load_pathology_terms()
    
    def _load_radlex_terms(self):
        """Load RadLex (Radiology Lexicon) terms for radiology-specific terminology."""
        radlex_terms = [
            # Radiology-specific terms
            {"radlex_id": "RID5825", "preferred_name": "opacity", "synonyms": "opasity,opacty,opacitiy", 
             "definition": "Area of increased attenuation on radiographic images", "body_part": "chest"},
            {"radlex_id": "RID1301", "preferred_name": "consolidation", "synonyms": "consolidaton,consolidatoin", 
             "definition": "Complete filling of alveoli with fluid or cellular material", "body_part": "lung"},
            {"radlex_id": "RID28476", "preferred_name": "atelectasis", "synonyms": "atelecasis,atelectesis", 
             "definition": "Collapse or incomplete expansion of lung tissue", "body_part": "lung"},
            {"radlex_id": "RID34952", "preferred_name": "pneumothorax", "synonyms": "pneumotorax,pnuemothorax", 
             "definition": "Presence of air in pleural space", "body_part": "chest"},
            {"radlex_id": "RID1363", "preferred_name": "effusion", "synonyms": "effuson,efusion", 
             "definition": "Abnormal collection of fluid", "body_part": "pleura"},
            {"radlex_id": "RID1240", "preferred_name": "diaphragm", "synonyms": "diaphram,diafragm", 
             "definition": "Dome-shaped muscle separating thorax from abdomen", "body_part": "thorax"},
            {"radlex_id": "RID2468", "preferred_name": "costophrenic", "synonyms": "costophranic,costofrenic", 
             "definition": "Relating to ribs and diaphragm", "body_part": "chest"},
            {"radlex_id": "RID1326", "preferred_name": "hilar", "synonyms": "hylar,hiler", 
             "definition": "Relating to the hilum of the lung", "body_part": "lung"},
        ]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for term in radlex_terms:
            cursor.execute('''
                INSERT OR REPLACE INTO radlex_terms 
                (radlex_id, preferred_name, synonyms, definition, body_part)
                VALUES (?, ?, ?, ?, ?)
            ''', (term["radlex_id"], term["preferred_name"], term["synonyms"], 
                  term["definition"], term["body_part"]))
        
        conn.commit()
        conn.close()
    
    def _load_snomed_terms(self):
        """Load SNOMED CT terms for clinical terminology."""
        snomed_terms = [
            # Clinical conditions
            {"snomed_id": "44054006", "term": "fibrosis", "synonyms": "fibriosis,fibrsis", 
             "semantic_tag": "disorder", "definition": "Formation of excess fibrous tissue"},
            {"snomed_id": "233604007", "term": "pneumonia", "synonyms": "pnuemonia,pneummonia", 
             "semantic_tag": "disorder", "definition": "Inflammatory condition of the lung"},
            {"snomed_id": "195967001", "term": "asthma", "synonyms": "asma,astma", 
             "semantic_tag": "disorder", "definition": "Respiratory condition with airway inflammation"},
            {"snomed_id": "87433001", "term": "emphysema", "synonyms": "emfysema,emphisema", 
             "semantic_tag": "disorder", "definition": "Lung condition with enlarged air spaces"},
            {"snomed_id": "56717001", "term": "tuberculosis", "synonyms": "tubercolosis,tuburculosis", 
             "semantic_tag": "disorder", "definition": "Infectious disease caused by Mycobacterium tuberculosis"},
            {"snomed_id": "13645005", "term": "chronic", "synonyms": "cronic,chronik", 
             "semantic_tag": "qualifier", "definition": "Long-term or persistent condition"},
            {"snomed_id": "89138009", "term": "carcinoma", "synonyms": "carsinoma,carcinomma", 
             "semantic_tag": "neoplasm", "definition": "Malignant tumor of epithelial origin"},
        ]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for term in snomed_terms:
            cursor.execute('''
                INSERT OR REPLACE INTO snomed_terms 
                (snomed_id, term, synonyms, semantic_tag, definition)
                VALUES (?, ?, ?, ?, ?)
            ''', (term["snomed_id"], term["term"], term["synonyms"], 
                  term["semantic_tag"], term["definition"]))
        
        conn.commit()
        conn.close()
    
    def _load_common_misspellings(self):
        """Load common medical term misspellings and their corrections."""
        common_misspellings = [
            # Anatomy
            ("diaphram", "diaphragm", "anatomy", "Dome-shaped respiratory muscle", "RadLex"),
            ("fibriosis", "fibrosis", "pathology", "Formation of fibrous tissue", "SNOMED"),
            ("opasity", "opacity", "radiology", "Area of increased density on imaging", "RadLex"),
            ("costophranic", "costophrenic", "anatomy", "Relating to ribs and diaphragm", "RadLex"),
            ("hylar", "hilar", "anatomy", "Relating to lung hilum", "RadLex"),
            
            # Pathology
            ("pnuemonia", "pneumonia", "pathology", "Lung infection", "SNOMED"),
            ("tubercolosis", "tuberculosis", "pathology", "TB infection", "SNOMED"),
            ("carsinoma", "carcinoma", "pathology", "Malignant tumor", "SNOMED"),
            ("scolliosis", "scoliosis", "pathology", "Spinal curvature", "SNOMED"),
            
            # Procedures
            ("bronchoscopy", "bronchoscopy", "procedure", "Examination of airways", "SNOMED"),
            ("tomograhpy", "tomography", "procedure", "Imaging technique", "RadLex"),
        ]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for incorrect, correct, category, definition, source in common_misspellings:
            cursor.execute('''
                INSERT OR REPLACE INTO medical_terms 
                (term, correct_spelling, category, definition, source, synonyms)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (incorrect, correct, category, definition, source, incorrect))
        
        conn.commit()
        conn.close()
    
    def _load_anatomical_terms(self):
        """Load comprehensive anatomical terminology."""
        anatomical_terms = [
            ("vertebra", "vertebrae", "anatomy", "Spinal bone", "RadLex"),
            ("sternum", "sternum", "anatomy", "Breastbone", "RadLex"),
            ("clavicle", "clavicle", "anatomy", "Collarbone", "RadLex"),
            ("scapula", "scapula", "anatomy", "Shoulder blade", "RadLex"),
            ("thorax", "thorax", "anatomy", "Chest cavity", "RadLex"),
            ("abdomen", "abdomen", "anatomy", "Belly", "RadLex"),
            ("pelvis", "pelvis", "anatomy", "Hip region", "RadLex"),
        ]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for term, correct, category, definition, source in anatomical_terms:
            cursor.execute('''
                INSERT OR REPLACE INTO medical_terms 
                (term, correct_spelling, category, definition, source, synonyms)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (term, correct, category, definition, source, term))
        
        conn.commit()
        conn.close()
    
    def _load_pathology_terms(self):
        """Load pathology and disease terminology."""
        pathology_terms = [
            ("fibrosis", "fibrosis", "pathology", "Tissue scarring", "SNOMED"),
            ("necrosis", "necrosis", "pathology", "Tissue death", "SNOMED"),
            ("inflammation", "inflammation", "pathology", "Immune response", "SNOMED"),
            ("ischemia", "ischemia", "pathology", "Reduced blood flow", "SNOMED"),
            ("infarction", "infarction", "pathology", "Tissue death from lack of blood", "SNOMED"),
        ]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for term, correct, category, definition, source in pathology_terms:
            cursor.execute('''
                INSERT OR REPLACE INTO medical_terms 
                (term, correct_spelling, category, definition, source, synonyms)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (term, correct, category, definition, source, term))
        
        conn.commit()
        conn.close()


class RAGMedicalRetriever:
    """
    RAG retrieval service for medical terminology correction.
    """
    
    def __init__(self):
        self.knowledge_base = MedicalKnowledgeBase()
        self.similarity_threshold = 0.6
    
    def retrieve_medical_term(self, query_term: str, limit: int = 5) -> List[MedicalTerm]:
        """
        Retrieve similar medical terms using RAG approach.
        
        Args:
            query_term: The potentially misspelled medical term
            limit: Maximum number of results to return
            
        Returns:
            List of MedicalTerm objects with corrections and context
        """
        cache_key = f"medical_term_{query_term.lower()}"
        cached_result = cache.get(cache_key)
        if cached_result:
            return cached_result
        
        # Step 1: Exact match search
        exact_matches = self._search_exact_match(query_term)
        if exact_matches:
            cache.set(cache_key, exact_matches, 3600)  # Cache for 1 hour
            return exact_matches
        
        # Step 2: Fuzzy matching with similarity scoring
        fuzzy_matches = self._search_fuzzy_match(query_term, limit)
        if fuzzy_matches:
            cache.set(cache_key, fuzzy_matches, 3600)
            return fuzzy_matches
        
        # Step 3: Semantic search (if available)
        semantic_matches = self._search_semantic_match(query_term, limit)
        
        cache.set(cache_key, semantic_matches, 3600)
        return semantic_matches
    
    def _search_exact_match(self, query_term: str) -> List[MedicalTerm]:
        """Search for exact matches in the knowledge base."""
        conn = sqlite3.connect(self.knowledge_base.db_path)
        cursor = conn.cursor()
        
        results = []
        
        # Search in medical_terms table
        cursor.execute('''
            SELECT term, correct_spelling, category, definition, source
            FROM medical_terms 
            WHERE LOWER(term) = LOWER(?) OR LOWER(synonyms) LIKE LOWER(?)
        ''', (query_term, f'%{query_term}%'))
        
        for row in cursor.fetchall():
            term = MedicalTerm(
                term=row[0],
                correct_spelling=row[1],
                category=row[2] or "general",
                definition=row[3] or "Medical term",
                source=row[4] or "Medical Dictionary",
                confidence=1.0,
                context=f"Exact match found in {row[4]} database"
            )
            results.append(term)
        
        # Search RadLex terms
        cursor.execute('''
            SELECT preferred_name, synonyms, definition, body_part, radlex_id
            FROM radlex_terms 
            WHERE LOWER(preferred_name) = LOWER(?) OR LOWER(synonyms) LIKE LOWER(?)
        ''', (query_term, f'%{query_term}%'))
        
        for row in cursor.fetchall():
            term = MedicalTerm(
                term=query_term,
                correct_spelling=row[0],
                category="radiology",
                definition=row[2] or "Radiology term",
                source="RadLex",
                confidence=1.0,
                context=f"RadLex ID: {row[4]}, Body part: {row[3]}"
            )
            results.append(term)
        
        # Search SNOMED terms
        cursor.execute('''
            SELECT term, synonyms, definition, semantic_tag, snomed_id
            FROM snomed_terms 
            WHERE LOWER(term) = LOWER(?) OR LOWER(synonyms) LIKE LOWER(?)
        ''', (query_term, f'%{query_term}%'))
        
        for row in cursor.fetchall():
            term = MedicalTerm(
                term=query_term,
                correct_spelling=row[0],
                category=row[3] or "clinical",
                definition=row[2] or "Clinical term",
                source="SNOMED CT",
                confidence=1.0,
                context=f"SNOMED ID: {row[4]}, Semantic tag: {row[3]}"
            )
            results.append(term)
        
        conn.close()
        return results
    
    def _search_fuzzy_match(self, query_term: str, limit: int) -> List[MedicalTerm]:
        """Search for fuzzy matches using similarity scoring."""
        conn = sqlite3.connect(self.knowledge_base.db_path)
        cursor = conn.cursor()
        
        results = []
        
        # Get all terms for fuzzy matching
        cursor.execute('''
            SELECT term, correct_spelling, category, definition, source
            FROM medical_terms
        ''')
        
        medical_terms = cursor.fetchall()
        
        cursor.execute('''
            SELECT preferred_name, synonyms, definition, body_part, radlex_id
            FROM radlex_terms
        ''')
        
        radlex_terms = cursor.fetchall()
        
        cursor.execute('''
            SELECT term, synonyms, definition, semantic_tag, snomed_id
            FROM snomed_terms
        ''')
        
        snomed_terms = cursor.fetchall()
        
        # Calculate similarity scores
        candidates = []
        
        # Process medical terms
        for row in medical_terms:
            similarity = SequenceMatcher(None, query_term.lower(), row[0].lower()).ratio()
            if similarity >= self.similarity_threshold:
                candidates.append((similarity, MedicalTerm(
                    term=row[0],
                    correct_spelling=row[1],
                    category=row[2] or "general",
                    definition=row[3] or "Medical term",
                    source=row[4] or "Medical Dictionary",
                    confidence=similarity,
                    context=f"Fuzzy match (similarity: {similarity:.2f})"
                )))
        
        # Process RadLex terms
        for row in radlex_terms:
            similarity = SequenceMatcher(None, query_term.lower(), row[0].lower()).ratio()
            if similarity >= self.similarity_threshold:
                candidates.append((similarity, MedicalTerm(
                    term=query_term,
                    correct_spelling=row[0],
                    category="radiology",
                    definition=row[2] or "Radiology term",
                    source="RadLex",
                    confidence=similarity,
                    context=f"RadLex ID: {row[4]}, Body part: {row[3]}, similarity: {similarity:.2f}"
                )))
        
        # Process SNOMED terms
        for row in snomed_terms:
            similarity = SequenceMatcher(None, query_term.lower(), row[0].lower()).ratio()
            if similarity >= self.similarity_threshold:
                candidates.append((similarity, MedicalTerm(
                    term=query_term,
                    correct_spelling=row[0],
                    category=row[3] or "clinical",
                    definition=row[2] or "Clinical term",
                    source="SNOMED CT",
                    confidence=similarity,
                    context=f"SNOMED ID: {row[4]}, Semantic tag: {row[3]}, similarity: {similarity:.2f}"
                )))
        
        # Sort by similarity and return top results
        candidates.sort(key=lambda x: x[0], reverse=True)
        results = [candidate[1] for candidate in candidates[:limit]]
        
        conn.close()
        return results
    
    def _search_semantic_match(self, query_term: str, limit: int) -> List[MedicalTerm]:
        """Placeholder for semantic search (can be enhanced with embeddings)."""
        # For now, return empty list - can be enhanced with sentence transformers
        # or other embedding-based similarity search
        return []
    
    def get_correction_with_context(self, incorrect_term: str) -> Optional[Dict]:
        """
        Get correction for a term with full RAG context and metadata.
        
        Returns:
            Dictionary with correction, confidence, source, and context
        """
        matches = self.retrieve_medical_term(incorrect_term, limit=1)
        
        if not matches:
            return None
        
        best_match = matches[0]
        
        return {
            'original_term': incorrect_term,
            'corrected_term': best_match.correct_spelling,
            'confidence': best_match.confidence,
            'source': best_match.source,
            'category': best_match.category,
            'definition': best_match.definition,
            'context': best_match.context,
            'rag_enabled': True,
            'medical_database': best_match.source
        }


# Global RAG retriever instance
rag_retriever = RAGMedicalRetriever()
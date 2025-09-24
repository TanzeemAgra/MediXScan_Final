#!/usr/bin/env python
"""
Test script for Medical Correction Service
Tests the specific medical report provided by user
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('D:/medixscan/backend')

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from medical_records.services.medical_correction_service import MedicalReportCorrectionService

def test_medical_correction():
    # Initialize service
    service = MedicalReportCorrectionService()
    
    # Test text from user report
    test_text = """The diaphram appears elevated and shows abnormal movement."""

    print("Testing Medical Report Correction Service...")
    print("="*60)
    
    # Analyze the report
    result = service.analyze_medical_report(test_text)
    
    print(f"Status: {result['status']}")
    print(f"Total errors found: {result['summary']['total_errors']}")
    print(f"Error types: {result['summary']['errors_by_type']}")
    print(f"Confidence score: {result['summary']['confidence_score']}")
    print()
    
    print("ORIGINAL TEXT:")
    print("-" * 40)
    print(f"'{result.get('original_text', test_text)}'")
    print()
    
    print("CORRECTED TEXT:")
    print("-" * 40) 
    print(f"'{result.get('corrected_text', 'No corrected text generated!')}'")
    print()
    
    print("Corrections Applied:")
    print("-" * 40)
    for i, correction in enumerate(result['corrections'], 1):
        print(f"{i}. '{correction['error']}' → '{correction['suggestion']}'")
        print(f"   Type: {correction['error_type']}")
        print(f"   Position: {correction['position']}")
        print(f"   Recommendation: {correction['recommendation']}")
        print()
    
    # Test if correction was actually applied
    original = result.get('original_text', test_text)
    corrected = result.get('corrected_text', '')
    
    if result['corrections'] and original != corrected:
        print("✅ SUCCESS: Errors detected AND corrections applied!")
        print(f"✅ TEXT CHANGED: Original ≠ Corrected")
    elif result['corrections'] and original == corrected:
        print("❌ PARTIAL FAILURE: Errors detected but NOT applied to text!")
        print(f"❌ TEXT UNCHANGED: Original = Corrected")
    else:
        print("❌ COMPLETE FAILURE: No errors detected!")

if __name__ == "__main__":
    test_medical_correction()
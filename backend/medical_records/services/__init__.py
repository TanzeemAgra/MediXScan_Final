"""
Medical Records Services Package
Provides AI and processing services for medical records management
"""

# Soft coding approach for service imports
import importlib
import sys
from typing import Optional

def get_ai_service():
    """
    Lazy import AI service with fallback handling
    Returns AI service instance or None if not available
    """
    try:
        from .ai_service import AIService
        return AIService()
    except ImportError as e:
        print(f"Warning: AI Service not available - {e}")
        return None

def get_available_services():
    """
    Discover and return available services in this package
    """
    services = {}
    
    # Try to import AI service
    ai_service = get_ai_service()
    if ai_service:
        services['ai_service'] = ai_service
    
    return services

# Export commonly used services
__all__ = [
    'get_ai_service',
    'get_available_services'
]
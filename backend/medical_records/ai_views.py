from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .services.medical_correction_service import get_medical_correction_service
import logging

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
@permission_classes([])  # Explicitly remove all permission classes
def test_correction_api(request):
    """Test endpoint to verify API connectivity"""
    test_text = request.data.get('report_text', 'diaphram') if request.method == 'POST' else 'diaphram'
    
    try:
        correction_service, service_error = get_correction_service_or_error()
        if service_error:
            return service_error
            
        analysis_result = correction_service.analyze_medical_report(test_text)
        
        return Response({
            'status': 'API Working!',
            'test_input': test_text,
            'corrected_output': analysis_result.get('corrected_text', test_text),
            'corrections_found': len(analysis_result.get('corrections', [])),
            'message': 'Medical correction API is operational'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'API Error',
            'error': str(e),
            'message': 'Medical correction API failed'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def get_correction_service_or_error():
    """
    Get medical correction service with soft coding error handling
    Returns (service, error_response) tuple
    """
    service = get_medical_correction_service()
    if service is None:
        error_response = Response(
            {
                'error': 'Medical Correction Service not available',
                'message': 'Medical text correction services are currently unavailable. Please check configuration.',
                'code': 'CORRECTION_SERVICE_UNAVAILABLE'
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
        return None, error_response
    return service, None

@api_view(['POST'])
@permission_classes([])  # Explicitly remove all permission classes for testing
def analyze_report_with_ai(request):
    """Analyze medical report text for errors using AI - Enhanced Medical Correction Service"""
    try:
        # Accept both 'report_text' and 'text' parameter names for flexibility
        report_text = request.data.get('report_text', '') or request.data.get('text', '')
        openai_api_key = request.data.get('openai_api_key', '')
        model_name = request.data.get('model_name', 'gpt-3.5-turbo')
        
        if not report_text or not report_text.strip():
            return Response(
                {'error': 'Report text is required. Please provide either "report_text" or "text" parameter.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get medical correction service with error handling
        correction_service, service_error = get_correction_service_or_error()
        if service_error:
            return service_error

        # Analyze report using the new medical correction service
        analysis_result = correction_service.analyze_medical_report(
            report_text, 
            openai_api_key=openai_api_key if openai_api_key else None,
            model_name=model_name
        )
        
        if analysis_result.get('status') == 'error':
            return Response(
                {'error': f'Analysis failed: {analysis_result.get("message", "Unknown error")}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            'success': True,
            'original_text': analysis_result.get('original_text', report_text),
            'corrected_text': analysis_result.get('corrected_text', report_text),
            'analysis': analysis_result,
            'service_type': 'medical_correction_service',
            'ai_enhanced': analysis_result.get('metadata', {}).get('ai_enhanced', False)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in analyze_report_with_ai: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def anonymize_text(request):
    """Anonymize medical text by removing PII"""
    try:
        # Accept both 'text' and 'text_content' parameter names for flexibility
        text_content = request.data.get('text', '') or request.data.get('text_content', '')

        if not text_content:
            return Response(
                {'error': 'Text content is required. Please provide either "text" or "text_content" parameter.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get AI service with error handling
        ai_service, service_error = get_ai_service_or_error()
        if service_error:
            return service_error

        # Anonymize text using AI
        anonymized_text, redaction_summary, error = ai_service.anonymize_document_text(text_content)

        if error:
            return Response(
                {'error': f'Anonymization failed: {error}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            'success': True,
            'anonymized_text': anonymized_text,
            'redaction_summary': redaction_summary
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in anonymize_text: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def analyze_medical_image(request):
    """Analyze medical image with optional text query"""
    try:
        image_file = request.FILES.get('image')
        text_query = request.data.get('query', 'What is shown in this medical image?')
        report_context = request.data.get('report_context', '')

        # Get conversation history if provided
        conversation_history = request.data.get('conversation_history', [])

        # Get AI service with error handling
        ai_service, service_error = get_ai_service_or_error()
        if service_error:
            return service_error

        # Query image with AI
        response_content, error = ai_service.query_image_with_text(
            image_file_obj=image_file,
            text_query=text_query,
            report_context=report_context,
            conversation_history=conversation_history
        )

        if error:
            return Response(
                {'error': f'Image analysis failed: {error}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            'success': True,
            'response': response_content
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in analyze_medical_image: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([])  # Explicitly remove all permission classes for testing
def submit_correction_request(request):
    """Submit a correction request for a medical report using Enhanced Medical Correction Service"""
    try:
        record_id = request.data.get('record_id')
        report_text = request.data.get('report_text', '')
        openai_api_key = request.data.get('openai_api_key', '')
        model_name = request.data.get('model_name', 'gpt-3.5-turbo')

        if not record_id or not report_text or not report_text.strip():
            return Response(
                {'error': 'Record ID and report text are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get medical correction service with error handling
        correction_service, service_error = get_correction_service_or_error()
        if service_error:
            return service_error

        # Analyze report for errors using the new service
        analysis_result = correction_service.analyze_medical_report(
            report_text, 
            openai_api_key=openai_api_key if openai_api_key else None,
            model_name=model_name
        )
        
        if analysis_result.get('status') == 'error':
            return Response(
                {'error': f'Analysis failed: {analysis_result.get("message", "Unknown error")}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Extract corrections from analysis
        corrections = analysis_result.get('corrections', [])
        summary = analysis_result.get('summary', {})
        
        # Store correction request with enhanced data structure
        correction_request = {
            'record_id': record_id,
            'original_text': report_text,
            'corrections': corrections,
            'total_errors': summary.get('total_errors', 0),
            'errors_by_type': summary.get('errors_by_type', {}),
            'confidence_score': summary.get('confidence_score', 0.0),
            'analysis_type': summary.get('analysis_type', 'medical_radiology_report'),
            'ai_enhanced': analysis_result.get('metadata', {}).get('ai_enhanced', False),
            'processing_method': analysis_result.get('metadata', {}).get('processing_method', 'rule_based'),
            'requested_by': request.user.username,
            'status': 'completed',
            'timestamp': analysis_result.get('metadata', {}).get('analysis_timestamp')
        }

        # Create user-friendly message
        total_errors = summary.get('total_errors', 0)
        if total_errors == 0:
            message = "No errors detected. Report appears to be accurate and well-formatted."
        else:
            error_types = list(summary.get('errors_by_type', {}).keys())
            message = f"Found {total_errors} potential issues including: {', '.join(error_types)}"

        return Response({
            'success': True,
            'original_text': report_text,
            'corrected_text': analysis_result.get('corrected_text', report_text),
            'correction_request': correction_request,
            'analysis': analysis_result,
            'message': message,
            'service_info': {
                'service_type': 'medical_correction_service',
                'compliance': 'SILO4_medical_safety',
                'ai_enhanced': correction_request['ai_enhanced']
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in submit_correction_request: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
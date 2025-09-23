from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .services.ai_service import medical_ai_service
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_report_with_ai(request):
    """Analyze medical report text for errors using AI"""
    try:
        # Accept both 'report_text' and 'text' parameter names for flexibility
        report_text = request.data.get('report_text', '') or request.data.get('text', '')
        report_type = request.data.get('report_type', 'general')

        if not report_text:
            return Response(
                {'error': 'Report text is required. Please provide either "report_text" or "text" parameter.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Analyze report using AI
        analysis_result, error = medical_ai_service.analyze_medical_report(
            report_text=report_text,
            report_type=report_type
        )

        if error:
            return Response(
                {'error': f'AI analysis failed: {error}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            'success': True,
            'analysis': analysis_result
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

        # Anonymize text using AI
        anonymized_text, redaction_summary, error = medical_ai_service.anonymize_document_text(text_content)

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

        # Query image with AI
        response_content, error = medical_ai_service.query_image_with_text(
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
@permission_classes([IsAuthenticated])
def submit_correction_request(request):
    """Submit a correction request for a medical report using AI analysis"""
    try:
        record_id = request.data.get('record_id')
        report_text = request.data.get('report_text', '')

        if not record_id or not report_text:
            return Response(
                {'error': 'Record ID and report text are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Analyze report for errors
        analysis_result, error = medical_ai_service.analyze_medical_report(report_text)

        if error:
            return Response(
                {'error': f'Analysis failed: {error}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Store correction request (simplified - you may want to save to database)
        correction_request = {
            'record_id': record_id,
            'original_text': analysis_result.get('original_text', report_text),
            'flagged_issues': analysis_result.get('flagged_issues', []),
            'accuracy_score': analysis_result.get('accuracy_score', 0),
            'error_distribution': analysis_result.get('error_distribution', {}),
            'requested_by': request.user.username,
            'status': 'pending'
        }

        return Response({
            'success': True,
            'correction_request': correction_request,
            'message': f"Found {len(analysis_result.get('flagged_issues', []))} potential issues"
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error in submit_correction_request: {e}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
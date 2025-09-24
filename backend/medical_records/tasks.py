from celery import shared_task
from .models import ReportCorrectionRequest, ReportCorrectionVersion
from .services import run_grammar_correction, run_medical_term_check, aggregate_corrections, rag_retrieval
from django.utils import timezone

@shared_task(bind=True)
def process_report_correction(self, request_id):
    try:
        req = ReportCorrectionRequest.objects.get(request_id=request_id)
        req.status = 'processing'
        req.save()

        # For now use the latest version's findings as input (placeholder)
        raw_text = ''
        if req.versions.exists():
            raw_text = req.versions.first().findings or ''

        # Layer 1: grammar
        grammar_res = run_grammar_correction(raw_text)

        # RAG retrieval for medical context
        retrieved = rag_retrieval(raw_text, raw_text)

        # Layer 2: medical term/ontology check
        medical_res = run_medical_term_check(grammar_res['corrected_text'], ontology_hits=retrieved)

        # Aggregate
        final = aggregate_corrections(grammar_res, medical_res)

        # Create a new version with corrected text and metadata
        version = ReportCorrectionVersion.objects.create(
            correction_request=req,
            created_by=req.requested_by,
            findings=final['corrected_text'],
            corrections=final['corrections'],
            confidence_score=final['confidence']
        )

        req.status = 'completed'
        req.processed_at = timezone.now()
        req.save()

        return {'status':'ok', 'request_id': request_id}
    except Exception as e:
        try:
            req = ReportCorrectionRequest.objects.get(request_id=request_id)
            req.status = 'failed'
            req.notes = str(e)
            req.save()
        except Exception:
            pass
        raise
*** End Patch
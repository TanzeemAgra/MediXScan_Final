from rest_framework import serializers
from .models import (
    MedicalRecord,
    ReportCorrectionRequest,
    ReportCorrectionVersion,
    AnonymizationRequest,
    AnonymizationAuditLog,
    AnonymizationConfiguration
)


class MedicalRecordSerializer(serializers.ModelSerializer):
    """Serializer for MedicalRecord model"""

    class Meta:
        model = MedicalRecord
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ReportCorrectionRequestSerializer(serializers.ModelSerializer):
    """Serializer for ReportCorrectionRequest model"""

    class Meta:
        model = ReportCorrectionRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'request_id']

    def create(self, validated_data):
        # Auto-generate request_id if not provided
        if not validated_data.get('request_id'):
            import uuid
            validated_data['request_id'] = f"CRR-{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)


class ReportCorrectionVersionSerializer(serializers.ModelSerializer):
    """Serializer for ReportCorrectionVersion model"""

    class Meta:
        model = ReportCorrectionVersion
        fields = '__all__'
        read_only_fields = ['created_at']


class SubmitCorrectionSerializer(serializers.Serializer):
    """Serializer for submitting correction requests"""
    medical_record_id = serializers.CharField(max_length=100)
    text = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_medical_record_id(self, value):
        """Validate medical record ID"""
        # For now, just ensure it's not empty
        if not value or not value.strip():
            raise serializers.ValidationError("Medical record ID cannot be empty")
        return value.strip()


class AnonymizationRequestSerializer(serializers.ModelSerializer):
    """Serializer for AnonymizationRequest model"""

    class Meta:
        model = AnonymizationRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'request_id']

    def create(self, validated_data):
        # Auto-generate request_id if not provided
        if not validated_data.get('request_id'):
            import uuid
            validated_data['request_id'] = f"ANR-{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)


class AnonymizationAuditLogSerializer(serializers.ModelSerializer):
    """Serializer for AnonymizationAuditLog model"""

    class Meta:
        model = AnonymizationAuditLog
        fields = '__all__'
        read_only_fields = ['timestamp']


class AnonymizationConfigurationSerializer(serializers.ModelSerializer):
    """Serializer for AnonymizationConfiguration model"""

    class Meta:
        model = AnonymizationConfiguration
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class FileUploadSerializer(serializers.Serializer):
    """Serializer for file upload operations"""
    file = serializers.FileField()
    anonymization_level = serializers.ChoiceField(
        choices=['basic', 'standard', 'strict'],
        default='standard'
    )
    notes = serializers.CharField(required=False, allow_blank=True)


class BulkAnonymizationSerializer(serializers.Serializer):
    """Serializer for bulk anonymization requests"""
    file_ids = serializers.ListField(
        child=serializers.CharField(max_length=100),
        min_length=1
    )
    anonymization_level = serializers.ChoiceField(
        choices=['basic', 'standard', 'strict'],
        default='standard'
    )
    batch_name = serializers.CharField(max_length=255, required=False)
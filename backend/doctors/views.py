from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Doctor model - provides basic read operations
    """
    queryset = Doctor.objects.filter(status='active')
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter active doctors by default"""
        queryset = super().get_queryset()
        
        # Optional filtering by specialization
        specialization = self.request.query_params.get('specialization', None)
        if specialization:
            queryset = queryset.filter(specialization=specialization)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def specializations(self, request):
        """Return available specializations"""
        specs = [{'value': choice[0], 'label': choice[1]} for choice in Doctor.SPECIALIZATIONS]
        return Response(specs, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Basic statistics for dashboard"""
        total_doctors = Doctor.objects.filter(status='active').count()
        by_specialization = {}
        
        for choice in Doctor.SPECIALIZATIONS:
            count = Doctor.objects.filter(status='active', specialization=choice[0]).count()
            if count > 0:
                by_specialization[choice[1]] = count
        
        return Response({
            'total_doctors': total_doctors,
            'by_specialization': by_specialization
        }, status=status.HTTP_200_OK)
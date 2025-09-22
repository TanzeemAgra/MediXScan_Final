from rest_framework import generics
from rest_framework.response import Response

class PatientListView(generics.ListAPIView):
    def get(self, request):
        return Response({"message": "Patient API endpoint - Coming soon"})
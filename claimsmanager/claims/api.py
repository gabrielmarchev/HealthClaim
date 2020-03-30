from rest_framework import viewsets, permissions
from claims.models import Claim
from .serializers import ClaimSerializer

# Claim Viewset
class ClaimViewSet(viewsets.ModelViewSet):
    queryset = Claim.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ClaimSerializer

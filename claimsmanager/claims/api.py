from rest_framework import viewsets, permissions
from claims.models import Claim
from .serializers import ClaimSerializer

# Claim Viewset
class ClaimViewSet(viewsets.ModelViewSet):
    queryset = Claim.objects.all() #query that gets all claims
    permission_classes = [ #what claims allowed to access
        permissions.AllowAny
    ]
    serializer_class = ClaimSerializer

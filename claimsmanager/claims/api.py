from rest_framework import viewsets, permissions
from claims.models import Claim
from .serializers import ClaimSerializer

# Claim Viewset
class ClaimViewSet(viewsets.ModelViewSet):
    """
    queryset = Claim.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]

    serializer_class = ClaimSerializer
    
    """
    permission_classes = [ #what claims allowed to access
        permissions.IsAuthenticated
    ]

    serializer_class = ClaimSerializer

    def get_queryset(self):
        return self.request.user.claims.all()

    def perform_create(self, serializer): #save claim owner when claim created
        serializer.save(user=self.request.user)

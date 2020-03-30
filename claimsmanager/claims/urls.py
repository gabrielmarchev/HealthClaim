from rest_framework import routers
from .api import ClaimViewSet

router = routers.DefaultRouter()
router.register('api/claims', ClaimViewSet, 'claims')

urlpatterns = router.urls
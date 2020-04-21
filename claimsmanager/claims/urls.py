from rest_framework import routers
from django.urls import path
from .api import ClaimViewSet
from . import views

router = routers.DefaultRouter()
router.register('api/claims', ClaimViewSet, 'claims') #gives url's registered for this endpoint
#router.register(r'twitter_search', views.twitter_search())

urlpatterns = router.urls
urlpatterns.append(path('twitter_search', views.twitter_search))
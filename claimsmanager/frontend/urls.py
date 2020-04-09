from django.urls import path
from . import views

urlpatterns = [
    path('', views.index) #takes index method of views.py
]
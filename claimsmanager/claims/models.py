from django.db import models
from django.contrib.auth.models import User

class Claim(models.Model):
    owner = models.CharField(max_length=100)
    message = models.CharField(max_length=100)
    result = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name="claims", on_delete=models.CASCADE, null=True)

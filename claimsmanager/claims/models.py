from django.db import models

class Claim(models.Model):
    owner = models.CharField(max_length=100)
    message = models.CharField(max_length=100)
    result = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

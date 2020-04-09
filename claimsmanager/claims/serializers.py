from rest_framework import serializers
from claims.models import Claim

#Claim serializer
class ClaimSerializer(serializers.ModelSerializer): #creating a serializer from claims model
    class Meta:
        model = Claim
        fields = '__all__'
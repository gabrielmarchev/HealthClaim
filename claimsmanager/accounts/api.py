from rest_framework import generics, permissions
from rest_framework.response import Response
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

# Register API
class RegisterAPI(generics.GenericAPIView): #takes care of functuonality
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs): #this means the def can take more arguments
        serializer = self.get_serializer(data=request.data) #any data from request
        serializer.is_valid(raise_exception=True) #make sure it's valid
        user = serializer.save() #save user in db
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1] #creates token (goes in request header) specific to user, so can identify when request made from frontend
        })

# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs): #this means the def can take more arguments
        serializer = self.get_serializer(data=request.data) #any data from request
        serializer.is_valid(raise_exception=True) #make sure it's valid
        user = serializer.validated_data #validate user
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1] #creates token (goes in request header) specific to user, so can identify when request made from frontend
        })


# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [ #needs token (need to be logged in) to access
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user #look at token that is sen talong, sends back associated user
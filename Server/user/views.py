from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed

from .serializers import RegistrationSerializer, LoginSerializer, ChangePasswordSerializer, ProfileSerializer
from .models import Profile

class RegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": serializer.data,
            "token": token.key
            }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,context={'request':request})

        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed as auth_failure:
            return Response({"message": str(auth_failure)}, status=status.HTTP_401_UNAUTHORIZED)
        except serializers.ValidationError as validation_error:
            return Response({"message": validation_error.detail}, status=status.HTTP_400_BAD_REQUEST)

        user, token = serializer.create(serializer.validated_data)
        return Response({
            "user": {
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
                },
            "token": token
            }, status=status.HTTP_200_OK)

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_class = (IsAuthenticated,)

    def get_object(self,queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({"message":"Not Logged In"},status=status.HTTP_400_BAD_REQUEST)
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.validated_data['old_password']):
                return Response({"old_password":['Wrong Password.']},status=status.HTTP_400_BAD_REQUEST)
            
            self.object.set_password(serializer.validated_data['new_password'])
            self.object.save()
            return Response({"message":"Password Updated Successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors,status=status.HTPP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()

    def get_object(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username)
        return user.profile

class ProfileCreateView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_class = [AllowAny]

    def create(self,request,*args,**kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()

    def get_object(self):
        username = self.kwargs.get('username')
        user = get_object_or_404(User, username=username)
        return user.profile


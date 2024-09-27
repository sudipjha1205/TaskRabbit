from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import AuthenticationFailed

from .models import Profile

class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(
            write_only=True,
            required=True,
            validators=[validate_password],
            style={'input_type':'password'}
            )

    class Meta:
        model = User
        fields = ('username','password','email','first_name','last_name')

    def create(self,validated_data):
        user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name']
                )
        user.set_password(validated_data['password'])
        user.save()

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(
            write_only=True,
            required=True,
            validators=[validate_password],
            style={'input_type':'password'}
            )

    def validate(self,attrs):
        username=attrs.get('username')
        password=attrs.get('password')

        if username and password:
            if not User.objects.filter(username=username).exists():
                raise serializers.ValidationError("Employee Id does not exist.")

            user = authenticate(request=self.context.get('request'),username=username,password=password)

            if not user:
                raise AuthenticationFailed("Invalid Employee Id or Password")

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError("Must include both Employee Id and password")

    def create(self, validated_data):
        user=validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return user, token.key

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
            write_only=True,
            required=True,
            validators=[validate_password],
            style={'input_type':'password'}
            )
    new_password = serializers.CharField(
            write_only=True,
            required=True,
            validators=[validate_password],
            style={'input_type':'password'}
            )

    def validate_old_password(self, value):
        user=self.context['request'].user
        if not user.check_password(value):
            raise ValidationError("Incorrect Old Password")
        return value

    def save(self, **kwargs):
        user=self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username',read_only=True)

    class Meta:
        model = Profile
        fields = ( 'username','designation','profile_picture','joined_at')

    def create(self,validated_data):
        profile = Profile.objects.create(
                user=validated_data['user'],
                designation = validated_data['designation'],
                profile_picture = validated_data['profile_picture']
            )
        profile.save()
        return profile

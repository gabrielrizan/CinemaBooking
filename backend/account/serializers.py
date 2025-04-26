from djoser.serializers import UserCreateSerializer, UserSerializer
from account.models import User
from rest_framework import serializers

class UserCreateSerializer(UserCreateSerializer):
    password = serializers.CharField(write_only=True)
    re_password = serializers.CharField(write_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'firstname', 'lastname', 'dob', 'password', 're_password', 'is_active', 'is_staff', 'date_joined')
        read_only_fields = ('id', 'is_active', 'is_staff', 'date_joined')

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('re_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('re_password', None)
        return super().create(validated_data)


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = ('id','email', 'firstname', 'lastname', 'dob', 'is_staff')

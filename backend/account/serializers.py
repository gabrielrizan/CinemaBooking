from djoser.serializers import UserCreateSerializer
from account.models import User

class UserCreateSerializer(UserCreateSerializer):
    password = serializers.CharField(write_only=True)  # Explicitly handle password
    re_password = serializers.CharField(write_only=True)  # Optional: confirm password

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'firstname', 'lastname', 'dob', 'is_active', 'is_staff', 'date_joined')
        read_only_fields = ('id', 'is_active', 'is_staff', 'date_joined')

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('re_password'):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('re_password', None)
        return super().create(validated_data)
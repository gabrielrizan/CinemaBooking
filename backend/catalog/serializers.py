from rest_framework import serializers
from .models import Cinema, Movie, ShowTime

class CinemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cinema
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class ShowTimeSerializer(serializers.ModelSerializer):
    cinema = CinemaSerializer()
    movie = MovieSerializer()

    class Meta:
        model = ShowTime
        fields = '__all__'

class MovieWithShowTimesSerializer(serializers.ModelSerializer):
    showtimes = ShowTimeSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = '__all__'

class CinemaWithShowTimesSerializer(serializers.ModelSerializer):
    showtimes = ShowTimeSerializer(many=True, read_only=True)

    class Meta:
        model = Cinema
        fields = '__all__'
from rest_framework import serializers
from .models import Cinema, Movie, ShowTime

# Serializer for Cinema model
class CinemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cinema
        fields = '__all__'

# Serializer for Movie model
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

# Serializer for ShowTime model
class ShowTimeSerializer(serializers.ModelSerializer):
    # Use Cinema and Movie serializers for nested data during read operations
    cinema = CinemaSerializer()
    movie = MovieSerializer()

    # Additional fields for detailed nested data
    cinema_details = CinemaSerializer(source='cinema', read_only=True)
    movie_details = MovieSerializer(source='movie', read_only=True)

    class Meta:
        model = ShowTime
        fields = '__all__'

    def create(self, validated_data):
        """
        Custom create method to handle nested objects.
        Extracts and assigns `cinema` and `movie` instances from validated data.
        """
        # Extract nested cinema and movie data
        cinema_data = validated_data.pop('cinema')
        movie_data = validated_data.pop('movie')

        # Get or create Cinema and Movie instances
        cinema, _ = Cinema.objects.get_or_create(
            name=cinema_data['name'],
            city=cinema_data['city'],
            defaults={'address': cinema_data['address']}
        )

        movie, _ = Movie.objects.get_or_create(
            title=movie_data['title'],
            defaults={
                'poster': movie_data.get('poster', ''),
                'runtime': movie_data.get('runtime', 0),
                'genre': movie_data.get('genre', ''),
                'rating': movie_data.get('rating', ''),
                'synopsis': movie_data.get('synopsis', ''),
                'director': movie_data.get('director', ''),
                'cast': movie_data.get('cast', ''),
                'release_date': movie_data.get('release_date', ''),
            }
        )

        # Create ShowTime instance
        showtime = ShowTime.objects.create(cinema=cinema, movie=movie, **validated_data)
        return showtime

    def update(self, instance, validated_data):
        """
        Custom update method to handle updates to nested objects.
        Allows updating related `cinema` and `movie` instances as well as other fields.
        """
        if 'cinema' in validated_data:
            cinema_data = validated_data.pop('cinema')
            instance.cinema, _ = Cinema.objects.get_or_create(
                name=cinema_data['name'],
                city=cinema_data['city'],
                defaults={'address': cinema_data['address']}
            )

        if 'movie' in validated_data:
            movie_data = validated_data.pop('movie')
            instance.movie, _ = Movie.objects.get_or_create(
                title=movie_data['title'],
                defaults={
                    'poster': movie_data.get('poster', ''),
                    'runtime': movie_data.get('runtime', 0),
                    'genre': movie_data.get('genre', ''),
                    'rating': movie_data.get('rating', ''),
                    'synopsis': movie_data.get('synopsis', ''),
                    'director': movie_data.get('director', ''),
                    'cast': movie_data.get('cast', ''),
                    'release_date': movie_data.get('release_date', ''),
                }
            )

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

# Serializer for Movie with related ShowTimes
class MovieWithShowTimesSerializer(serializers.ModelSerializer):
    # Include related showtimes (read-only)
    showtimes = ShowTimeSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = '__all__'

# Serializer for Cinema with related ShowTimes
class CinemaWithShowTimesSerializer(serializers.ModelSerializer):
    # Include related showtimes (read-only)
    showtimes = ShowTimeSerializer(many=True, read_only=True)

    class Meta:
        model = Cinema
        fields = '__all__'

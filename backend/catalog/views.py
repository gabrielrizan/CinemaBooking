from datetime import date
from rest_framework.response import Response
from rest_framework import status
from .models import Cinema, Movie, ShowTime, CinemaHall
from .serializers import CinemaSerializer, MovieSerializer, ShowTimeSerializer, CinemaHallSerializer
from rest_framework.views import APIView



class NowPlayingView(APIView):
    def get(self, request):
        # Get all movies that are currently playing
        movies = Movie.objects.filter(nowPlaying=True).order_by('-release_date')
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NowShowingView(APIView):
    def get(self, request):
        # Get all showtimes with their related movies and cinemas
        showtimes = ShowTime.objects.all().select_related('movie', 'cinema')
        serializer = ShowTimeSerializer(showtimes, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ShowTimeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShowTimeDetailView(APIView):
    def get(self, request, showtime_id):
        try:
            showtime = ShowTime.objects.select_related('movie', 'cinema').get(id=showtime_id)
        except ShowTime.DoesNotExist:
            return Response({"error": "Showtime not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ShowTimeSerializer(showtime)
        return Response(serializer.data)



class CinemaListView(APIView):
    def get(self, request):
        cinemas = Cinema.objects.all()
        serializer = CinemaSerializer(cinemas, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CinemaSerializer(data=request.data)
        if serializer.is_valid():
            cinema = serializer.save()
            return Response(CinemaSerializer(cinema).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovieShowtimesView(APIView):
    def get(self, request, movie_id):
        showtimes = ShowTime.objects.filter(movie_id=movie_id).select_related('cinema')
        serializer = ShowTimeSerializer(showtimes, many=True)
        return Response(serializer.data)

    def post(self, request, movie_id):
        # Add movie_id to the request data
        data = {**request.data, 'movie': movie_id}
        serializer = ShowTimeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MovieListView(APIView):
    def get(self, request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CinemaHallView(APIView):
    def get(self, request, hall_id):
        try:
            hall = CinemaHall.objects.get(id=hall_id)
        except CinemaHall.DoesNotExist:
            return Response({"error": "Cinema hall not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CinemaHallSerializer(hall)
        return Response(serializer.data)
    
    def put(self, request, hall_id):
        try:
            hall = CinemaHall.objects.get(id=hall_id)
        except CinemaHall.DoesNotExist:
            return Response({"error": "Cinema hall not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CinemaHallSerializer(hall, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CinemaHallByCinemaView(APIView):
    def get(self, request, cinema_id):
        halls = CinemaHall.objects.filter(cinema_id=cinema_id)
        serializer = CinemaHallSerializer(halls, many=True)
        return Response(serializer.data)
    
    def post(self, request, cinema_id):
        data = {**request.data, 'cinema': cinema_id}
        serializer = CinemaHallSerializer(data=data)
        if serializer.is_valid():
            hall = serializer.save()
            return Response(CinemaHallSerializer(hall).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SimilarMoviesView(APIView):
    def get(self, request, movie_id):
        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        similar_movies = Movie.objects.filter(genre=movie.genre).exclude(id=movie.id)
        serializer = MovieSerializer(similar_movies, many=True)
        return Response(serializer.data)
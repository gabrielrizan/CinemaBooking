from datetime import date
from rest_framework.response import Response
from rest_framework import status
from .models import Cinema, Movie, ShowTime, CinemaHall
from .serializers import CinemaSerializer, MovieSerializer, ShowTimeSerializer, CinemaHallSerializer
from rest_framework.views import APIView

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

class CinemaListView(APIView):
    def get(self, request):
        cinemas = Cinema.objects.all()
        serializer = CinemaSerializer(cinemas, many=True)
        return Response(serializer.data)

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
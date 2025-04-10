from django.urls import path
from .views import NowShowingView, CinemaListView, MovieShowtimesView, MovieListView, CinemaHallView, CinemaHallByCinemaView, ShowTimeDetailView

urlpatterns = [
    path('now-showing/', NowShowingView.as_view(), name='now-showing'),
    path('cinemas/', CinemaListView.as_view(), name='cinemas'),
    path('movies/<int:movie_id>/showtimes/', MovieShowtimesView.as_view(), name='movie-showtimes'),
    path('movies/', MovieListView.as_view(), name='movies'),
    path('cinema-halls/<int:hall_id>/', CinemaHallView.as_view(), name='cinema-hall'),
    path('cinemas/<int:cinema_id>/halls/', CinemaHallByCinemaView.as_view(), name='cinema-halls'),
    path('now-showing/<int:showtime_id>/', ShowTimeDetailView.as_view(), name='showtime-detail'),
]
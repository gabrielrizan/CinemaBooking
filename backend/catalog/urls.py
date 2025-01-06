from django.urls import path
from .views import NowShowingView, CinemaListView, MovieShowtimesView

urlpatterns = [
    path('now-showing/', NowShowingView.as_view(), name='now-showing'),
    path('cinemas/', CinemaListView.as_view(), name='cinemas'),
    path('movies/<int:movie_id>/showtimes/', MovieShowtimesView.as_view(), name='movie-showtimes'),
]
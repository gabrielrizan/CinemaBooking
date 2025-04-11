from django.db import models

class Cinema(models.Model):
    name = models.CharField(max_length = 100, default="Unknown Cinema")
    city = models.CharField(max_length = 100, default="Unknown City")
    address = models.TextField(default="Unknown Address")

    def __str__(self):
        return self.name
    
class Movie(models.Model):
    title = models.CharField(max_length=200)
    poster = models.URLField()  
    runtime = models.PositiveIntegerField(help_text="Runtime in minutes")
    genre = models.CharField(max_length=100)
    rating = models.CharField(max_length=20)
    ageRating = models.CharField(max_length=10, help_text="Age rating (e.g., PG-13)", default="PG-13")
    synopsis = models.TextField()
    director = models.CharField(max_length=100)
    cast = models.TextField(help_text="Comma-separated list of cast members")
    trailer = models.URLField(default="https://www.youtube.com/watch?v=BpJYNVhGf1s")
    nowPlaying = models.BooleanField(default=False, help_text="Is the movie currently playing?")
    release_date = models.DateField()
    
    def __str__(self):
        return self.title
    

class CinemaHall(models.Model):
    cinema = models.ForeignKey(Cinema, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    layout = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.name} at {self.cinema.name}"
    

class ShowTime(models.Model):
    cinema = models.ForeignKey(Cinema, on_delete=models.CASCADE)
    hall = models.ForeignKey(CinemaHall, on_delete=models.CASCADE, null=True, blank=True)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)  
    date = models.DateField()
    time = models.TimeField()
    format = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.movie.title} at {self.cinema.name} on {self.date} at {self.time}"
    
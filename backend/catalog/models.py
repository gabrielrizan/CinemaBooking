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
    synopsis = models.TextField()
    director = models.CharField(max_length=100)
    cast = models.TextField(help_text="Comma-separated list of cast members")
    release_date = models.DateField()

    def __str__(self):
        return self.title

class ShowTime(models.Model):
    cinema = models.ForeignKey(Cinema, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    format = models.CharField(max_length=20) 

    def __str__(self):
        return f"{self.movie.title} at {self.cinema.name} on {self.date} at {self.time}"
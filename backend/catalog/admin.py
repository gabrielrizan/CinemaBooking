from django.contrib import admin
from .models import Cinema, Movie, ShowTime

# Register your models here.
admin.site.register(Cinema)
admin.site.register(Movie)
admin.site.register(ShowTime)
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { HomepageMovie } from '../models/movie.model';

@Component({
  selector: 'app-recommendation',
  imports: [CardModule, CommonModule, MovieCardComponent],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.css',
})
export class RecommendationComponent {
  movies: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.fetchRecommendations();
  }

  fetchRecommendations(): void {
    this.ticketService.getRecommendations().subscribe({
      next: (data) => {
        this.movies = data.map((movie) => ({
          title: movie.title,
          description: movie.synopsis,
          imageUrl: movie.poster,
          actors: movie.cast.split(',').map((actor: string) => actor.trim()),
          rating: +movie.rating / 10,
          trailerUrl: movie.trailer,
          movieId: movie.id,
          year: new Date(movie.release_date).getFullYear(),
          director: movie.director,
          duration: movie.runtime,
          genre: movie.genre,
          backgroundUrl: movie.backgroundUrl || 'default-background.jpg',
          ageRating: movie.ageRating || 'PG-13',
        }));
        this.loading = false;
        console.log(this.movies);
      },
      error: () => {
        this.movies = [];
        this.loading = false;
      },
    });
  }
}

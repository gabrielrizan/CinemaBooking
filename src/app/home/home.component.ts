import { Component } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { NowShowingService } from '../services/now-showing.service';

@Component({
  selector: 'app-home',
  imports: [MovieCardComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  nowPlayingMovies: any[] = [];
  constructor(private playingService: NowShowingService) {
    this.playingService.getNowPlayingMovies().subscribe((data: any[]) => {
      this.nowPlayingMovies = data.map(movie => ({
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
        ageRating: movie.ageRating || 'PG-13'
      }));
      console.log("Now playing movies", this.nowPlayingMovies);
    });
  }

  

  trackByMovieId(index: number, movie: any): number {
    return movie.movieId;
  }
}

import { Injectable } from '@angular/core';
import { Genres } from './models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieInfoService {
  private selectedMovie: any;

  constructor() {}

  setSelectedMovie(movie: any) {
    this.selectedMovie = movie;
  }

  getSelectedMovie() {
    return this.selectedMovie;
  }

  getVotePercentage(voteAverage: number): number {
    return Math.floor(voteAverage * 10);
  }

  // getGenres(
  //   genreIds: number[] = [],
  //   movieGenres: Genres[] = [],
  //   tvGenres: Genres[] = [],
  //   mediaType: string
  // ): string {
  //   // Ensure that the selected genres array is valid
  //   const genres = mediaType === 'movie' ? movieGenres : tvGenres;

  //   // Safeguard: Check if genres is an array before filtering
  //   if (!Array.isArray(genres)) {
  //     console.error('Genres is not an array:', genres);
  //     return ''; // Return empty string if genres is not an array
  //   }

  //   // Safeguard: Check if genreIds is also a valid array
  //   if (!Array.isArray(genreIds)) {
  //     console.error('GenreIds is not an array:', genreIds);
  //     return ''; // Return empty string if genreIds is not an array
  //   }

  //   // Now safely filter and map over genres
  //   return genres
  //     .filter((genre) => genreIds.includes(genre.id))
  //     .map((genre) => genre.name)
  //     .join(', ');
  // }
}

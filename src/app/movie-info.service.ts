import { Injectable } from '@angular/core';

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

  getGenres(
    genreIds: number[],
    movieGenres: any[],
    tvGenres: any[],
    mediaType: string
  ): string {
    const genres = mediaType === 'movie' ? movieGenres : tvGenres;
    return genres
      .filter((genre) => genreIds.includes(genre.id))
      .map((genre) => genre.name)
      .join(', ');
  }
}

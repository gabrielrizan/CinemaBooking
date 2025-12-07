import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { forkJoin, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';

import { MultiSearchService } from '../multi-search.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-top-rated',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, MovieCardComponent],
  templateUrl: './top-rated.component.html',
  styleUrls: ['./top-rated.component.css'],
})
export class TopRatedComponent implements OnInit {
  topRatedMovies: any[] = [];
  loading = false;

  private readonly IMG_BASE = 'https://image.tmdb.org/t/p/w500';

  constructor(private tmdb: MultiSearchService) {}

  ngOnInit(): void {
    this.fetchTopRated();
  }

  private fetchTopRated(): void {
    this.loading = true;

    this.tmdb
      .getTopRatedMovies()
      .pipe(
        tap((res) => this.scaffold(res.results)),

        switchMap((res) => {
          const jobs = (res.results as any[]).map((r) =>
            forkJoin({
              id: of(r.id),
              details: this.tmdb
                .getMovieDetails(r.id)
                .pipe(catchError(() => of(null))),
              credits: this.tmdb
                .getMovieCredits(r.id)
                .pipe(catchError(() => of(null))),
            })
          );
          return forkJoin(jobs);
        })
      )
      .subscribe({
        next: (payload) => payload.forEach((p) => this.patchMovie(p)),
        error: () => (this.loading = false),
        complete: () => (this.loading = false),
      });
  }

  private scaffold(raw: any[]): void {
    this.topRatedMovies = raw.map((r) => ({
      title: r.title,
      description: r.overview,
      imageUrl: r.poster_path ? this.IMG_BASE + r.poster_path : '',
      backgroundUrl: r.backdrop_path ? this.IMG_BASE + r.backdrop_path : '',
      movieId: r.id.toString(),
      rating: r.vote_average,
      year: new Date(r.release_date).getFullYear().toString(),
      actors: [],
      director: '',
      duration: 0,
      genre: '',
      trailerUrl: '',
      ageRating: 'PG-13',
      nowPlaying: false,
    }));
  }

  private patchMovie(payload: {
    id: number;
    details: any;
    credits: any;
  }): void {
    const mv = this.topRatedMovies.find((m) => +m.movieId === payload.id);
    if (!mv) {
      return;
    }

    if (payload.details) {
      mv.duration = payload.details.runtime ?? 0;
      mv.genre = (payload.details.genres ?? [])
        .map((g: any) => g.name)
        .join(', ');

      const trailer = (payload.details.videos?.results ?? []).find(
        (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
      );
      mv.trailerUrl = trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : '';
    }

    if (payload.credits) {
      mv.actors = (payload.credits.cast ?? [])
        .slice(0, 6)
        .map((c: any) => c.name);
      const dir = (payload.credits.crew ?? []).find(
        (c: any) => c.job === 'Director'
      );
      mv.director = dir?.name || '';
    }
  }
}

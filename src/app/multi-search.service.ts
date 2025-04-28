import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Genres } from './models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MultiSearchService {
  private apiUrl = 'https://api.themoviedb.org/3/search/multi';
  private movieGenreUrl = 'https://api.themoviedb.org/3/genre/movie/list';
  private tvGenreUrl = 'https://api.themoviedb.org/3/genre/tv/list';
  private movieUrl = 'https://api.themoviedb.org/3/movie';
  private tvUrl = 'https://api.themoviedb.org/3/tv';
  private upcomingUrl = 'https://api.themoviedb.org/3/movie/upcoming';
  private popularUrl = 'https://api.themoviedb.org/3/movie/popular';
  private topRatedUrl = 'https://api.themoviedb.org/3/movie/top_rated';
  private movieTrailerUrl =
    'https://api.themoviedb.org/3/movie/{movie_id}/videos';

  constructor(private http: HttpClient) {}

  private cachedGenres: any[] | null = null;
  private genresSubject = new BehaviorSubject<any[]>([]);
  private genresLoaded = false;

  searchMovies(query: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: environment.bearer,
    });

    const params = new HttpParams().set('query', query);

    return this.http.get<any>(this.apiUrl, { headers, params });
  }

  getMovieDetails(movieId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.movieUrl}/${movieId}`, {
      headers: header,
    });
  }

  getMovieCredits(movieId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.movieUrl}/${movieId}/credits`, {
      headers: header,
    });
  }

  getTvDetails(tvId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.tvUrl}/${tvId}`, { headers: header });
  }

  getMovieGenres(): Observable<Genres[]> {
    if (this.cachedGenres) {
      return of(this.cachedGenres);
    }

    const headers = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http
      .get<{ genres: Genres[] }>(this.movieGenreUrl, { headers })
      .pipe(
        tap((data) => {
          this.cachedGenres = data.genres;
        }),
        map((data) => data.genres)
      );
  }

  getMovieReviews(movieId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.movieUrl}/${movieId}/reviews`, {
      headers: header,
    });
  }

  getMovieRecommendations(movieId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.movieUrl}/${movieId}/recommendations`, {
      headers: header,
    });
  }

  getTvGenres(): Observable<Genres[]> {
    if (this.cachedGenres) {
      return of(this.cachedGenres);
    }

    const headers = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http
      .get<{ genres: Genres[] }>(this.tvGenreUrl, { headers })
      .pipe(
        tap((data) => {
          this.cachedGenres = data.genres;
        }),
        map((data) => data.genres)
      );
  }

  getTvCredits(tvId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.tvUrl}/${tvId}/credits`, {
      headers: header,
    });
  }

  getTvReviews(tvId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.tvUrl}/${tvId}/reviews`, {
      headers: header,
    });
  }

  getTvRecommendations(tvId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.tvUrl}/${tvId}/recommendations`, {
      headers: header,
    });
  }

  getUpcomingMovies(): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(this.upcomingUrl, { headers: header });
  }

  getPopularMovies(): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(this.popularUrl, { headers: header });
  }

  getTopRatedMovies(): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(this.topRatedUrl, { headers: header });
  }

  getTrailer(movieId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(
      `${this.movieTrailerUrl.replace('{movie_id}', movieId)}`,
      {
        headers: header,
      }
    );
  }
}

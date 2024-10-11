import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { Genres } from './models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MultiSearchService {
  private apiUrl = 'https://api.themoviedb.org/3/search/multi'; // The Movie Database (TMDb) API endpoint
  private movieGenreUrl = 'https://api.themoviedb.org/3/genre/movie/list'; // The Movie Database (TMDb) API endpoint
  private tvGenreUrl = 'https://api.themoviedb.org/3/genre/tv/list'; // The Movie Database (TMDb) API endpoint
  private movieUrl = 'https://api.themoviedb.org/3/movie'; // The Movie Database (TMDb) API endpoint
  private tvUrl = 'https://api.themoviedb.org/3/tv'; // The Movie Database (TMDb) API endpoint

  constructor(private http: HttpClient) {}

  private cachedGenres: any[] | null = null;
  private genresSubject = new BehaviorSubject<any[]>([]);
  private genresLoaded = false;

  searchMovies(query: string): Observable<any> {
    // Set up the headers with the Authorization Bearer token
    const headers = new HttpHeaders({
      Authorization: environment.bearer,
    });

    // Set up query parameters
    const params = new HttpParams().set('query', query);

    // Return the HTTP request as an Observable
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
}

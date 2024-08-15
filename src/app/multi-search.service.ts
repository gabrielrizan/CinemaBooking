import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MultiSearchService {
  private apiUrl = 'https://api.themoviedb.org/3/search/multi'; // The Movie Database (TMDb) API endpoint
  private genreUrl = 'https://api.themoviedb.org/3/genre/movie/list'; // The Movie Database (TMDb) API endpoint
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

  getTvDetails(tvId: string): Observable<any> {
    const header = new HttpHeaders({
      Authorization: environment.bearer,
    });

    return this.http.get<any>(`${this.tvUrl}/${tvId}`, { headers: header });
  }

  getGenres(): Observable<any> {
    if (this.cachedGenres) {
      return of({ genres: this.cachedGenres });
    }
    // Set up the headers with the Authorization Bearer token
    const headers = new HttpHeaders({
      Authorization: environment.bearer,
    });

    // Return the HTTP request as an Observable
    return this.http.get<any>(this.genreUrl, { headers }).pipe(
      tap((data) => {
        this.cachedGenres = data.genres;
      })
    );
  }
}
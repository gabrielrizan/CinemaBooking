import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MultiSearchService {
  private apiUrl = 'https://api.themoviedb.org/3/search/multi'; // The Movie Database (TMDb) API endpoint

  constructor(private http: HttpClient) {}

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
}

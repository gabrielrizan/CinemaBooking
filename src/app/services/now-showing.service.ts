import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cinema {
  id: number;
  name: string;
  city: string;
  address: string;
}

export interface Movie {
  id: number;
  title: string;
  poster: string;
  runtime: number;
  genre: string;
  rating: string;
  synopsis: string;
  director: string;
  cast: string; // Will need to split this on frontend
  release_date: string;
}

export interface ShowTime {
  cinema: Cinema;
  movie: Movie;
  date: string;
  time: string;
  format: string;
}

@Injectable({
  providedIn: 'root',
})
export class NowShowingService {
  private apiUrl = 'http://localhost:8000/api/catalog';

  constructor(private http: HttpClient) {}

  getAllShowTimes(): Observable<ShowTime[]> {
    return this.http.get<ShowTime[]>(`${this.apiUrl}/now-showing/`);
  }

  getCinemas(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(`${this.apiUrl}/cinemas/`);
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/`);
  }

  addShowtime(showtime: ShowTime): Observable<ShowTime> {
    return this.http.post<ShowTime>(`${this.apiUrl}/now-showing/`, showtime);
  }
}

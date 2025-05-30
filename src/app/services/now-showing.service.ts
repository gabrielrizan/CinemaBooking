import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cinema {
  id: number;
  name: string;
  city: string;
  address: string;
  halls?: SeatLayout[];
}

export interface Movie {
  id?: number;
  title: string;
  poster: string;
  runtime: number;
  genre: string;
  rating: string;
  synopsis: string;
  director: string;
  ageRating: string;
  cast: string; // Will need to split this on frontend
  release_date: string;
}

export interface SeatLayout {
  id: string;
  name: string;
  rows: number;
  layout: Array<
    Array<{
      type: 'seat' | 'space';
    }>
  >;
  seatsPerRow: number[];
  createdAt: string;
}

export interface ShowTime {
  id?: number;
  cinema: Cinema;
  movie: Movie;
  date: string;
  time: string;
  format: string;
  hall: string;
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

  getCinemaHall(id: number): Observable<SeatLayout> {
    return this.http.get<SeatLayout>(`${this.apiUrl}/cinema-halls/${id}/`);
  }

  getCinemaHallsByCinema(cinemaId: number): Observable<SeatLayout[]> {
    return this.http.get<SeatLayout[]>(
      `${this.apiUrl}/cinemas/${cinemaId}/halls/`
    );
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies/`);
  }

  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/movies/`, movie);
  }

  addShowtime(showtime: ShowTime): Observable<ShowTime> {
    return this.http.post<ShowTime>(`${this.apiUrl}/now-showing/`, showtime);
  }

  getShowtimeById(id: number): Observable<ShowTime> {
    return this.http.get<ShowTime>(`${this.apiUrl}/now-showing/${id}/`);
  }

  getNowPlayingMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/now-playing/`);
  }

  addCinema(cinema: {
    name: string;
    city: string;
    address: string;
  }): Observable<Cinema> {
    return this.http.post<Cinema>(`${this.apiUrl}/cinemas/`, cinema);
  }

  addCinemaHall(
    cinemaId: number,
    hall: { name: string; layout?: any }
  ): Observable<SeatLayout> {
    return this.http.post<SeatLayout>(
      `${this.apiUrl}/cinemas/${cinemaId}/halls/`,
      hall
    );
  }

  updateMovie(movieId: number, data: Partial<{ nowPlaying: boolean }>) {
    return this.http.patch(`${this.apiUrl}/movies/${movieId}/`, data);
  }
}

import { Actor } from './actor.model';
import { Recommendation } from './recommendation.model';
import { Review } from './review.model';

export interface HomepageMovie {
  movieId: string;
  title: string;
  description: string;
  imageUrl: string;
  actors: string[];
  rating: number;
  year: string;
  director: string;
  duration: string;
  genre: string;
  backgroundUrl: string;
  ageRating: string;
  trailerUrl?: string;
  nowPlaying?: boolean;
}

export interface ApiMovie {
  backdrop_path?: string;
  poster_path?: string;
  title?: string;
  release_date?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  overview?: string;
  vote_average?: number;
  budget?: number;
  revenue?: number;
  created_by?: { name: string }[];
}

export interface SearchMedia {
  id?: string;
  title?: string;
  name?: string;
  first_air_date?: string;
  media_type?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
}

export interface Genres {
  id: number;
  name: string;
}

export interface MovieCredits {
  cast?: Actor[];
  crew?: { name: string; job: string }[];
}

export interface MovieDetails {
  movieId: string;
  title: string;
  description: string;
  imageUrl: string;
  actors: Actor[];
  rating: number;
  year: string;
  director: string;
  duration: string;
  genre: string;
  backgroundUrl: string;
  ageRating: string;
  trailerUrl?: string;
  reviews: Review[];
  recommendations: Recommendation[];
}

export interface TvDetails {
  tvId: string;
  title: string;
  description: string;
  imageUrl: string;
  actors: Actor[];
  rating: number;
  year: string;
  director: string;
  duration: string;
  genre: string;
  backgroundUrl: string;
  ageRating: string;
  trailerUrl?: string;
  reviews: Review[];
  recommendations: Recommendation[];
}

export interface Movie {
  title: string;
  poster: string;
  showtimes: { [key: string]: string[] }; // Allows '2D', '3D', 'IMAX', etc.
  format: string[]; // '2D', '3D', 'IMAX'
  runtime: number; // in minutes
  genre: string;
  rating: string; // e.g., 'AG', 'AP 12'
  languageInfo: string; // e.g., 'GR:(DUB :RO)'
}

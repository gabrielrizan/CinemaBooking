import { Actor } from './actor.model';

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
}

export interface MovieCredits {
  cast?: Actor[];
  crew?: { name: string; job: string }[];
}

export interface MovieDetails {}

export interface TvDetails {}

export interface Movie {
  movieId: string;
  title: string;
  year: string;
  ageRating: string;
  imageUrl: string;
  genre: string;
  description: string;
  duration: string;
  actors: string[];
  director: string;
  rating: number;
  trailerUrl?: string;
}

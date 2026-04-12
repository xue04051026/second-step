export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseDate: Date;
  rating: number;
  isWatched: boolean;
  posterUrl?: string;
  genre?: string;
  runtime?: number;
  country?: string;
  language?: string;
  tagline?: string;
  summary?: string;
}

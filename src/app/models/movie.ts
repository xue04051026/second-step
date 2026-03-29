export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseDate: Date;
  rating: number;
  isWatched: boolean;
  posterUrl?: string;
}
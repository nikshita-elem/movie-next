/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RouteParams {
  id: string;
}

/**
 * Interface representing a user.
 */
export interface User {
  _id: string;
  email: string;
}

/**
 * Interface representing the data returned from authentication APIs.
 */
export interface AuthResponseData {
  token: string;
  user: User;
}

/**
 * Interface representing the overall authentication response.
 */
export interface AuthResponse {
  data: AuthResponseData;
}

/**
 * Interface representing a movie.
 */
export interface Movie {
  _id?: string;
  image: string;
  title: string;
  year?: number | string;
}

/**
 * Props interface for the MovieCard component.
 */
export interface MovieCardProps {
  movie: Movie;
}

export interface GetMovieResponse {
  message: string;
  success: boolean;
  data?: Movie;
  errors?: any[];
}

export interface UpdateMovieResponse {
  message: string;
  success: boolean;
  data?: Movie;
  errors?: any[];
}

export interface DeleteMovieResponse {
  message: string;
  success: boolean;
  data?: Movie;
  errors?: any[];
}
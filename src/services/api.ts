const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_KEY = import.meta.env.VITE_MY_PUBLIC_API_KEY as string;

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface MovieDetail extends Movie {
  runtime: number;
  tagline: string;
  genres: Genre[];
  status: string;
  budget: number;
  revenue: number;
  imdb_id: string;
}

interface Genre {
  id: number;
  name: string;
}

interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const getPopularMovies = async (): Promise<Movie[]> => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = (await response.json()) as MovieListResponse;

  return data.results;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
  );
  const data = (await response.json()) as MovieListResponse;

  return data.results;
};

export const movieDetail = async (movieId: number): Promise<MovieDetail> => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`,
  );
  const data = (await response.json()) as MovieDetail;

  return data;
};

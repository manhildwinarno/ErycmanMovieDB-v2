import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies, getPopularMovies, movieDetail } from "../services/api";
import type { Movie, MovieDetail } from "../services/api";

export interface UseFetchReturn {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  movies: Movie[];
  error: string | null;
  loading: boolean;
  selectedMovie: MovieDetail | null;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleModal: (movie: Movie) => Promise<void>;
  handleCloseModal: () => void;
}

export const useFetch = (): UseFetchReturn => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);

  useEffect(() => {
    const loadPopularMovies = async (): Promise<void> => {
      try {
        const popularMovies: Movie[] = await getPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const searchResults: Movie[] = await searchMovies(searchQuery);
      navigate("/explore");
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }

    setSearchQuery("");
  };

  const handleModal = async (movie: Movie): Promise<void> => {
    try {
      const movieDetailResult: MovieDetail = await movieDetail(movie.id);
      setSelectedMovie(movieDetailResult);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = (): void => setSelectedMovie(null);
  return {
    searchQuery,
    setSearchQuery,
    movies,
    error,
    loading,
    selectedMovie,
    handleSearch,
    handleModal,
    handleCloseModal,
  };
};

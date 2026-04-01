import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies, getPopularMovies, movieDetail } from "./services/api";
import type { Movie, MovieDetail } from "./services/api";
import { MovieProvider } from "./contexts/useContext";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";

function App() {
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

  return (
    <MovieProvider>
      <div className="flex flex-col min-h-screen font-[Poppins]">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home>
                  <SearchBar
                    className="mt-8 relative flex"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                  />
                </Home>
              }
            />
            <Route
              path="/favorites"
              element={
                <Favorites
                  handleModal={handleModal}
                  selectedMovie={selectedMovie}
                  handleCloseModal={handleCloseModal}
                />
              }
            />
            <Route
              path="/explore"
              element={
                <Explore
                  movies={movies}
                  loading={loading}
                  error={error}
                  handleModal={handleModal}
                  selectedMovie={selectedMovie}
                  handleCloseModal={handleCloseModal}
                >
                  <SearchBar
                    className="relative flex"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                  />
                </Explore>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </MovieProvider>
  );
}

export default App;

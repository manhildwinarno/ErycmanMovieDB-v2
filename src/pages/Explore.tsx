import type React from "react";
import Modal from "../components/Modal";
import MovieCard from "../components/MovieCard";
import type { Movie, MovieDetail } from "../services/api";

type ExploreProps = {
  movies: Movie[];
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
  handleModal: (movie: Movie) => void;
  selectedMovie: MovieDetail | null;
  handleCloseModal: () => void;
};

function Explore({
  movies,
  children,
  loading,
  error,
  handleModal,
  selectedMovie,
  handleCloseModal,
}: ExploreProps) {
  return (
    <>
      <section className="search-container max-w-5xl min-h-60 mx-auto mt-12 px-4 mb-20 relative z-10">
        <div className="text-center flex flex-col justify-center items-center px-4 mb-12">
          {children}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="movie-container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mx-auto">
            {/* <!-- Movie container --> */}
            {movies.map((movie) => (
              <MovieCard
                movie={movie}
                key={movie.id}
                handleModal={handleModal}
              />
            ))}
            {/* <!-- Movie container end --> */}
          </div>
        )}
      </section>
      <Modal movie={selectedMovie} onClose={handleCloseModal} />
    </>
  );
}

export default Explore;

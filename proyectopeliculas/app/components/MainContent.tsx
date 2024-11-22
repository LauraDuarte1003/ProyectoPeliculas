"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_KEY = "07ae841cba8689091077a34ea07ab14d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface APIMovie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string;
  vote_average?: number;
}

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  image: string;
  rating: number;
  favorites: boolean;
}

interface Category {
  name: string;
  movies: Movie[];
}

interface MovieResponse {
  results: APIMovie[];
}

interface MainContentProps {
  searchResults: APIMovie[] | undefined;
  showFavorites: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  searchResults,
  showFavorites,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedResults, setFormattedResults] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("movieFavorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  const formatMovies = React.useCallback(
    (movies: APIMovie[] = []): Movie[] => {
      if (!Array.isArray(movies)) return [];
      return movies.map((movie) => {
        const releaseDate = movie.release_date
          ? new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(movie.release_date))
          : "Unknown";

        return {
          id: movie.id,
          title: movie.title || "",
          releaseDate,
          image: movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : "/placeholder.jpg",
          rating: Math.round((movie.vote_average || 0) * 10),
          favorites: favorites.some((fav) => fav.id === movie.id),
        };
      });
    },
    [favorites]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [popularResponse, nowPlayingResponse] = await Promise.all([
          axios.get<MovieResponse>(
            `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
          ),
          axios.get<MovieResponse>(
            `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
          ),
        ]);

        setCategories([
          {
            name: "Popular Movies",
            movies: formatMovies(popularResponse.data.results),
          },
          {
            name: "Now Playing",
            movies: formatMovies(nowPlayingResponse.data.results),
          },
        ]);
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error instanceof Error ? error.message : error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [formatMovies]);

  useEffect(() => {
    if (searchResults?.length) {
      setFormattedResults(formatMovies(searchResults));
    }
  }, [searchResults, formatMovies]);

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id);
      const newFavorites = exists
        ? prev.filter((fav) => fav.id !== movie.id)
        : [...prev, { ...movie, favorites: true }];

      try {
        localStorage.setItem("movieFavorites", JSON.stringify(newFavorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
      return newFavorites;
    });
  };

  const getProgressColor = (rating: number) => {
    return rating <= 60 ? "#f44336" : "#4caf50";
  };

  const movieRowStyle: React.CSSProperties = {
    display: "flex",
    overflowX: "auto",
    gap: "0",
    padding: "10px 0",
    scrollBehavior: "smooth",
    WebkitOverflowScrolling: "touch",
  };

  const renderMovieCard = (movie: Movie) => (
    <div
      style={{
        minWidth: "250px",
        maxWidth: "250px",
        backgroundColor: "#2c2c2c",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        marginRight: "20px",
        marginBottom: "10px",
      }}
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      {/* La parte de la imagen se mantiene igual */}
      <div
        style={{
          height: "300px",
          backgroundColor: "#333",
          position: "relative",
        }}
      >
        <Image
          src={movie.image}
          alt={movie.title}
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="/placeholder.jpg"
          onError={(e) => {
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = "/placeholder.jpg";
          }}
        />
      </div>

      <div
        style={{
          padding: "15px",
          backgroundColor: "#000",
          height: "160px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "1.1em",
              fontWeight: "bold",
              color: "white",
              marginBottom: "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.2em",
              height: "2.4em",
            }}
          >
            {movie.title}
          </h3>
          <p style={{ fontSize: "0.9em", color: "#aaa" }}>
            {movie.releaseDate}
          </p>
        </div>

        {/* Sección de Rating y Favorite modificada */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px", // Espacio reducido entre Rating y Favorite
            marginTop: "5px",
          }}
        >
          {/* Rating */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.75em",
                color: "white",
                marginTop: "2px",
                marginBottom: "8px",
              }}
            >
              Rating
            </span>
            <svg viewBox="0 0 36 36" style={{ width: "35px", height: "35px" }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={getProgressColor(movie.rating)}
                strokeWidth="2"
                strokeDasharray={`${movie.rating}, 100`}
              />
              <text
                x="18"
                y="20.35"
                fontSize="8"
                fill="white"
                textAnchor="middle"
              >
                {movie.rating}%
              </text>
            </svg>
          </div>

          {/* Favorite */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.75em",
                color: "white",
                marginBottom: "13px",
              }}
            >
              Favorite
            </span>
            <button
              onClick={() => toggleFavorite(movie)}
              style={{
                background: "none",
                border: "none",
                color: favorites.some((fav) => fav.id === movie.id)
                  ? "red"
                  : "white",
                fontSize: "1.5em",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Toggle Favorite"
            >
              <FaHeart size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ padding: "20px", color: "white" }}>Loading movies...</div>
    );
  }

  if (showFavorites) {
    return (
      <div
        style={{ backgroundColor: "#454545", color: "white", padding: "20px" }}
      >
        <h2
          style={{ marginBottom: "20px", fontSize: "1.5em", color: "#FBBF24" }}
        >
          My Favorites
        </h2>
        {favorites.length > 0 ? (
          <div style={movieRowStyle}>
            {favorites.map((movie) => (
              <div key={movie.id}>{renderMovieCard(movie)}</div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "white" }}>
            No favorite movies yet. Start adding some!
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#454545", color: "white" }}>
      {formattedResults.length > 0 ? (
        <div style={{ marginBottom: "40px" }}>
          <h2
            style={{
              marginBottom: "20px",
              fontSize: "1.5em",
              padding: "0 20px",
            }}
          >
            Search Results
          </h2>
          <div style={movieRowStyle}>
            {formattedResults.map((movie) => (
              <div key={movie.id}>{renderMovieCard(movie)}</div>
            ))}
          </div>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category.name} style={{ marginBottom: "40px" }}>
            <h2
              style={{
                marginBottom: "20px",
                fontSize: "1.5em",
                padding: "0 20px",
              }}
            >
              {category.name}
            </h2>
            <div style={movieRowStyle}>
              {category.movies.map((movie) => (
                <div key={movie.id}>{renderMovieCard(movie)}</div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MainContent;

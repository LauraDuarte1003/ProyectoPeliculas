"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { LuPlay } from "react-icons/lu";

const API_KEY = "07ae841cba8689091077a34ea07ab14d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

interface MovieDetails {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
}

interface MovieDetailsProps {
  movieId: number;
  onBack: () => void;
}

const MovieDetailsView: React.FC<MovieDetailsProps> = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const movieCategories = [
    "Aviation",
    "Fighter Jets",
    "Military",
    "Action",
    "Sequel",
    "Friendship",
    "Legacy",
    "Mentorship",
    "Aerial Combat",
    "Naval Aviation",
  ];

  const getProgressColor = (rating: number) => {
    return rating <= 60 ? "#f44336" : "#4caf50";
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieResponse, recommendationsResponse, videosResponse] =
          await Promise.all([
            axios.get(
              `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
            ),
            axios.get(
              `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
            ),
            axios.get(
              `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
            ),
          ]);

        setMovie(movieResponse.data);
        setRecommendations(recommendationsResponse.data.results.slice(0, 6));

        const officialTrailer = videosResponse.data.results.find(
          (video: any) =>
            (video.type === "Trailer" && video.official) ||
            video.type === "Trailer"
        );

        if (officialTrailer) {
          setTrailer(officialTrailer.key);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isLoading || !movie) {
    return (
      <div
        style={{
          backgroundColor: "#1a1a1a",
          color: "white",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  const ratingPercentage = Math.round(movie.vote_average * 10);

  return (
    <div style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <div
        style={{
          position: "relative",
          color: "white",
          minHeight: "90vh",
          paddingBottom: "40px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: "0.3",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              padding: "20px 40px",
              paddingBottom: "0",
            }}
          >
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <FaArrowLeft size={24} />
            </button>
          </div>

          <div
            style={{
              padding: "20px 40px",
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "40px",
            }}
          >
            <div>
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "100%",
                  marginBottom: "20px",
                }}
              />
              {trailer && (
                <button
                  onClick={() =>
                    window.open(
                      `https://www.youtube.com/watch?v=${trailer}`,
                      "_blank"
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: "#ffd700",
                    border: "none",
                    borderRadius: "5px",
                    color: "black",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  Official Trailer
                  <LuPlay />
                </button>
              )}
            </div>

            <div>
              <h1
                style={{
                  fontSize: "2.5em",
                  marginBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                {movie.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  gap: "250px",
                  marginBottom: "30px",
                }}
              >
                <span style={{ color: "#ccc" }}>
                  {new Date(movie.release_date).toLocaleDateString()}
                </span>
                <span style={{ color: "#ccc" }}>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                </span>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    marginBottom: "10px",
                    fontSize: "2.0em",
                    fontWeight: "bold",
                  }}
                >
                  Overview:
                </h3>
                <p
                  style={{
                    lineHeight: "1.6",
                    fontSize: "1.1em",
                    maxWidth: "800px",
                  }}
                >
                  {movie.overview}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "800px",
                  margin: "40px 0",
                }}
              >
                <div style={{ position: "relative" }}>
                  <svg
                    viewBox="0 0 36 36"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <path
                      d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={getProgressColor(ratingPercentage)}
                      strokeWidth="2"
                      strokeDasharray={`${ratingPercentage}, 100`}
                    />
                    <text
                      x="18"
                      y="20.35"
                      fontSize="8"
                      fill="white"
                      textAnchor="middle"
                    >
                      {ratingPercentage}%
                    </text>
                  </svg>
                </div>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  style={{
                    background: "none",
                    border: "none",
                    color: isFavorite ? "#ff4444" : "white",
                    fontSize: "28px",
                    cursor: "pointer",
                  }}
                >
                  <FaHeart />
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                {movieCategories.map((category, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "5px 15px",
                      borderRadius: "1px",
                      border: "1px solid #ffd700",
                      color: "#ffd700",
                      fontSize: "0.9em",
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div style={{ padding: "40px" }}>
          <h2
            style={{
              fontSize: "1.5em",
              marginBottom: "20px",
              color: "white",
            }}
          >
            Recommendations
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
            {recommendations.map((movie) => (
              <div
                key={movie.id}
                onClick={() => (window.location.href = `/movie/${movie.id}`)}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    aspectRatio: "2/3",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsView;

// app/movie/[id]/page.tsx
"use client";
import { useRouter, useParams } from "next/navigation";
import MovieDetailsView from "@/app/pages/Details/moviedetails";

export default function MoviePage() {
  const router = useRouter();
  const params = useParams();
  const movieId = Number(params.id);

  const handleBack = () => {
    router.push("/");
  };

  return <MovieDetailsView movieId={movieId} onBack={handleBack} />;
}

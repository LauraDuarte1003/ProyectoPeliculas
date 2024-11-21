import React from "react";

const Banner: React.FC = () => {
  return (
    <div className="w-full bg-[#1a1a1a] py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to QuickBet Movies
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl">
          Discover the latest and greatest movies from around the world. Search,
          explore, and find your next favorite film.
        </p>
      </div>
    </div>
  );
};

export default Banner;

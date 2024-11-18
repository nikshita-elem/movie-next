"use client";

import { MovieCardProps } from "@/types/common";
import Image from "next/image";
import Link from "next/link";
import React from "react";


/**
 * MovieCard Component
 * 
 * Displays a movie card with an image, title, and year.
 * Includes a link to edit the movie details.
 * Utilizes Next.js Image component for optimized image loading.
 */
const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
      <Link href={`/edit/${movie._id}`} className="relative sm:h-60 hover:cursor-pointer">
        <Image
          src={movie.image}
          alt={`Cover image for ${movie.title}`}
          width={300}
          height={100}
          className="rounded-t-lg h-[400px] w-[266px] object-cover"
          priority
        />
      </Link>
      <div className="p-4">
        <h2 className="body-large">{movie.title}</h2>
        {movie.year && <p className="text-gray-400">{movie.year}</p>}
      </div>
    </div>
  );
};

/**
 * Memoized MovieCard Component
 * 
 * Prevents unnecessary re-renders if the movie prop hasn't changed.
 */
export default React.memo(MovieCard);

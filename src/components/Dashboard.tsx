"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import MovieCard from "./cards/MovieCard";
import Pagination from "./Pagination";
import Loading from "./Loading";
import EmptyDashboard from "./EmptyDashboard";

interface Movie {
    _id: string;
    image: string;
    title: string;
    year?: string;
}

interface FetchMoviesResponse {
    success: boolean;
    data: Movie[];
    totalData: number;
    message?: string;
}

const PAGE_SIZE = 8;

export default function DashBoard() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalData, setTotalData] = useState<number>(0);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const totalPages = useMemo(() => Math.ceil(totalData / PAGE_SIZE), [totalData]);

    const fetchMovies = useCallback(async (page: number, abortSignal: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/movies?page=${page}`, {
                method: "GET",
                signal: abortSignal,
            });

            const data: FetchMoviesResponse = await response.json();
            if (data?.data?.length) {
                setMovies(data.data);
                setTotalData(data.totalData);
            } 
        } catch (err) {
            if (err instanceof Error) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError(err.message);
                }
            } else {
                console.error("An unknown error occurred.");
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchMovies(currentPage, controller.signal);

        return () => {
            controller.abort();
        };
    }, [currentPage, fetchMovies]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center px-6 py-36 overflow-hidden">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center px-6 py-36 overflow-hidden">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!movies.length) {
        return <EmptyDashboard />;
    }

    return (
        <div className="flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-5xl">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={setCurrentPage}
            />
        </div>
    );
}

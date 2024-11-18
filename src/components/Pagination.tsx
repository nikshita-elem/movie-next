"use client";

import { useTranslations } from "next-intl";
import React, { useMemo, useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, handlePageChange }) => {
  const t = useTranslations("Movie");

  // Memoize the array of page numbers to prevent unnecessary computations
  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  // Handlers for previous and next buttons, memoized with useCallback
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <nav className="flex flex-col items-center m-28 relative z-10 w-full" aria-label="Pagination">
      <ul className="flex flex-wrap justify-center gap-2">
        {/* Previous Button */}
        <li>
          <button
            type="button"
            className={`text-white font-bold px-4 py-2 rounded-l-md transition-colors duration-200 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#2BD17E]"
            }`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label={t("pervious")}
          >
            {t("pervious")}
          </button>
        </li>

        {/* Page Number Buttons */}
        {pages.map((pageNumber) => (
          <li key={pageNumber}>
            <button
              type="button"
              className={`px-4 py-2 mx-1 rounded-md transition-colors duration-200 ${
                currentPage === pageNumber
                  ? "bg-primary text-white"
                  : "bg-card text-white hover:bg-[#2BD17E] hover:text-white"
              }`}
              onClick={() => handlePageChange(pageNumber)}
              aria-current={currentPage === pageNumber ? "page" : undefined}
              aria-label={`Page ${pageNumber}`}
            >
              {pageNumber}
            </button>
          </li>
        ))}

        {/* Next Button */}
        <li>
          <button
            type="button"
            className={`body-regular px-4 py-2 rounded-r-md transition-colors duration-200 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#2BD17E]"
            }`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label={t("next")}
          >
            {t("next")}
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Wrap the component with React.memo to prevent unnecessary re-renders
export default React.memo(Pagination);

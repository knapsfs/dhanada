import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 border-t border-gray-200 pt-10 flex-wrap">
          {/* Previous Button */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 mr-2 cursor-pointer ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed pointer-events-none"
                : "text-gray-600 hover:text-[#032e92] hover:bg-gray-100"
            }`}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Previous
          </button>

          {/* Page Numbers */}
          {getPages().map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="text-gray-400 font-bold px-2">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange && onPageChange(page)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-[#032e92] text-white shadow-md shadow-blue-900/20"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ml-2 cursor-pointer ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed pointer-events-none"
                : "text-gray-700 hover:text-[#032e92] hover:bg-blue-50"
            }`}
          >
            Next
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
}

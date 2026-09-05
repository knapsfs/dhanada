import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Pagination() {
  return (
    <div className="bg-white pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 border-t border-gray-200 pt-10">

          <Link to="#" className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-2 mr-4">
            <FontAwesomeIcon icon={faArrowLeft} />
            Previous
          </Link>

          <Link to="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold bg-[#032e92] text-white shadow-md shadow-blue-900/20">
            1
          </Link>
          <Link to="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            2
          </Link>
          <Link to="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            3
          </Link>

          <span className="text-gray-400 font-bold px-2">...</span>

          <Link to="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
            12
          </Link>

          <Link to="#" className="px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:text-[#032e92] hover:bg-blue-50 transition-colors flex items-center gap-2 ml-4">
            Next
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>

        </div>
      </div>
    </div>
  );
}

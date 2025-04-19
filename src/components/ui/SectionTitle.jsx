import { Link } from 'react-router-dom';

const SectionTitle = ({ 
  title, 
  subtitle, 
  actionText, 
  actionLink,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
      
      {actionText && actionLink && (
        <Link 
          to={actionLink}
          className="inline-flex items-center mt-3 md:mt-0 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
        >
          {actionText}
          <svg 
            className="ml-1 w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default SectionTitle; 
import { useState } from 'react';

const Tabs = ({ tabs, initialTab = 0, className = '' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  return (
    <div className={className}>
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === index
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
              aria-current={activeTab === index ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs; 
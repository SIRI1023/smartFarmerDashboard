import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (location: string) => void;
  defaultLocation?: string;
}

const LocationSearch: React.FC<Props> = ({ onSearch, defaultLocation = '' }) => {
  const [location, setLocation] = useState(defaultLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g., Austin, TX)"
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <button
          type="submit"
          className="absolute right-2 top-1.5 px-4 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default LocationSearch;
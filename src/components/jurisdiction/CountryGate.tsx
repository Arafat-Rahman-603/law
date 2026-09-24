'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Globe } from 'lucide-react';
import { ICountry } from '@/models/Country';

interface Props {
  countries: ICountry[];
}

export default function CountryGate({ countries }: Props) {
  const [detecting, setDetecting] = useState(false);
  const router = useRouter();

  const handleSelect = (code: string) => {
    // Save to cookies
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `ax_country=${code}; path=/; max-age=31536000`;
    router.push(`/es/${code.toLowerCase()}`); 
    router.refresh();
  };

  const handleDetectLocation = () => {
    setDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // TODO: Phase 2 - Integrate reverse geocoding API
          setDetecting(false);
          alert('Location detected via coordinates, but geocoding API is pending configuration. Please select manually for now.');
        },
        () => {
          setDetecting(false);
          alert('Could not detect location. Please choose manually.');
        }
      );
    } else {
      setDetecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-accent">
            <Globe size={32} className="text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome to Axiomixs Law</h2>
        <p className="text-center text-gray-500 mb-8">
          Legal information is jurisdiction-specific. Choose your country to continue.
        </p>

        <button
          onClick={handleDetectLocation}
          disabled={detecting}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors mb-6 disabled:opacity-70 cursor-pointer"
        >
          <MapPin size={18} />
          {detecting ? 'Detecting location...' : 'Detect my country automatically'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400">or choose manually</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {countries.length > 0 ? (
            countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleSelect(country.code)}
                className="p-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all text-center cursor-pointer"
              >
                {country.name}
              </button>
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-400 text-sm">No countries configured yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

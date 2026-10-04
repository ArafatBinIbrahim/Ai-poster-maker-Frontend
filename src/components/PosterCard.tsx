import React from 'react';
import { IPoster } from '../types';

interface PosterCardProps {
  poster: IPoster;
  onSelect: (id: string) => void;
}

export default function PosterCard({ poster, onSelect }: PosterCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col">
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {poster.generatedImageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={poster.generatedImageUrl}
            alt={poster.formData?.headlineText || 'Poster'}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-yellow-600 font-semibold uppercase">{poster.status}</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">{poster.formData?.headlineText || 'Political Poster'}</h3>
          <p className="text-xs text-gray-500 mb-2">Occasion: {poster.formData?.occasionType}</p>
          <p className="text-xs text-gray-600"><strong>Name:</strong> {poster.formData?.name}</p>
          <p className="text-xs text-gray-600"><strong>Party:</strong> {poster.formData?.party}</p>
        </div>
        <button
          onClick={() => onSelect(poster._id)}
          className="mt-4 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded transition"
        >
          View Details & Download
        </button>
      </div>
    </div>
  );
}
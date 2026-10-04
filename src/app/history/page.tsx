'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Poster {
  _id: string;
  title?: string;
  imageUrl?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export default function HistoryPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError('Please login to view your history.');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const userId = user?._id || user?.id;

        if (!userId || userId === 'current-user-id') {
          setError('Valid User ID not found.');
          setLoading(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/posters/user/${encodeURIComponent(userId)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch posters: ${response.status}`);
        }
        
        const data = await response.json();
        setPosters(data.data || data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching history:", err.message);
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Poster Generation History</h1>

      {loading && <p className="text-gray-600">Loading your history...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && posters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You havent generated any posters yet.</p>
          <Link 
            href="/create-poster" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Poster Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posters.map((poster) => (
          <div key={poster._id} className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
            {poster.imageUrl && (
              <img 
                src={poster.imageUrl} 
                alt={poster.title || 'Poster'} 
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{poster.title || 'Untitled Poster'}</h3>
              <p className="text-sm text-gray-500">
                {poster.createdAt ? new Date(poster.createdAt).toLocaleDateString() : ''}
              </p>
            </div>
            {poster._id && (
              <Link 
                href={`/preview/${poster._id}`}
                className="mt-4 text-center block bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded transition"
              >
                View Preview
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
//Project description er Core Feature #1 (Template library — curated poster templates categorized by occasion) onujay ei page-ti ready kora hoyeche
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { ITemplate } from '../../types';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const occasions = ['All', 'বিজয় দিবস', 'শোক/স্মরণ', 'নির্বাচনী প্রচার', 'শুভেচ্ছা', 'ঈদ/উৎসব'];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const url = selectedOccasion === 'All' 
          ? '/templates' 
          : `/templates?occasion=${encodeURIComponent(selectedOccasion)}`;
        const response = await api.get(url);
        setTemplates(Array.isArray(response.data) ? response.data : response.data.templates || []);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [selectedOccasion]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Poster Template Library</h1>
            <p className="text-sm text-gray-600 mt-1">Select a curated template categorized by occasion to start generating your poster.</p>
          </div>
          <button
            onClick={() => router.push('/create-poster')}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700"
          >
            Create Custom Poster
          </button>
        </div>

        {/* Occasion Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {occasions.map((occasion) => (
            <button
              key={occasion}
              onClick={() => setSelectedOccasion(occasion)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedOccasion === occasion
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {occasion}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium text-gray-600">Loading Templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-md text-center">
            <p className="text-gray-500 mb-4">No templates found for this occasion category.</p>
            <button
              onClick={() => setSelectedOccasion('All')}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700"
            >
              View All Templates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col">
                <div className="h-60 bg-gray-100 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={template.thumbnailUrl}
                    alt={template.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                    {template.occasionType}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base mb-1">{template.title}</h3>
                  </div>
                  <button
                    onClick={() => router.push(`/create-poster?templateId=${template._id}`)}
                    className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition shadow"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
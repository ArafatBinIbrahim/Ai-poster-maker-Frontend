'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextMode ? 'dark' : 'light');
    }
  };

  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-gray-50 text-gray-900'} min-h-screen flex flex-col justify-between transition-colors duration-300`}>
      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          AI Political Poster
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition ${
              darkMode 
                ? 'bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700' 
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={() => router.push('/login')}
            className={`text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Create Stunning <span className="text-blue-600">Political Posters</span> in Seconds with AI
        </h1>
        <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Generate professional political posters for national occasions, electoral campaigns, greetings, and local events effortlessly using our smart AI platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push('/create-poster')}
            className="px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg transition"
          >
            Create Your Poster Now
          </button>
          <button
            onClick={() => router.push('/history')}
            className={`px-8 py-3 text-base font-semibold rounded-lg border transition shadow-sm ${
              darkMode 
                ? 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700' 
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            View Your History
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className={`p-6 rounded-xl shadow-sm border transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
            <h3 className="font-bold text-lg mb-2">⚡ Instant Generation</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Select curated templates, input your credentials, upload photos, and get your AI poster generated instantly.</p>
          </div>
          <div className={`p-6 rounded-xl shadow-sm border transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
            <h3 className="font-bold text-lg mb-2">🇧🇩 Bangla & Custom Fields</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fully tailored for local political campaigns with dedicated fields for designation, party, area, and Bangla headlines.</p>
          </div>
          <div className={`p-6 rounded-xl shadow-sm border transition ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-900'}`}>
            <h3 className="font-bold text-lg mb-2">📥 High-Res Export</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Preview your customized posters, regenerate if needed, and download high-resolution formats ready for social media or print.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 text-center text-sm border-t ${darkMode ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
        &copy; {new Date().getFullYear()} AI Political Poster Maker. All rights reserved.
      </footer>
    </div>
  );
}
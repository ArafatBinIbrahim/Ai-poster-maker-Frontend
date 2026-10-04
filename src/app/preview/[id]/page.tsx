'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../services/api';
import { IPoster } from '../../../types';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function PreviewPosterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [poster, setPoster] = useState<IPoster | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const fetchPosterDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posters/${id}`);
        setPoster(response.data);
      } catch (err) {
        console.error('Failed to load poster details:', err);
        setError('Failed to load poster details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosterDetails();
  }, [id]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const response = await api.post(`/posters/${id}/regenerate`);
      setPoster(response.data);
    } catch (err) {
      console.error('Failed to regenerate poster:', err);
      alert('Failed to regenerate poster.');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = () => {
    if (poster?.generatedImageUrl) {
      const link = document.createElement('a');
      link.href = poster.generatedImageUrl;
      link.download = `political-poster-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20 text-lg font-medium text-gray-600">Loading Poster Preview...</div>
        <Footer />
      </div>
    );
  }

  if (error || !poster) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20 text-red-600 font-medium">{error || 'Poster not found'}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Poster Preview & Download</h1>
          <div className="space-x-3">
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded shadow transition disabled:opacity-50"
            >
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded shadow transition"
            >
              Download High-Res
            </button>
          </div>
        </div>

        {/* Bangladeshi Political Poster Styled Frame */}
        <div className="bg-amber-950 p-4 rounded-xl shadow-2xl border-4 border-yellow-500 max-w-xl mx-auto text-white relative">
          
          {/* Top Header / Occasion Section */}
          <div className="text-center border-b-2 border-yellow-400 pb-3 mb-4">
            <p className="text-xs text-yellow-300 font-semibold tracking-wide">বিসমিল্লাহির রাহমানির রাহিম</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mt-1">
              {poster.formData?.headlineText || 'মহান বিজয় দিবস'}
            </h2>
            <p className="text-xs text-gray-200 mt-1">
              অনুষ্ঠান: {poster.formData?.occasionType} | {poster.formData?.party}
            </p>
          </div>

          {/* Main Content Area (Leader Photo & Symbol/Party Graphic) */}
          <div className="grid grid-cols-2 gap-4 items-center bg-amber-900 p-4 rounded-lg border border-yellow-600/50 my-4">
            <div className="h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-yellow-400 flex items-center justify-center">
              {poster.uploadedPhotoUrls?.[0] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={poster.uploadedPhotoUrls[0]} alt="Leader" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400">Leader Photo</span>
              )}
            </div>
            <div className="flex flex-col items-center justify-center bg-amber-950 p-4 rounded-lg border border-yellow-500 text-center">
              <div className="w-16 h-16 bg-yellow-400 text-amber-950 rounded-full flex items-center justify-center font-bold text-xl mb-2 shadow">
                 प्रतीक
              </div>
              <span className="text-sm font-bold text-yellow-300">ভোট দিন / সালাম নিন</span>
              <span className="text-xs text-gray-300 mt-1">{poster.formData?.district || 'ঢাকা, বাংলাদেশ'}</span>
            </div>
          </div>

          {/* Bottom Banner Section (Name & Designation) */}
          <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-600 text-amber-950 p-4 rounded-lg text-center shadow-inner mt-4 border border-yellow-300">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
              {poster.formData?.name || 'জনাব নাম'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-950 mt-1">
              {poster.formData?.designation || 'পদবি ও দায়িত্ব'}
            </p>
            <div className="mt-2 pt-2 border-t border-amber-900/30 text-[11px] font-semibold text-amber-900">
              প্রচারে: {poster.formData?.party || 'সাধারণ কর্মী ও শুভানুধ্যায়ীবৃন্দ'}
            </div>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/history')}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← View All Poster History
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
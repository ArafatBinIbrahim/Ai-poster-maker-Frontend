'use client';
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

interface PosterFormData {
  occasion?: string;
  headline?: string;
  district?: string;
  name?: string;
  designation?: string;
  party?: string;
}

export default function CreatePosterPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('');
  
  const [confirmedPhotoUrl, setConfirmedPhotoUrl] = useState<string>('');
  const [savedPosterData, setSavedPosterData] = useState<Record<string, unknown> | null>(null);
  
  const posterRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<PosterFormData>({
    occasion: 'মহান বিজয় দিবস',
    headline: '',
    district: '',
    name: '',
    designation: '',
    party: '',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ai-poster-maker-backend.onrender.com/api';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setUploadedPhotoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPhotoUrl = uploadedPhotoUrl;

      if (selectedFile && !finalPhotoUrl.startsWith('data:')) {
        setUploadingImage(true);
        const dataForm = new FormData();
        dataForm.append('image', selectedFile);

        try {
          const res = await fetch(`${apiUrl}/upload`, {
            method: 'POST',
            body: dataForm,
          });
          const textRes = await res.text();
          const data = textRes ? JSON.parse(textRes) : {};
          if (res.ok && data.url) {
            finalPhotoUrl = data.url;
          }
        } catch {
          // Fallback handled
        } finally {
          setUploadingImage(false);
        }
      }

      setConfirmedPhotoUrl(finalPhotoUrl);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const response = await fetch(`${apiUrl}/posters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          templateId: '650c1234567890abcdef1234',
          formData,
          uploadedPhotoUrls: [finalPhotoUrl],
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Server returned HTML/Invalid JSON instead of API response.`);
      }

      if (response.ok) {
        setSavedPosterData(data.data || { success: true });
        alert('Poster generated and saved successfully!');
      } else {
        alert(`Error: ${data.message || 'Failed to generate poster'}`);
      }
    } catch (err: unknown) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Network error or server down!';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
          stylesheets.forEach((sheet) => sheet.remove());

          const poster = clonedDoc.getElementById('poster-preview');
          if (poster) {
            poster.style.backgroundColor = '#064e3b';
            poster.style.color = '#ffffff';
            poster.style.width = '550px';
            poster.style.padding = '20px';
            poster.style.borderRadius = '16px';
            poster.style.border = '4px solid #facc15';
            poster.style.fontFamily = 'sans-serif';
            poster.style.display = 'flex';
            poster.style.flexDirection = 'column';
            poster.style.justifyContent = 'space-between';

            const header = poster.querySelector('#poster-header') as HTMLElement;
            if (header) {
              header.style.backgroundColor = 'rgba(0,0,0,0.4)';
              header.style.border = '1px solid rgba(250, 204, 21, 0.5)';
              header.style.textAlign = 'center';
              header.style.padding = '10px 12px';
              header.style.borderRadius = '12px';
            }

            const middle = poster.querySelector('#poster-middle') as HTMLElement;
            if (middle) {
              middle.style.display = 'grid';
              middle.style.gridTemplateColumns = '1fr 1fr';
              middle.style.gap = '12px';
              middle.style.margin = '16px 0';
              middle.style.alignItems = 'center';
            }

            const leaderBox = poster.querySelector('#leader-box') as HTMLElement;
            if (leaderBox) {
              leaderBox.style.backgroundColor = 'rgba(15, 23, 42, 0.7)';
              leaderBox.style.border = '2px solid rgba(250, 204, 21, 0.7)';
              leaderBox.style.padding = '8px';
              leaderBox.style.borderRadius = '12px';
              leaderBox.style.textAlign = 'center';
            }

            const leaderImgWrapper = poster.querySelector('#leader-img-wrapper') as HTMLElement;
            if (leaderImgWrapper) {
              leaderImgWrapper.style.width = '100%';
              leaderImgWrapper.style.height = '190px';
              leaderImgWrapper.style.position = 'relative';
              leaderImgWrapper.style.overflow = 'hidden';
              leaderImgWrapper.style.borderRadius = '8px';
              leaderImgWrapper.style.border = '1px solid rgba(250, 204, 21, 0.4)';
              leaderImgWrapper.style.backgroundColor = '#000000';
              leaderImgWrapper.style.display = 'flex';
              leaderImgWrapper.style.alignItems = 'center';
              leaderImgWrapper.style.justifyContent = 'center';
            }

            const leaderImg = poster.querySelector('#leader-img') as HTMLElement;
            if (leaderImg) {
              leaderImg.style.width = '100%';
              leaderImg.style.height = '100%';
              leaderImg.style.objectFit = 'cover';
              leaderImg.style.objectPosition = 'center top';
            }

            const symbolBox = poster.querySelector('#symbol-box') as HTMLElement;
            if (symbolBox) {
              symbolBox.style.backgroundColor = '#450a0a';
              symbolBox.style.border = '2px solid rgba(250, 204, 21, 0.7)';
              symbolBox.style.padding = '12px';
              symbolBox.style.borderRadius = '12px';
              symbolBox.style.textAlign = 'center';
              symbolBox.style.display = 'flex';
              symbolBox.style.flexDirection = 'column';
              symbolBox.style.alignItems = 'center';
              symbolBox.style.justifyContent = 'center';
              symbolBox.style.height = '100%';
            }

            const symbolCircle = poster.querySelector('#symbol-circle') as HTMLElement;
            if (symbolCircle) {
              symbolCircle.style.width = '64px';
              symbolCircle.style.height = '64px';
              symbolCircle.style.borderRadius = '50%';
              symbolCircle.style.backgroundColor = '#facc15';
              symbolCircle.style.color = '#022c22';
              symbolCircle.style.border = '2px solid #ffffff';
              symbolCircle.style.display = 'flex';
              symbolCircle.style.flexDirection = 'column';
              symbolCircle.style.alignItems = 'center';
              symbolCircle.style.justifyContent = 'center';
              symbolCircle.style.fontWeight = 'bold';
              symbolCircle.style.marginBottom = '8px';
            }

            const bottomBanner = poster.querySelector('#poster-bottom') as HTMLElement;
            if (bottomBanner) {
              bottomBanner.style.backgroundColor = '#facc15';
              bottomBanner.style.color = '#022c22';
              bottomBanner.style.border = '2px solid #ffffff';
              bottomBanner.style.padding = '12px';
              bottomBanner.style.borderRadius = '12px';
              bottomBanner.style.textAlign = 'center';
            }

            const allImgs = poster.querySelectorAll('img');
            allImgs.forEach((img) => {
              img.setAttribute('crossOrigin', 'anonymous');
            });
          }
        },
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `political-poster-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download poster image.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Form Section */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
          <h1 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            🇧🇩 Bangladesh Political Poster Maker
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Occasion Type</label>
              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-white"
              >
                <option value="মহান বিজয় দিবস">মহান বিজয় দিবস</option>
                <option value="মহান স্বাধীনতা দিবস">মহান স্বাধীনতা দিবস</option>
                <option value="বিশেষ রাজনৈতিক অনুষ্ঠান">বিশেষ রাজনৈতিক অনুষ্ঠান</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Headline Text (Bangla)</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="যেমন: মহান বিজয় দিবস স্পেশাল"
                className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Requester Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Designation (পদবি)</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="যেমন: সভাপতি / সাধারণ সম্পাদক"
                  className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Party / Organization</label>
                <input
                  type="text"
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  placeholder="রাজনৈতিক দল বা সংগঠন"
                  className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Union / Thana / District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="এলাকা / থানা / জেলা"
                  className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Upload Leader/Personal Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-slate-950 hover:file:bg-yellow-400 cursor-pointer"
              />
              {selectedFile && <p className="text-xs text-emerald-400 mt-1">File selected: {selectedFile.name}</p>}
              {uploadingImage && <p className="text-xs text-yellow-400 mt-1">Uploading image...</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg transition duration-200 border border-yellow-400/40 cursor-pointer"
            >
              {loading ? 'Generating & Saving Poster...' : 'Generate & Save Poster'}
            </button>
          </form>

          {/* Download Button Section */}
          {savedPosterData && (
            <button
              onClick={handleDownload}
              className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition duration-200 border border-yellow-400/40 flex items-center justify-center gap-2 animate-bounce cursor-pointer"
            >
              📥 Download Poster Image
            </button>
          )}
        </div>

        {/* Right Side: Professional Bangladeshi Poster Preview */}
        <div className="sticky top-6">
          <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">Live Poster Preview</h2>
          
          <div 
            id="poster-preview"
            ref={posterRef}
            style={{ backgroundColor: '#064e3b', color: '#ffffff', borderColor: '#facc15' }}
            className="relative w-full p-5 rounded-2xl shadow-2xl border-4 font-sans flex flex-col justify-between"
          >
            
            {/* Header Section */}
            <div 
              id="poster-header"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(250, 204, 21, 0.5)' }} 
              className="text-center py-2.5 px-3 rounded-xl border shadow-md"
            >
              <p style={{ color: '#fde047' }} className="text-xs tracking-widest font-semibold uppercase">বিসমিল্লাহির রাহমানির রাহিম</p>
              <h1 style={{ color: '#facc15' }} className="text-xl md:text-2xl font-black drop-shadow-md mt-0.5">
                {formData.headline || 'আপনার শিরোনাম এখানে দিন'}
              </h1>
              <p style={{ color: '#a7f3d0' }} className="text-xs mt-0.5">অনুষ্ঠান: {formData.occasion || 'বিজয় দিবস'}</p>
            </div>

            {/* Middle Section: Image & Symbol */}
            <div id="poster-middle" className="grid grid-cols-2 gap-3 my-4 items-center">
              
              {/* Leader Photo Box */}
              <div 
                id="leader-box"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderColor: 'rgba(250, 204, 21, 0.7)' }} 
                className="p-2 rounded-xl border-2 flex flex-col items-center justify-center shadow-inner"
              >
                <div 
                  id="leader-img-wrapper"
                  style={{ borderColor: 'rgba(250, 204, 21, 0.4)', backgroundColor: '#000000' }} 
                  className="w-full h-48 relative rounded-lg overflow-hidden border flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    id="leader-img"
                    src={confirmedPhotoUrl || 'https://picsum.photos/300/300'} 
                    alt="Leader Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                    className="w-full h-full object-cover object-top"
                    crossOrigin="anonymous"
                  />
                </div>
                <span style={{ color: '#fde047' }} className="text-[11px] font-bold mt-1">প্রার্থী / শুভানুধ্যায়ী</span>
              </div>

              {/* Election Symbol Box */}
              <div 
                id="symbol-box"
                style={{ backgroundColor: '#450a0a', borderColor: 'rgba(250, 204, 21, 0.7)' }} 
                className="p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center shadow-inner h-full"
              >
                <div 
                  id="symbol-circle"
                  style={{ backgroundColor: '#facc15', color: '#022c22', borderColor: '#ffffff' }} 
                  className="w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold shadow-lg border-2 mb-2"
                >
                  <span style={{ color: '#b91c1c' }} className="text-[9px] uppercase tracking-tighter font-extrabold">নির্বাচনী</span>
                  <span className="text-base leading-tight">প্রতীক</span>
                </div>
                <h3 style={{ color: '#fde047' }} className="text-xs font-bold">ভোট দিন ও জয়যুক্ত করুন</h3>
                <p style={{ color: '#e2e8f0' }} className="text-[11px] mt-0.5 font-medium">{formData.district || 'এলাকা / থানা / জেলা'}</p>
              </div>

            </div>

            {/* Bottom Banner */}
            <div 
              id="poster-bottom"
              style={{ backgroundColor: '#facc15', color: '#022c22', borderColor: '#ffffff' }} 
              className="p-3 rounded-xl text-center shadow-lg border-2"
            >
              <h2 style={{ color: '#022c22' }} className="text-lg md:text-xl font-black tracking-wide">
                {formData.name || 'আপনার নাম লিখুন'}
              </h2>
              <p style={{ color: '#022c22' }} className="text-xs md:text-sm font-extrabold mt-0.5">
                {formData.designation || 'পদবি লিখুন'}
              </p>
              <div 
                style={{ borderTopColor: 'rgba(2, 44, 34, 0.2)', color: '#022c22' }} 
                className="mt-1 pt-1 border-t text-[11px] font-bold"
              >
                প্রচারে: {formData.party || 'রাজনৈতিক দল বা সংগঠন'}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
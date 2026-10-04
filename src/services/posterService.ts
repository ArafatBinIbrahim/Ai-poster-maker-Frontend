import API from './api';

export const getTemplates = async (occasion?: string) => {
  const url = occasion ? `/templates?occasion=${encodeURIComponent(occasion)}` : '/templates';
  const response = await API.get(url);
  return response.data;
};

export const uploadPhotos = async (formData: FormData) => {
  const response = await API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // Expected: { urls: [...] }
};

export const createPoster = async (posterData: Record<string, unknown>) => {
  const response = await API.post('/posters', posterData); // ব্যাকএন্ড রাউট `/api/posters` এর সাথে মিল থাকতে হবে
  return response.data;
};

export const getPosterById = async (id: string) => {
  const response = await API.get(`/posters/${id}`);
  return response.data;
};

export const getUserPosters = async (userId: string) => {
  const response = await API.get(`/posters/user/${userId}`);
  return response.data;
};

export const regeneratePoster = async (id: string) => {
  const response = await API.post(`/posters/${id}/regenerate`);
  return response.data;
};
import API from './api';

export const registerUser = async (userData: { name: string; emailOrPhone: string; passwordHash: string }) => {
  const response = await API.post('/auth/register', {
    ...userData,
    password: userData.passwordHash // ব্যাকএন্ডের সুবিধার জন্য password প্রপার্টিও যুক্ত করা হলো
  });
  return response.data;
};

export const loginUser = async (credentials: { emailOrPhone: string; passwordHash: string }) => {
  const response = await API.post('/auth/login', {
    emailOrPhone: credentials.emailOrPhone,
    password: credentials.passwordHash, // ব্যাকএন্ডে 'password' হিসেবে পাসওয়ার্ড পাঠানো হচ্ছে
    passwordHash: credentials.passwordHash
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};
// history/page.tsx এর ভেতর যেখানে ফেচ করা হচ্ছে:
export const fetchHistory = async (setPosters: (posters: unknown[]) => void) => {
  try {
    const userString = localStorage.getItem('user'); // অথবা তোমার টোকেন ডিকোড করার লজিক
    if (!userString) return;
    const user = JSON.parse(userString);
    const userId = user?._id || user?.id;

    if (!userId || userId === 'current-user-id') {
      console.error("Valid User ID not found");
      return;
    }

    const response = await fetch(`/api/posters/user/${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error(`Failed to fetch posters: ${response.status}`);
    const data = await response.json();
    setPosters(data.data);
  } catch (error) {
    console.error("Error fetching history:", error);
  }
};
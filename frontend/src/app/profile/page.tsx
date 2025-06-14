// src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSidebar from '@/components/ProfileSidebar';
import EditProfile from '@/components/EditProfile';

interface UserProfile {
  id: number;
  email: string;
  role: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  phone_number?: string;
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
          setError('Token tidak ditemukan. Silakan login ulang.');
          setLoading(false);
          router.push('/');
          return;
        }

        const response = await fetch('http://localhost:8080/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.redirect) {
            router.push(errorData.redirect);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data profil');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);  if (loading) {
    return (
      <div className="px-[10vw] py-8">
        <div className="flex justify-center items-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-[10vw] py-8">
        <div className="flex justify-center items-center">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    // <>
    //   {/* <h2 className="text-2xl font-semibold mb-4">Profile Page</h2>
    //   <p>This is the Profile page content.</p> */}
    // </>
    <div className="px-[10vw]">      
      <ol className="flex items-center px-4 space-x-2 text-sm py-4 text-gray-600">
        <li className="text-gray-900 font-medium">Welcome! </li>
        <li className="text-red-500 font-medium">{userProfile?.name || userProfile?.email || 'User'}</li>
      </ol>      <div className="flex">     
        <ProfileSidebar />
        <EditProfile userProfile={userProfile} />
      </div>
    </div>
  );
}

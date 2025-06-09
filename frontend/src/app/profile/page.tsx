// src/app/page.tsx
import Link from 'next/link';
import ProfileSidebar from '@/components/ProfileSidebar';
import EditProfile from '@/components/EditProfile';

const username = 'Md Rimel';
export default function Profile() {
  return (
    // <>
    //   {/* <h2 className="text-2xl font-semibold mb-4">Profile Page</h2>
    //   <p>This is the Profile page content.</p> */}
    // </>
    <div className="px-[10vw]">      
      <ol className="flex items-center px-4 space-x-2 text-sm py-4 text-gray-600">
        <li className="text-gray-900 font-medium">Welcome! </li>
        <li className="text-red-500 font-medium">{username}</li>
      </ol>  
      <div className="flex">     
        <ProfileSidebar />
        <EditProfile />
      </div>
    </div>
  );
}

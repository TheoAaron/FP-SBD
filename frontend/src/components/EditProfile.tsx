import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

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

interface EditProfileProps {
  userProfile: UserProfile | null;
}

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone_number: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
}

export default function EditProfile({ userProfile }: EditProfileProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: userProfile?.first_name || '',
    last_name: userProfile?.last_name || '',
    email: userProfile?.email || '',
    address: userProfile?.address || '',
    phone_number: userProfile?.phone_number || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Simpan data original untuk perbandingan
  const [originalData] = useState({
    first_name: userProfile?.first_name || '',
    last_name: userProfile?.last_name || '',
    email: userProfile?.email || '',
    address: userProfile?.address || '',
    phone_number: userProfile?.phone_number || ''
  });

  const [loading, setLoading] = useState(false);

  // Fungsi untuk mengecek apakah ada perubahan data
  const hasDataChanged = () => {
    const profileDataChanged = 
      formData.first_name !== originalData.first_name ||
      formData.last_name !== originalData.last_name ||
      formData.email !== originalData.email ||
      formData.address !== originalData.address ||
      formData.phone_number !== originalData.phone_number;    const passwordDataChanged = 
      (formData.current_password && formData.current_password.length > 0) || 
      (formData.new_password && formData.new_password.length > 0);

    return profileDataChanged || passwordDataChanged;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Form submitted!'); // Debug log    // Cek apakah ada perubahan data
    if (!hasDataChanged()) {
      toast('Tidak ada perubahan data untuk disimpan', {
        icon: '💡',
        duration: 3000
      });
      setLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('jwtToken');
      
      if (!token) {
        console.log('No token found'); // Debug log
        toast.error('Token tidak ditemukan. Silakan login ulang.');
        return;      }      // Prepare data to send (exclude empty password fields)
      const dataToSend: ProfileFormData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        address: formData.address,
        phone_number: formData.phone_number
      };

      // Only include password if user wants to change it
      if(formData.new_password || formData.current_password || formData.confirm_password){
      if (formData.new_password && formData.current_password && formData.confirm_password) {
        if (formData.new_password !== formData.confirm_password) {
          toast.error('Password konfirmasi tidak cocok');
          return;
        }
        dataToSend.current_password = formData.current_password;
        dataToSend.new_password = formData.new_password;
      }else{
        toast.error('Fill all Form');
        return;
      }
      }

      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });      const result = await response.json();
      console.log('Response:', response.status, result); // Debug log

      if (response.ok) {
        console.log('Success! Showing toast...'); // Debug log
        toast.success('Profile berhasil diupdate!');
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
      } else {
        console.log('Error response, showing error toast...'); // Debug log
        toast.error(result.message || 'Gagal mengupdate profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      console.log('Showing error toast...'); // Debug log
      toast.error('Terjadi kesalahan saat mengupdate profile');
    } finally {
      setLoading(false);
    }  };

  return (
    <div className="flex-1 py-3 px-6">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold text-red-500 mb-6">Edit Your Profile</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input 
              type="text" 
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded" 
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input 
              type="text" 
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded" 
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded" 
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input 
              type="tel" 
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full p-2 border rounded" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Password Changes (Optional)</label>
          <input 
            type="password" 
            name="current_password"
            value={formData.current_password}
            onChange={handleInputChange}
            placeholder="Current Password" 
            className="w-full p-2 border rounded" 
          />
          <input 
            type="password" 
            name="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            placeholder="New Password" 
            className="w-full p-2 border rounded" 
          />
          <input 
            type="password" 
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            placeholder="Confirm New Password" 
            className="w-full p-2 border rounded" 
          />
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button 
            type="button" 
            className="px-4 py-2 border rounded hover:bg-gray-50"
            onClick={() => {
              setFormData({
                first_name: userProfile?.first_name || '',
                last_name: userProfile?.last_name || '',
                email: userProfile?.email || '',
                address: userProfile?.address || '',
                phone_number: userProfile?.phone_number || '',
                current_password: '',
                new_password: '',
                confirm_password: ''
              });
            }}
          >
            Cancel
          </button>          <button 
            type="submit" 
            disabled={loading || !hasDataChanged()}
            className={`px-6 py-2 rounded transition-colors ${
              loading || !hasDataChanged() 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

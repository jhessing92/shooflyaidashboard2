import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import toast from 'react-hot-toast';

const ProfilePictureUpload = () => {
  const [profilePicture, setProfilePicture] = useLocalStorage<string>('user_profile_picture', '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
        toast.success('Profile picture updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setProfilePicture('');
    toast.success('Profile picture removed');
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-2xl font-bold">U</span>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex flex-col space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Upload New Picture
        </button>
        {profilePicture && (
          <button
            onClick={handleRemove}
            className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 mr-2" />
            Remove Picture
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
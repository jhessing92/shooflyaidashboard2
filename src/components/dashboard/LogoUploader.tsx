import React, { useState, useRef } from 'react';
import { Upload, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

interface LogoUploaderProps {
  currentLogo?: string;
  onLogoChange: (logo: string) => void;
}

const LogoUploader = ({ currentLogo, onLogoChange }: LogoUploaderProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
        onLogoChange(result);
        toast.success('Logo updated successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {currentLogo ? (
        <img
          src={currentLogo}
          alt="Dashboard Logo"
          className="w-10 h-10 rounded-lg object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-[#353535] flex items-center justify-center">
          <span className="text-white text-xl font-bold">A</span>
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        className={`absolute inset-0 flex items-center justify-center rounded-lg transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } bg-black/50 hover:bg-black/70`}
      >
        {currentLogo ? (
          <Pencil className="w-4 h-4 text-white" />
        ) : (
          <Upload className="w-4 h-4 text-white" />
        )}
      </button>
    </div>
  );
};

export default LogoUploader;
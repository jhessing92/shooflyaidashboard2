import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
}

const EditableText = ({ value, onSave, className = '' }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setText(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`bg-[#2d2d2d] text-white px-2 py-1 rounded-lg mr-2 ${className}`}
        />
        <button
          onClick={handleSave}
          className="p-1 hover:bg-green-600/20 text-green-500 rounded-lg"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setText(value);
            setIsEditing(false);
          }}
          className="p-1 hover:bg-red-600/20 text-red-500 rounded-lg ml-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:opacity-80"
    >
      <span className={className}>{value}</span>
    </div>
  );
};

export default EditableText;
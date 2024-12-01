import React, { useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { Send } from 'lucide-react';

const MindForm = () => {
  const [thought, setThought] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fire, setFire] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('https://hook.us1.make.com/jq1u9p6sc65bq4hxbc0g4md0lnkxnsd1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thought }),
      });
      
      const data = await res.json();
      setResponse(data.message || 'Thank you for sharing your thoughts!');
      setFire(true);
      setThought('');
      
      // Reset confetti after animation
      setTimeout(() => setFire(false), 2000);
    } catch (error) {
      setResponse('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="p-1 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
        <form onSubmit={handleSubmit} className="bg-[#171717] rounded-lg p-6">
          <label htmlFor="thought" className="block text-lg font-medium text-gray-200 mb-4">
            What's on your mind today?
          </label>
          <div className="relative">
            <textarea
              id="thought"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              className="w-full px-4 py-3 bg-[#1e1e1e] text-gray-200 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Share your thoughts..."
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute bottom-3 right-3 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#171717] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {response && (
        <div className="mt-4 p-4 bg-[#171717] rounded-lg text-gray-200 animate-fade-in">
          {response}
        </div>
      )}

      <ReactCanvasConfetti
        fire={fire}
        colors={['#ff718d', '#a855f7', '#6366f1']}
        particleCount={100}
        spread={70}
        origin={{ y: 0.8 }}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default MindForm;
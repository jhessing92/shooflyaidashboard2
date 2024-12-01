import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import HelpArticles from '../components/HelpArticles';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Bot className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {isLogin ? 'Sign in to your AI automation dashboard' : 'Start your automation journey'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#171717] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            {isLogin ? <LoginForm /> : <SignupForm />}
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#171717] text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-[#171717] text-sm font-medium text-gray-200 hover:bg-[#202020]">
                    <img 
                      className="h-5 w-5" 
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                    />
                  </button>
                </div>
                <div>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-lg shadow-sm bg-[#171717] text-sm font-medium text-gray-200 hover:bg-[#202020]">
                    <img
                      className="h-5 w-5"
                      src="https://www.svgrepo.com/show/475647/github-color.svg"
                      alt="GitHub"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  {isLogin ? 'Sign up for free' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <HelpArticles />
    </div>
  );
};

export default AuthPage;
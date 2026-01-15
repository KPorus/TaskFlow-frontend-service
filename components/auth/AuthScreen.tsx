import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { Layout, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { loginUser, registerUser } from '@/store/slices/helper/authThunks';

export const AuthScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await dispatch(loginUser({ email, password }));
    } else {
      await dispatch(registerUser({ name, email, password }));
    }
  };

  return (
    <div id="auth-screen--ts" className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-10 text-center bg-indigo-600 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-40 h-40 rounded-full bg-white"></div>
             <div className="absolute bottom-[-20%] right-[-5%] w-60 h-60 rounded-full bg-white"></div>
           </div>
           
           <div className="relative z-10">
             <div id="Logo" className="mx-auto bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 backdrop-blur-md border border-white/30 shadow-lg">
               <Layout size={28} />
             </div>
             <h1 className="text-3xl font-bold text-white tracking-tight">TaskFlow</h1>
             <p className="text-indigo-100 mt-2 font-medium">Collaborate in real-time.</p>
           </div>
        </div>
        
        <div className="p-10">
           <form onSubmit={handleSubmit} className="space-y-6">
             {!isLogin && (
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                     <User size={18} />
                   </div>
                   <input 
                     type="text" 
                     required
                     value={name}
                     onChange={e => setName(e.target.value)}
                     className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                     placeholder="John Doe"
                   />
                 </div>
               </div>
             )}
             
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                   <Mail size={18} />
                 </div>
                 <input 
                   type="email" 
                   required
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                   placeholder="karima.akter@example.com"
                 />
               </div>
               {isLogin && (
                 <p className="text-[10px] text-gray-400 mt-1 ml-1">
                   Hint: karima.akter@example.com
                 </p>
               )}
             </div>

             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                   <Lock size={18} />
                 </div>
                 <input 
                   type={showPassword ? "text" : "password"}
                   required
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full pl-11 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                   placeholder="••••••••"
                 />
                 {/* <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button> */}
               </div>
             </div>

             {error && (
               <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100 flex items-start gap-2">
                 <div className="mt-0.5">⚠️</div>
                 <span>{error}</span>
               </div>
             )}

             <button 
               type="submit" 
               disabled={loading}
               className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[0px]"
             >
               {loading ? (
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Processing...</span>
                 </div>
               ) : (
                 <>
                   {isLogin ? 'Sign In' : 'Create Account'}
                   <ArrowRight size={18} />
                 </>
               )}
             </button>
           </form>
           
           <div className="mt-8 text-center text-sm border-t border-gray-100 pt-6">
             <span className="text-gray-500 font-medium">
               {isLogin ? "Don't have an account?" : "Already have an account?"}
             </span>
             <button 
               onClick={() => setIsLogin(!isLogin)}
               className="ml-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors underline-offset-4 hover:underline"
             >
               {isLogin ? 'Sign up' : 'Sign in'}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
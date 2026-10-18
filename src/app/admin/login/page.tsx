'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        // Redirect to admin dashboard on success
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setLoginError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[hsl(222,47%,5%)] text-white flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-md glass-card p-8 border border-[hsl(217,91%,54%)]/30 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(217,91%,54%)]/10 rounded-full blur-3xl" />
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[hsl(217,91%,54%)] to-[hsl(270,91%,65%)] flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-lg shadow-[hsl(217,91%,54%)]/30">
            M
          </div>
          <h1 className="text-3xl font-black text-white mb-2">EducationHom Admin</h1>
          <p className="text-xs text-[hsl(215,20%,60%)]">Control Panel & Content Management System</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com" 
              className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] text-sm transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[hsl(215,20%,60%)] uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password" 
              className="w-full px-4 py-3 bg-[hsl(222,47%,9%)] border border-[hsl(215,25%,22%)] rounded-xl text-white placeholder-[hsl(215,20%,40%)] focus:outline-none focus:border-[hsl(217,91%,54%)] text-sm transition-all"
              required
            />
          </div>

          {loginError && (
            <p className="text-xs text-red-400 font-medium text-center">{loginError}</p>
          )}

          <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 justify-center text-sm font-bold shadow-lg shadow-[hsl(217,91%,54%)]/20 disabled:opacity-50">
            {isLoading ? 'Authenticating...' : 'Access Admin Panel →'}
          </button>
        </form>
      </div>
    </main>
  );
}

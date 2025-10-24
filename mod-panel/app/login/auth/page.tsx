'use client'; // Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// HINWEIS: Dies ist der fest hinterlegte Admin-Name.
// ÄNDERE DIESEN ZU DEINEM GEWÜNSCHTEN SCHLÜSSEL!
const ADMIN_KEY = "Joel Z."; 

export default function AuthLoginPage() {
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
    
  // Weiterleitung, falls der User bereits eingeloggt ist
  useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('nordstadt-rp-auth') === 'true') {
        router.push('/');
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Überprüfung des Namens
    if (inputName.trim() === ADMIN_KEY) {
      
      // Speichere den Login-Status
      if (typeof window !== 'undefined') {
        localStorage.setItem('nordstadt-rp-auth', 'true');
      }
      
      // Weiterleitung zum Haupt-Panel
      router.push('/'); 
    } else {
      setError('Fehler: Ungültiger Name. Bitte die Schreibweise prüfen.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl">
        
        <h1 className="text-3xl font-extrabold text-blue-400 mb-6 text-center">
          Nordstadt-RP Admin Login
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Bitte gib deinen Admin-Namen zur Authentifizierung ein.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Dein Admin Name (z.B. Joel Z.)"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full p-3 border-2 border-gray-700 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400 mb-4"
          />
          
          {error && (
            <p className="text-red-400 text-center mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
          >
            Einloggen
          </button>
        </form>
        
      </div>
    </div>
  );
}
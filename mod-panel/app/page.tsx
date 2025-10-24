'use client'; // <-- MUSS HIER STEHEN!

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// WICHTIG: Korrekter Import der ausgelagerten Komponente
import { ModPanelPageContent } from './ModPanelContent'; 

export default function ModPanelGuard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Prüft, ob der Schlüssel im Browser gespeichert ist
        const auth = localStorage.getItem('nordstadt-rp-auth');
        
        if (auth === 'true') {
            // Benutzer ist eingeloggt
            setIsAuthenticated(true);
        } else {
            // Wenn nicht eingeloggt, leite zur Login-Seite um
            router.push('/login'); 
        }
    }, [router]);

    // Zeige das Panel nur an, wenn der Login erfolgreich war
    if (isAuthenticated) {
        return <ModPanelPageContent />;
    }

    // Zeige einen Ladezustand an, während die Prüfung läuft
    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <p className="text-xl">Prüfe Status...</p>
        </div>
    );
}
'use client'; 

import React, { useState } from 'react';

// Dies ist die ausgelagerte Komponente für das Design und die Funktionen des Mod-Panels
export default function ModPanelPageContent() {
    // State für die Suche
    const [searchTerm, setSearchTerm] = useState('');
    
    // Funktion für das Logout
    const handleLogout = () => {
        // Entfernt den Auth-Schlüssel und lädt die Seite neu, was zur Login-Seite führt
        localStorage.removeItem('nordstadt-rp-auth'); 
        window.location.reload(); 
    };
    
    // Funktion, die später die Suche startet (Hier kommt die Roblox API-Logik rein)
    const handleSearch = () => {
        // Wir verwenden temporär console.log, bis die API eingebaut ist
        if (searchTerm.trim() === '') {
            alert("Bitte gib einen Roblox Namen oder eine User ID ein.");
            return;
        }
        console.log("Suche gestartet für:", searchTerm);
        // Später: fetch('/api/roblox-search', { method: 'POST', body: JSON.stringify({ term: searchTerm }) });
    };

    // Helferfunktion für die Aktionen (Warn, Kick, Bann)
    const performAction = (action: string) => {
        if (searchTerm.trim() === '') {
             alert(`Wähle zuerst einen Spieler durch Suchen aus, um die Aktion "${action}" durchzuführen.`);
             return;
        }
        // HINWEIS: alert() wird später durch eine Modal-Anzeige ersetzt, 
        // und die Aktion wird an dein Roblox-Spiel gesendet.
        alert(`Aktion ${action} für Spieler "${searchTerm}" erfolgreich protokolliert.`);
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
            <header className="w-full max-w-6xl mb-12">
                <h1 className="text-4xl font-extrabold text-blue-400 border-b-2 border-gray-700 pb-2">
                    NORDSTADT-RP MOD PANEL
                </h1>
                <p className="text-gray-500 mt-2">
                    Willkommen, **Joel Z.** | 
                    <span className="cursor-pointer text-red-400 hover:text-red-500 ml-2" onClick={handleLogout}>
                        Logout
                    </span>
                </p>
            </header>

            <main className="w-full max-w-6xl bg-gray-800 p-8 rounded-xl shadow-2xl">
                {/* Oben: Suchbereich */}
                <h2 className="text-2xl font-semibold mb-6 text-gray-200">Spieler-Suche & Aktionen</h2>
                <div className="flex space-x-4 mb-10">
                    <input
                        type="text"
                        placeholder="Roblox Name oder User ID eingeben..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        className="flex-grow p-3 border-2 border-blue-500 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md"
                    >
                        Spieler finden
                    </button>
                </div>
                
                {/* Unten: Die Aktions-Buttons (Warn, Kick, Bann) */}
                <div className="grid grid-cols-5 gap-4 mt-8 pt-4 border-t border-gray-700">
                    <ActionButton label="Mündlicher Warn" bgColor="bg-yellow-600" onClick={() => performAction('Mündlicher Warn')} />
                    <ActionButton label="Warn" bgColor="bg-orange-600" onClick={() => performAction('Warn')} />
                    <ActionButton label="Kick" bgColor="bg-red-500" onClick={() => performAction('Kick')} />
                    <ActionButton label="1 Tages Bann" bgColor="bg-red-700" onClick={() => performAction('1 Tages Bann')} />
                    <ActionButton label="Bann" bgColor="bg-red-900" onClick={() => performAction('Permanenter Bann')} />
                </div>
                
            </main>
        </div>
    );
}

// Kleine Helfer-Komponente für die Buttons
function ActionButton({ label, bgColor, onClick }: { label: string; bgColor: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full ${bgColor} hover:opacity-90 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg text-sm`}
        >
            {label}
        </button>
    );
}

// Wichtig: Die Komponente muss exportiert werden, damit page.tsx sie importieren kann
export { ModPanelPageContent };
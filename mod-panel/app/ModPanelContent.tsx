'use client'; 

import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash'; // Wir brauchen 'lodash' für eine saubere Debounce-Funktion

// INSTALLATION HINWEIS: Du musst 'lodash' installieren, damit die Debounce-Funktion funktioniert:
// Füge im Terminal im Ordner 'mod-panel' diesen Befehl ein und starte den Server neu:
// npm install lodash @types/lodash

// TypeScript-Typdefinitionen
interface PlayerData {
    userId: number;
    username: string;
    imageUrl: string;
}

// ----------------------------------------------------------------------
// Hauptkomponente des Mod-Panels
// ----------------------------------------------------------------------
export default function ModPanelPageContent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]); // Neuer State für Vorschläge
    
    // Funktion für das Logout
    const handleLogout = () => {
        localStorage.removeItem('nordstadt-rp-auth'); 
        window.location.reload(); 
    };

    // Funktion, die die Suggest-API aufruft
    const fetchSuggestions = useCallback(
        debounce(async (query: string) => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await fetch(`/api/roblox-suggest?query=${encodeURIComponent(query)}`);
                const result = await response.json();

                if (response.ok && result.suggestions) {
                    setSuggestions(result.suggestions);
                } else {
                    setSuggestions([]);
                }
            } catch (err) {
                console.error("Fehler beim Abrufen der Vorschläge:", err);
                setSuggestions([]);
            }
        }, 300), // Wartet 300ms nach der letzten Eingabe
        []
    );
    
    // Handler für die Eingabe im Suchfeld
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchTerm(query);
        fetchSuggestions(query); // Ruft die Suggest-Funktion auf
    };
    
    // Funktion zum Übernehmen eines Vorschlags
    const selectSuggestion = (name: string) => {
        setSearchTerm(name);
        setSuggestions([]); // Versteckt die Vorschläge
        handleSearch(name); // Startet sofort die Hauptsuche mit dem Namen
    };

    // Funktion zur Durchführung der Spielersuche (aus dem letzten Schritt)
    const handleSearch = async (termToSearch = searchTerm) => {
        if (termToSearch.trim() === '') {
            setError("Bitte gib einen Roblox Namen oder eine User ID ein.");
            setPlayerData(null);
            return;
        }

        setLoading(true);
        setError('');
        setPlayerData(null);
        setSuggestions([]); 

        try {
            const response = await fetch('/api/roblox-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchTerm: termToSearch.trim() }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setError(result.error || 'Spieler konnte nicht gefunden werden.');
                return;
            }

            setPlayerData({
                userId: result.userId,
                username: result.username,
                imageUrl: result.imageUrl,
            });

        } catch (err) {
            setError('Netzwerk- oder Serverfehler beim Suchen.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // Helferfunktion für die Aktionen (Warn, Kick, Bann)
    const performAction = (action: string) => {
        if (!playerData) {
             alert(`Wähle zuerst einen Spieler durch Suchen aus, um die Aktion "${action}" durchzuführen.`);
             return;
        }
        
        alert(`Aktion "${action}" für Spieler "${playerData.username}" (ID: ${playerData.userId}) protokolliert.`);
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
                {/* 1. Suchbereich */}
                <h2 className="text-2xl font-semibold mb-6 text-gray-200">Spieler-Suche</h2>
                <div className="relative mb-10"> {/* Relativer Container für die Vorschläge */}
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Roblox Name (mind. 3 Zeichen) oder User ID eingeben..."
                            value={searchTerm}
                            onChange={handleInputChange} // Neuer Handler für Eingabe
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                            className="flex-grow p-3 border-2 border-blue-500 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
                        />
                        <button
                            onClick={() => handleSearch()}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md disabled:bg-gray-500"
                        >
                            {loading ? 'Suchen...' : 'Spieler finden'}
                        </button>
                    </div>

                    {/* Vorschläge-Dropdown */}
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-[calc(100%-100px)] mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {suggestions.map((name) => (
                                <li 
                                    key={name} 
                                    onClick={() => selectSuggestion(name)}
                                    className="p-3 cursor-pointer hover:bg-gray-600 border-b border-gray-600 last:border-b-0 text-white"
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                {/* 2. Ergebnisse und Fehlermeldungen */}
                {loading && <p className="text-blue-400 text-center py-4">Lade Spielerdaten von Roblox...</p>}
                {error && <p className="text-red-400 text-center py-4 font-semibold">{error}</p>}

                {playerData && (
                    <div className="mt-8 p-6 bg-gray-700 rounded-lg flex items-center space-x-6 shadow-xl">
                        <img 
                            src={playerData.imageUrl} 
                            alt={`Avatar von ${playerData.username}`} 
                            className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover"
                        />
                        <div>
                            <p className="text-sm font-light text-gray-400">Gefundener Spieler</p>
                            <h3 className="text-3xl font-bold text-white mb-1">{playerData.username}</h3>
                            <p className="text-lg font-mono text-gray-300">ID: {playerData.userId}</p>
                        </div>
                    </div>
                )}


                {/* 3. Aktions-Buttons (Nur anzeigen, wenn Spieler gefunden) */}
                {playerData && (
                    <>
                        <h2 className="text-2xl font-semibold mb-6 mt-10 pt-6 border-t border-gray-700 text-gray-200">Aktionen</h2>
                        <div className="grid grid-cols-5 gap-4">
                            <ActionButton label="Mündlicher Warn" bgColor="bg-yellow-600" onClick={() => performAction('Mündlicher Warn')} />
                            <ActionButton label="Warn" bgColor="bg-orange-600" onClick={() => performAction('Warn')} />
                            <ActionButton label="Kick" bgColor="bg-red-500" onClick={() => performAction('Kick')} />
                            <ActionButton label="1 Tages Bann" bgColor="bg-red-700" onClick={() => performAction('1 Tages Bann')} />
                            <ActionButton label="Bann (Permanent)" bgColor="bg-red-900" onClick={() => performAction('Permanenter Bann')} />
                        </div>
                    </>
                )}
                
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

export { ModPanelPageContent };
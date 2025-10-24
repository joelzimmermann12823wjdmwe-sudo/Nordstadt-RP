import React from 'react';

// Dies ist die Hauptkomponente deines Mod-Panels
export default function ModPanelPage() {
  return (
    // Der Container gibt der Seite den dunklen Look und zentriert den Inhalt
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      
      {/* HEADER des Mod-Panels */}
      <header className="w-full max-w-4xl mb-12">
        <h1 className="text-4xl font-extrabold text-blue-400 border-b-2 border-gray-700 pb-2">
          NORDSTADT-RP MOD PANEL
        </h1>
        <p className="text-gray-500 mt-2">Spieler-Suche und Verwaltungs-Tools</p>
      </header>

      {/* HAUPTINHALT: Suchbereich */}
      <main className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-200">Spieler-Suche (Roblox Name / ID)</h2>
        
        {/* Suchfeld */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Roblox Name oder User ID eingeben..."
            className="flex-grow p-3 border-2 border-blue-500 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-400"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md"
          >
            Suchen
          </button>
        </div>

        {/* Hier werden später die Suchergebnisse angezeigt */}
        <div className="mt-8">
          <p className="text-gray-400 text-center">
            Hier erscheint das Profilbild und die Daten des Spielers nach der Suche.
          </p>
        </div>
        
      </main>
      
    </div>
  );
}
import { NextResponse } from 'next/server';

/**
 * API Route für die Auto-Vervollständigung von Roblox-Benutzernamen.
 * Nutzt den offiziellen Roblox-Endpunkt für Vorschläge.
 * * URL: /api/roblox-suggest?query=
 */
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const query = url.searchParams.get('query');

        if (!query || query.length < 3) {
            // Wir liefern keine Vorschläge, wenn das Suchwort zu kurz ist (schont die API).
            return NextResponse.json({ suggestions: [] });
        }
        
        // Offizieller Roblox Endpunkt für die Namens-Vervollständigung
        const robloxSuggestUrl = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(query)}&limit=10`;

        const response = await fetch(robloxSuggestUrl, {
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error('Roblox Suggest API Error:', response.status);
            return NextResponse.json({ error: 'Fehler beim Abrufen der Vorschläge von Roblox.' }, { status: 500 });
        }

        const data = await response.json();
        
        // Extrahieren nur der Benutzernamen
        const suggestions = data.data 
            ? data.data.map((user: { name: string }) => user.name) 
            : [];

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.error('Suggest API Error:', error);
        return NextResponse.json({ error: 'Interner Serverfehler.' }, { status: 500 });
    }
}
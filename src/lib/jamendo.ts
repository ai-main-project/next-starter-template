
export interface JamendoTrack {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  playlist_id: string;
  album_id: string;
  license_ccurl: string;
  position: number;
  releasedate: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  prourl: string;
  shorturl: string;
  shareurl: string;
  image: string; // album_image alias mostly
}

const JAMENDO_CLIENT_ID = 'f4481718'; // Provided by user

export async function getTracks(limit: number = 20): Promise<JamendoTrack[]> {
  // https://developer.jamendo.com/v3.0/tracks
  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=jsonpretty&limit=${limit}&include=musicinfo&groupby=artist_id`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch tracks: ${res.statusText}`);
    }
    const data = await res.json() as { results: JamendoTrack[] };
    return data.results;
  } catch (error) {
    console.error("Jamendo API Error:", error);
    return [];
  }
}

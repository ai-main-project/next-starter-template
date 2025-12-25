
const JAMENDO_CLIENT_ID = 'f4481718';

async function testJamendo() {
  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=jsonpretty&limit=1&include=musicinfo&groupby=artist_id`;
  console.log("Fetching:", url);
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
        console.error("Error:", res.status, res.statusText);
        return;
    }
    const data = await res.json();
    if (data.results && data.results.length > 0) {
        const track = data.results[0];
        console.log("First track:", track.name);
        console.log("Audio URL:", track.audio);
    } else {
        console.log("No results found.");
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testJamendo();

import axios from 'axios';

export async function GET() {
  try {
    const url = 'https://www.cricbuzz.com/live-cricket-scores/151891/dc-vs-pbks-35th-match-indian-premier-league-2026';
    const response = await axios.get(url);
    const html = response.data;

    // Extract score using regex (searching for DC 213/1 (16))
    const scoreMatch = html.match(/DC\s\d+\/\d+\s\(\d+\)/);
    const score = scoreMatch ? scoreMatch[0] : 'Score Unavailable';

    return Response.json({ score });
  } catch (error) {
    console.error('Fetch Score Error:', error);
    return Response.json({ score: 'Error fetching score' }, { status: 500 });
  }
}

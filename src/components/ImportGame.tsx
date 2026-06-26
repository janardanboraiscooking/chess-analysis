'use client';
import { useState } from 'react';

interface Game {
  id: string;
  pgn: string;
  white: string;
  black: string;
  whiteElo: number;
  blackElo: number;
  result: string;
  date: string;
  timeControl: string;
}

interface ImportGameProps {
  onGameSelect: (pgn: string) => void;
}

export default function ImportGame({ onGameSelect }: ImportGameProps) {
  const [platform, setPlatform] = useState<'lichess' | 'chesscom'>('lichess');
  const [username, setUsername] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGames = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setGames([]);

    try {
      if (platform === 'lichess') {
        const res = await fetch(`https://lichess.org/api/games/user/${username.trim()}?max=20&pgnInJson=true`, {
          headers: { 'Accept': 'application/x-ndjson' }
        });
        if (!res.ok) throw new Error('User not found');
        const text = await res.text();
        const lines = text.trim().split('\n').filter(Boolean);
        const parsed: Game[] = lines.map(line => {
          const data = JSON.parse(line);
          return {
            id: data.id,
            pgn: data.pgn || '',
            white: data.players?.white?.user?.name || 'White',
            black: data.players?.black?.user?.name || 'Black',
            whiteElo: data.players?.white?.rating || 0,
            blackElo: data.players?.black?.rating || 0,
            result: data.winner === 'white' ? '1-0' : data.winner === 'black' ? '0-1' : '1/2-1/2',
            date: new Date(data.createdAt).toLocaleDateString(),
            timeControl: data.clock ? `${data.clock.initial/60}+${data.clock.increment}` : '',
          };
        });
        setGames(parsed);
      } else {
        // Chess.com
        const archivesRes = await fetch(`https://api.chess.com/pub/player/${username.trim().toLowerCase()}/games/archives`);
        if (!archivesRes.ok) throw new Error('User not found');
        const archives = await archivesRes.json();
        const latestArchive = archives.archives?.[archives.archives.length - 1];
        if (!latestArchive) throw new Error('No games found');
        const gamesRes = await fetch(`${latestArchive}/pgn`);
        const pgnText = await gamesRes.text();
        // Parse chess.com PGN (multiple games separated by blank lines)
        const gamePgnBlocks = pgnText.split(/\n\n\n/).filter(b => b.trim().length > 50);
        const parsed: Game[] = gamePgnBlocks.slice(0, 20).map((block, i) => {
          const whiteMatch = block.match(/\[White\s+"([^"]*)"\]/);
          const blackMatch = block.match(/\[Black\s+"([^"]*)"\]/);
          const resultMatch = block.match(/\[Result\s+"([^"]*)"\]/);
          const dateMatch = block.match(/\[Date\s+"([^"]*)"\]/);
          const tcMatch = block.match(/\[TimeControl\s+"([^"]*)"\]/);
          return {
            id: `chesscom-${i}`,
            pgn: block.trim(),
            white: whiteMatch?.[1] || 'White',
            black: blackMatch?.[1] || 'Black',
            whiteElo: 0,
            blackElo: 0,
            result: resultMatch?.[1] || '*',
            date: dateMatch?.[1] || '',
            timeControl: tcMatch?.[1] || '',
          };
        });
        setGames(parsed);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch games');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-2 md:px-0">
      <div className="surface p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)', fontFamily: 'Inter' }}>Import Game</h3>

        <div className="flex gap-2 mb-4">
          {(['lichess', 'chesscom'] as const).map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: platform === p ? 'var(--gradient-gold)' : 'var(--bg-subtle)',
                color: platform === p ? '#09090b' : 'var(--text-secondary)',
                border: `1px solid ${platform === p ? 'transparent' : 'var(--border)'}`,
              }}>
              {p === 'lichess' ? 'Lichess' : 'Chess.com'}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchGames()}
            placeholder={platform === 'lichess' ? 'Lichess username' : 'Chess.com username'}
            className="input-field flex-1"
          />
          <button onClick={fetchGames} disabled={loading || !username.trim()} className="btn-primary px-6 disabled:opacity-30">
            {loading ? '...' : 'Fetch'}
          </button>
        </div>

        {error && <p className="text-sm mt-2" style={{ color: 'var(--accent-red)' }}>{error}</p>}

        {games.length > 0 && (
          <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
            {games.map((game) => (
              <div key={game.id}
                onClick={() => onGameSelect(game.pgn)}
                className="surface surface-hover p-3 flex justify-between items-center cursor-pointer">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{game.white}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>vs</span>
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{game.black}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>{game.result}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{game.date}</span>
                    {game.timeControl && <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{game.timeControl}</span>}
                  </div>
                </div>
                <span className="text-sm shrink-0" style={{ color: 'var(--gold)' }}>→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import Reveal, { StaggerReveal } from '@/components/ui/Reveal';

const searchFeatures = [
  { title: 'Principal Variation Search', desc: 'Searches the first move at full depth, then uses zero-window searches for remaining moves to prune efficiently.' },
  { title: 'Null Move Pruning', desc: 'Skips a move to see if the position is so good that even without a move, the opponent can\'t catch up. Gated on king safety.' },
  { title: 'Late Move Reductions', desc: 'Reduces search depth for moves ordered later in the move list, which are statistically less likely to be good.' },
  { title: 'Futility Pruning', desc: 'Skips moves in the quiet move loop when the static evaluation is too far below alpha to possibly affect the result.' },
  { title: 'Singular Extensions', desc: 'When the TT move is significantly better than all alternatives, extend its search to avoid missing critical moves.' },
  { title: 'Check Extensions', desc: 'Extends search depth when the side to move is in check, ensuring tactical combinations are fully searched.' },
  { title: '3D History Heuristic', desc: 'Move ordering based on piece-type, to-square, and previous-move context. Better ordering = faster cutoffs.' },
  { title: 'Countermove History', desc: 'Remembers what move was best in response to each (previous piece, previous square) combination.' },
];

const evalFeatures = [
  { title: 'Tapered Evaluation', desc: 'Smoothly interpolates between middle-game and endgame scores based on remaining material on the board.' },
  { title: 'Ethereal PSTs', desc: 'Piece-square tables from the Ethereal engine, providing positional knowledge for every piece type and game phase.' },
  { title: 'Passed Pawn Evaluation', desc: 'Bonus for passed pawns scaled by king proximity, rook defense, and enemy king position. Defensive resource detection.' },
  { title: 'Knight Outposts', desc: 'Bonus for knights on squares protected by friendly pawns, not attackable by enemy pawns, on the 4th rank or beyond.' },
  { title: 'King Safety', desc: 'King ring attack scoring with piece-type weights. Shelter pawns, gap penalties, and castled king bonuses.' },
  { title: 'Rook Evaluation', desc: 'Bonuses for open files, semi-open files, rooks on the 7th rank, and rooks behind own pawns.' },
  { title: 'Mobility Scoring', desc: 'Counts safe squares each piece can reach, with separate tables for knights, bishops, rooks, and queens.' },
  { title: 'Bad Bishop Detection', desc: 'Penalty for bishops blocked by their own pawns on the same color square.' },
];

const infraFeatures = [
  { title: '64-bit Zobrist Hashing', desc: 'Random bit strings assigned to each piece-square combination. XOR operations create unique position keys.' },
  { title: 'Magic Bitboards', desc: 'Precomputed magic numbers for efficient slider attack generation. O(1) rook and bishop attack lookups.' },
  { title: 'Transposition Table', desc: 'Depth-preferred replacement with generation counters. Stores exact, upper, and lower bound scores.' },
  { title: 'Opening Book', desc: 'Built-in book with 100+ entries. Instant lookup from the starting position for common opening lines.' },
  { title: 'Time Management', desc: 'Dynamic allocation based on position complexity, move stability, and remaining time. Never flags.' },
  { title: 'Crash Safety', desc: 'Hard ply cap, stack guards, undo bound checks, quiescence caps, and fail-safe fallback returns.' },
];

function FeatureSection({ title, tag, features, id }: { title: string; tag: string; features: typeof searchFeatures; id: string }) {
  return (
    <section id={id} className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <span className="tag tag-gold mb-4 inline-block">{tag}</span>
          <h2 className="text-3xl md:text-4xl mb-12">{title}</h2>
        </Reveal>
        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <div key={f.title} className="surface surface-hover p-5">
              <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: 'Inter' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

export default function Features() {
  return (
    <div className="pt-24">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <span className="tag tag-gold mb-4 inline-block">Features</span>
            <h1 className="text-4xl md:text-6xl mb-6 max-w-3xl">Everything that makes<br />GoatedChess work</h1>
            <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              A complete chess engine built from scratch. Search, evaluation, infrastructure — every component documented and explained.
            </p>
          </Reveal>
        </div>
      </section>

      <FeatureSection id="search" title="Search Algorithm" tag="Search" features={searchFeatures} />
      <div className="section-divider max-w-7xl mx-auto" />
      <FeatureSection id="evaluation" title="Evaluation Function" tag="Evaluation" features={evalFeatures} />
      <div className="section-divider max-w-7xl mx-auto" />
      <FeatureSection id="infrastructure" title="Infrastructure" tag="Infrastructure" features={infraFeatures} />
    </div>
  );
}

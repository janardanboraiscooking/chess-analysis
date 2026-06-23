export type MoveClassification = 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

export interface PositionEval {
  fen: string;
  eval: number;
  bestMove: string;
  pv: string[];
  depth: number;
}

export interface AnalyzedMoveData {
  san: string;
  uci: string;
  classification: MoveClassification;
  evalBefore: number;
  evalAfter: number;
  evalLoss: number;
  bestMove: string;
  pv: string[];
}

export interface AnalyzedMove {
  moveNumber: number;
  white?: AnalyzedMoveData;
  black?: AnalyzedMoveData;
}

export interface AnalyzedGame {
  id: string;
  whiteName: string;
  blackName: string;
  result: string;
  moves: AnalyzedMove[];
  whiteACPL: number;
  blackACPL: number;
  totalMoves: number;
  analyzedAt: number;
}

export interface AnalysisProgress {
  current: number;
  total: number;
  status: 'idle' | 'analyzing' | 'done' | 'error';
  currentMove?: string;
}

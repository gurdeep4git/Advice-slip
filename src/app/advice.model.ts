export interface Advice {
  total_results: number;
  query: string;
  slips: Slip[];
}

export interface Slip {
  slip_id: number;
  advice: string;
}

export interface NoAdvice {
  text: string;
  type: string;
}

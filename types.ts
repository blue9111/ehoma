export enum AppStep {
  UPLOAD = 0,
  TRANSCRIPTION = 1,
  FORMATTING = 2,
  PPT_GENERATION = 3,
}

export interface SlideData {
  title: string;
  bullets: string[];
  notes: string;
}

export interface PPTData {
  slides: SlideData[];
}

export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
}

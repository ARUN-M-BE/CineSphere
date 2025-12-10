export interface Movie {
  id: string;
  title: string;
  genre: string[];
  rating: number;
  duration: string;
  posterUrl: string;
  backdropUrl: string;
  description: string;
  isPremiere: boolean;
  tags: string[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'vip' | 'accessible';
  status: 'available' | 'occupied' | 'selected';
  price: number;
}

export interface BookingState {
  step: 'home' | 'details' | 'booking' | 'confirmation';
  selectedMovie: Movie | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedSeats: Seat[];
}

export interface GeminiInsights {
  buzz: string;
  mood: string;
  reviewSummary: string;
}

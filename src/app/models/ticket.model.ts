export interface Ticket {
  id: string;
  movie_title: string;
  showtime: string;
  seats: string[];
  payment_status: string;
  total_amount: number;
  poster?: string;
}

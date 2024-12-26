import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { TicketService } from '../../services/ticket.service';
import { loadStripe } from '@stripe/stripe-js';
import { AuthService } from '../../services/auth.service';

type TicketCategory = 'adult' | 'student' | 'child';

interface TicketPrice {
  category: TicketCategory;
  price: number;
  description?: string;
}

interface TicketResponse {
  id: string;
  movie_title: string;
  payment_status: string;
}

@Component({
  selector: 'app-ticket-selection',
  imports: [
    InputNumberModule,
    FormsModule,
    CommonModule,
    CardModule,
    StepperModule,
    ButtonModule,
    DropdownModule,
    SeatSelectionComponent,
    PanelModule,
    ChipModule,
    TagModule,
  ],
  templateUrl: './ticket-selection.component.html',
  styleUrl: './ticket-selection.component.css',
})
export class TicketSelectionComponent implements OnInit {
  currentStep: number = 1; // Initialize the current step

  movieId: string;
  selectedShowtime: string;
  title: string = '';
  format: string = '';
  showtime: string = '';
  languageInfo: string = '';
  totalTickets: number = 0;
  totalCost: number = 0;
  poster: string = '';

  ticketPrices: TicketPrice[] = [
    { category: 'adult', price: 15.0, description: 'Ages 18+' },
    {
      category: 'student',
      price: 12.0,
      description: 'Valid student ID required',
    },
    { category: 'child', price: 8.0, description: 'Ages 3-17' },
  ];

  ticketCounts: Record<TicketCategory, number> = {
    adult: 0,
    student: 0,
    child: 0,
  };

  ticketOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));

  seatRows = [
    [
      { label: 'A1', occupied: false, selected: false },
      { label: 'A2', occupied: true, selected: false },
      { label: 'A3', occupied: false, selected: false },
      { label: 'A4', occupied: false, selected: false },
    ],
    [
      { label: 'B1', occupied: false, selected: false },
      { label: 'B2', occupied: false, selected: false },
      { label: 'B3', occupied: true, selected: false },
      { label: 'B4', occupied: false, selected: false },
    ],
    [
      { label: 'C1', occupied: true, selected: false },
      { label: 'C2', occupied: false, selected: false },
      { label: 'C3', occupied: false, selected: false },
      { label: 'C4', occupied: false, selected: false },
    ],
  ];

  ticketCategories: TicketCategory[] = ['adult', 'student', 'child'];

  selectedSeatsValid: boolean = false;
  selectedSeats: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private ticketService: TicketService,
    private authService: AuthService
  ) {
    this.movieId = this.route.snapshot.paramMap.get('movieId') ?? '';
    this.selectedShowtime = this.route.snapshot.paramMap.get('showtime') ?? '';
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.title = params['title'];
      this.format = params['format'];
      this.showtime = params['showtime'];
      this.languageInfo = params['languageInfo'];
      this.poster = params['poster'];
    });
  }

  toggleSeatSelection(rowIndex: number, seatIndex: number): void {
    const seat = this.seatRows[rowIndex][seatIndex];
    if (!seat.occupied) {
      seat.selected = !seat.selected;
    }
  }

  updateTotalTickets() {
    this.totalTickets = Object.values(this.ticketCounts).reduce(
      (sum, count) => sum + (count || 0),
      0
    );
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    this.totalCost = Object.entries(this.ticketCounts).reduce(
      (total, [category, count]) => {
        const ticketPrice =
          this.ticketPrices.find((tp) => tp.category === category)?.price || 0;
        return total + ticketPrice * count;
      },
      0
    );
  }

  getTicketPrice(category: TicketCategory): number {
    return this.ticketPrices.find((tp) => tp.category === category)?.price || 0;
  }

  getTicketDescription(category: TicketCategory): string {
    return (
      this.ticketPrices.find((tp) => tp.category === category)?.description ||
      ''
    );
  }

  incrementTicket(category: TicketCategory): void {
    if (this.ticketCounts[category] < 10) {
      this.ticketCounts[category]++;
      this.updateTotalTickets();
    }
  }

  decrementTicket(category: TicketCategory): void {
    if (this.ticketCounts[category] > 0) {
      this.ticketCounts[category]--;
      this.updateTotalTickets();
    }
  }

  onSeatsSelected(seats: string[]) {
    this.selectedSeats = seats;
    this.selectedSeatsValid = seats.length === this.totalTickets;
  }

  async proceedToPayment() {
    console.log('Original showtime:', this.showtime);
    console.log('Original movieId:', this.movieId); // Debug movieId

    let formattedShowtime;
    try {
      const [hours, minutes] = this.showtime.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0);
      formattedShowtime = date.toISOString();
    } catch (error) {
      console.error('Date parsing error:', error);
      formattedShowtime = new Date().toISOString();
    }

    // Ensure movieId is a valid number
    const movieId = Number(this.movieId);
    if (isNaN(movieId)) {
      console.error('Invalid movie ID:', this.movieId);
      return; // Stop execution if movie ID is invalid
    }

    const ticketData = {
      movie_title: this.title,
      movie_id: movieId, // Use the validated movieId
      showtime: formattedShowtime,
      seats: this.selectedSeats,
      ticket_type: this.ticketCounts,
      total_amount: this.totalCost,
      poster: this.poster,
      payment_status: 'PENDING',
    };

    console.log('Sending ticket data:', ticketData);

    try {
      const ticketResponse = await this.ticketService
        .createTicket(ticketData)
        .toPromise();

      if (!ticketResponse || !ticketResponse.id) {
        throw new Error('Failed to create ticket');
      }

      const body = {
        ticketCounts: this.ticketCounts,
        prices: {
          adult: 'price_1QYDq5J1irMsiTTCHMxUaICo',
          student: 'price_1QYDpJJ1irMsiTTCg9PqWgfk',
          child: 'price_1QYDjpJ1irMsiTTCHGNU5hHk',
        },
        ticketId: ticketResponse.id,
      };

      this.http
        .post(
          'http://127.0.0.1:8000/api/payments/create-checkout-session/',
          body
        )
        .subscribe(
          (response: any) => {
            if (response.url) {
              // Open in new window and store reference
              const stripeWindow = window.open(response.url, '_blank');
              
              // Listen for messages from Stripe
              window.addEventListener('message', async (event) => {
                if (event.data === 'stripe-payment-success') {
                  // Update ticket status
                  await this.ticketService.updateTicketStatus(ticketResponse.id, 'COMPLETED');
                  stripeWindow?.close();
                  // Optionally redirect to my-movies page
                  window.location.href = '/my-movies';
                }
              });
            }
          },
          (error) => {
            console.error('Error creating checkout session', error);
          }
        );
    } catch (error: any) {
      console.error('Error details:', error.error);
      console.error('Error creating ticket:', error);
    }
  }
}

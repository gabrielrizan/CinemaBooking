import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import {
  SeatLayout,
  NowShowingService,
} from '../../services/now-showing.service';
import { firstValueFrom } from 'rxjs';

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
  styleUrls: ['./ticket-selection.component.css'],
  providers: [MessageService],
})
export class TicketSelectionComponent implements OnInit {
  currentStep: number = 1;
  cinema_layout: SeatLayout = {} as SeatLayout;
  movieId: string;
  selectedShowtime: string;
  title: string = '';
  format: string = '';
  showtime: string = '';
  languageInfo: string = '';
  totalTickets: number = 0;
  totalCost: number = 0;
  poster: string = '';
  layout: any;

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

  ticketCategories: TicketCategory[] = ['adult', 'student', 'child'];
  selectedSeatsValid: boolean = false;
  selectedSeats: string[] = [];
  processedSeats: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private ticketService: TicketService,
    private authService: AuthService,
    private messageService: MessageService,
    private nowShowingService: NowShowingService
  ) {
    this.movieId = this.route.snapshot.paramMap.get('movieId') ?? '';
    this.selectedShowtime = this.route.snapshot.paramMap.get('showtime') ?? '';
  }

  ngOnInit() {
    this.route.queryParams.subscribe({
      next: (params) => {
        this.title = params['title'];
        this.format = params['format'];
        this.showtime = params['showtime'];
        this.languageInfo = params['languageInfo'];
        this.poster = params['poster'];
        this.nowShowingService.getCinemaHall(params['hall']).subscribe({
          next: (data: SeatLayout) => {
            this.cinema_layout = data.layout as unknown as SeatLayout;
            console.log('Layout data cinema: ', this.cinema_layout.layout);
            if (this.cinema_layout.layout) {
              this.processSeats();
            }
          },
        });
        console.log('Layout data: ', this.cinema_layout);
        if (params['error'] === 'payment_cancelled') {
          this.messageService.add({
            severity: 'error',
            summary: 'Payment Failed',
            detail: 'Your payment was cancelled or failed. Please try again.',
          });
          this.currentStep = 3;
        }
        if (params['success'] === 'true') {
          this.currentStep = 4;
        }
      },
    });
  }

  processSeats(): void {
    this.processedSeats = this.cinema_layout.layout.map((row, rowIndex) =>
      row.map((seat, seatIndex) => ({
        label: `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`,
        occupied: false,
        selected: false,
        type: seat.type,
      }))
    );
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

  onActiveIndexChange(event: any) {
    if (event > this.currentStep) {
      return;
    }
    if (event <= this.currentStep) {
      this.currentStep = event;
    }
  }
  async proceedToPayment() {
    let formattedShowtime;
    try {
      const today = new Date();
      const [hours, minutes] = this.showtime.split(':');
      today.setHours(parseInt(hours), parseInt(minutes), 0);
      formattedShowtime = today.toISOString();
    } catch (error) {
      console.error('Date parsing error:', error);
      formattedShowtime = new Date().toISOString();
    }

    const movieId = Number(this.movieId);
    if (isNaN(movieId)) {
      console.error('Invalid movie ID:', this.movieId);
      return;
    }

    const ticketData = {
      movie_title: this.title,
      movie_id: movieId,
      showtime: formattedShowtime,
      seats: this.selectedSeats,
      ticket_type: this.ticketCounts,
      total_amount: this.totalCost,
      poster: this.poster,
      payment_status: 'PENDING',
      format: this.format,
      cinema_id: this.route.snapshot.queryParams['cinemaId'],
    };

    console.log('Sending ticket data:', ticketData);

    try {
      // 1) Create ticket in your backend (PENDING)
      const ticketResponse = await firstValueFrom(
        this.ticketService.createTicket(ticketData)
      );
      if (!ticketResponse || !ticketResponse.id) {
        throw new Error('Failed to create ticket');
      }

      // 2) Create Stripe Checkout session
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
        .subscribe({
          next: (response: any) => {
            if (response.url) {
              window.location.href = response.url;
            }
          },
          error: (error) => {
            console.error('Error creating checkout session', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Payment Failed',
              detail:
                'There was an error processing your payment. Please try again.',
            });
          },
        });
    } catch (error) {
      console.error('Error creating ticket:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create ticket. Please try again.',
      });
    }
  }
}

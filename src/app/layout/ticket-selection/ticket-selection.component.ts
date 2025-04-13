import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';
import { HttpClient } from '@angular/common/http';
import { PanelModule } from 'primeng/panel';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { TicketService } from '../../services/ticket.service';
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
  standalone: true,
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
  @ViewChild(SeatSelectionComponent)
  seatSelectionComponent!: SeatSelectionComponent;

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
  time: string = '';
  date: string = new Date().toISOString().split('T')[0];
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
  paymentSuccess: boolean = false;
  boughtTickets: string[] = [];

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
        // If we're returning from a successful payment:
        if (params['success'] === 'true') {
          this.currentStep = 4;
          this.paymentSuccess = true;

          // Retrieve stored data from localStorage
          const storedTitle = localStorage.getItem('movieTitle');
          const storedFormat = localStorage.getItem('movieFormat');
          const storedTime = localStorage.getItem('movieTime');
          const storedPoster = localStorage.getItem('moviePoster');
          const storedTicketCounts = localStorage.getItem('ticketCounts');

          // Apply them to our component if they exist
          if (storedTitle) this.title = storedTitle;
          if (storedFormat) this.format = storedFormat;
          if (storedTime) this.time = storedTime;
          if (storedPoster) this.poster = storedPoster;
          if (storedTicketCounts) {
            this.ticketCounts = JSON.parse(storedTicketCounts);
          }

          // Recalculate total cost after retrieval
          this.updateTotalTickets();
        } else {
          // Otherwise, normal param usage
          this.title = params['title'];
          this.format = params['format'];
          this.showtime = params['showtime'];
          this.languageInfo = params['languageInfo'];
          this.poster = params['poster'];
          this.time = params['time'];
          this.date = params['date'];
          console.log('Time', this.time);
          console.log('Date', this.date);

          // If user canceled or payment failed
          if (params['error'] === 'payment_cancelled') {
            this.messageService.add({
              severity: 'error',
              summary: 'Payment Failed',
              detail: 'Your payment was cancelled or failed. Please try again.',
            });
            this.currentStep = 3;
          }

          // Fetch cinema layout
          this.nowShowingService.getCinemaHall(params['hall']).subscribe({
            next: (data: SeatLayout) => {
              this.cinema_layout = data.layout as unknown as SeatLayout;
              console.log('Layout data cinema: ', this.cinema_layout.layout);
              if (this.cinema_layout.layout) {
                this.processSeats();
              }
            },
          });
        }
      },
    });

    // Fetch reserved seats if showtime is provided
    if (this.showtime) {
      this.ticketService.getReservedSeats(Number(this.showtime)).subscribe({
        next: (reserved: string[]) => {
          this.boughtTickets = reserved;
        },
        error: (err) => console.error('Error fetching bought seats:', err),
      });
    }
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

    // Prepare ticket data
    const ticketData = {
      movie_title: this.title,
      movie_id: movieId,
      showtime: this.route.snapshot.queryParams['showtime'],
      seats: this.selectedSeats,
      ticket_type: this.ticketCounts,
      total_amount: this.totalCost,
      poster: this.poster,
      payment_status: 'PENDING',
      format: this.format,
      cinema_id: this.route.snapshot.queryParams['cinemaId'],
      date: this.date,
      time: this.time,
    };

    console.log('Sending ticket data:', ticketData);

    try {
      const ticketResponse = await firstValueFrom(
        this.ticketService.createTicket(ticketData)
      );
      if (!ticketResponse || !ticketResponse.id) {
        throw new Error('Failed to create ticket');
      }

      // **Store data in localStorage** before redirect
      localStorage.setItem('movieTitle', this.title);
      localStorage.setItem('movieFormat', this.format);
      localStorage.setItem('movieTime', this.time);
      localStorage.setItem('moviePoster', this.poster);
      localStorage.setItem('ticketCounts', JSON.stringify(this.ticketCounts));

      // Prepare Stripe request
      const body = {
        ticketCounts: this.ticketCounts,
        prices: {
          adult: 'price_1QYDq5J1irMsiTTCHMxUaICo',
          student: 'price_1QYDpJJ1irMsiTTCg9PqWgfk',
          child: 'price_1QYDjpJ1irMsiTTCHGNU5hHk',
        },
        ticketId: ticketResponse.id,
      };

      // Create checkout session -> redirect user
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../services/ticket.service';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

interface Ticket {
  id: string;
  movie_title: string;
  showtime: string;
  seats: string[];
  payment_status: string;
  total_amount: number;
  poster?: string;
}

@Component({
  selector: 'app-my-movies',
  templateUrl: './my-movies.component.html',
  styleUrls: ['./my-movies.component.css'],
  imports: [CommonModule, CardModule, TabViewModule, TagModule, ButtonModule],
  standalone: true,
})
export class MyMoviesComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  upcomingMovies: Ticket[] = [];
  pastMovies: Ticket[] = [];
  private authSubscription!: Subscription;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        if (isLoggedIn) {
          this.loadTickets();
        } else {
          // Clear tickets when logged out
          this.tickets = [];
          this.upcomingMovies = [];
          this.pastMovies = [];
        }
      }
    );
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadTickets() {
    this.ticketService.getUserTickets().subscribe({
      next: (tickets: Ticket[]) => {
        this.tickets = tickets;
        const now = new Date();
        this.upcomingMovies = tickets.filter(
          (ticket: Ticket) => new Date(ticket.showtime) >= now
        );
        this.pastMovies = tickets.filter(
          (ticket: Ticket) => new Date(ticket.showtime) < now
        );
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
      },
    });
  }

  getStatusSeverity(
    status: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warn'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'active':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'pending':
        return 'warn';
      default:
        return 'info';
    }
  }

  cancelTicket(ticketId: string) {
    // Implement cancel ticket logic
    console.log('Cancelling ticket:', ticketId);
  }
}

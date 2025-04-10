import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../services/ticket.service';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';
import { Subscription, forkJoin, of } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { NowShowingService } from '../services/now-showing.service';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';

interface Ticket {
  id: string;
  movie_title: string;
  showtime: string;
  seats: string[];
  payment_status: string;
  total_amount: number;
  poster?: string;
  movie_time?: string;
  movie_date?: string;
}

@Component({
  selector: 'app-my-movies',
  templateUrl: './my-movies.component.html',
  styleUrls: ['./my-movies.component.css'],
  imports: [CommonModule, CardModule, TabViewModule, TagModule, ButtonModule, BadgeModule, ChipModule],
  standalone: true,
})
export class MyMoviesComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  upcomingMovies: Ticket[] = [];
  pastMovies: Ticket[] = [];
  private authSubscription!: Subscription;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private nowShowingService: NowShowingService
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadTickets();
      } else {
        this.tickets = [];
        this.upcomingMovies = [];
        this.pastMovies = [];
      }
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) this.authSubscription.unsubscribe();
  }

  loadTickets() {
    this.ticketService.getUserTickets().pipe(
      switchMap((tickets: Ticket[]) => {
        const showtimeRequests = tickets.map(ticket =>
          this.nowShowingService.getShowtimeById(Number(ticket.showtime)).pipe(
            catchError(err => {
              console.warn(`Error loading showtime for ticket ${ticket.id} (ID ${ticket.showtime})`, err);
              return of({ time: '', date: '' });
            }),
            tap(showtime => {
              ticket.movie_time = showtime.time;
              ticket.movie_date = showtime.date;
            })
          )
        );
        return forkJoin(showtimeRequests).pipe(map(() => tickets));
      })
    ).subscribe({
      next: (tickets: Ticket[]) => {
        this.tickets = tickets;
        const now = new Date();
        this.upcomingMovies = tickets.filter(ticket => {
          if (!ticket.movie_date || !ticket.movie_time) return false;
          const ticketDateTime = new Date(`${ticket.movie_date}T${ticket.movie_time}`);
          return ticketDateTime >= now;
        });
        this.pastMovies = tickets.filter(ticket => {
          if (!ticket.movie_date || !ticket.movie_time) return false;
          const ticketDateTime = new Date(`${ticket.movie_date}T${ticket.movie_time}`);
          return ticketDateTime < now;
        });
      },
      error: error => {
        console.error('Error loading tickets or showtimes:', error);
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch(status) {
      case 'active': return 'success';
      case 'cancelled': return 'danger';
      case 'pending': return 'warn';
      default: return 'info';
    }
  }

  getUpcomingStatus(paymentStatus: string): string {
    const statusMap = {
      'COMPLETED': 'Ready to Watch',
      'PENDING': 'Payment Pending',
      'PROCESSING': 'Processing',
      'FAILED': 'Payment Failed'
    };
    return statusMap[paymentStatus as keyof typeof statusMap] || paymentStatus;
  }

  cancelTicket(ticketId: string) {
    console.log('Cancelling ticket:', ticketId);
  }

  groupSeatsByRow(seats: string[]): Array<{ row: string; seats: string[] }> {
    const grouped: { [row: string]: string[] } = {};
    seats.forEach(seatString => {
      const match = seatString.match(/Row\s+([A-Za-z0-9]+)\s+Seat\s+(\d+)/i);
      if (match) {
        const row = match[1];
        const seatNum = match[2];
        if (!grouped[row]) grouped[row] = [];
        grouped[row].push(seatNum);
      } else {
        if (!grouped['Unknown']) grouped['Unknown'] = [];
        grouped['Unknown'].push(seatString);
      }
    });
    return Object.keys(grouped).map(row => ({ row, seats: grouped[row] }));
  }
}

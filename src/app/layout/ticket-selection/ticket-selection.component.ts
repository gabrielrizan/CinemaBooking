import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';

type TicketCategory = 'adult' | 'student' | 'child';

interface TicketPrice {
  category: TicketCategory;
  price: number;
  description?: string;
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
  ],
  templateUrl: './ticket-selection.component.html',
  styleUrl: './ticket-selection.component.css',
})
export class TicketSelectionComponent {
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

  constructor(private route: ActivatedRoute) {
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

  proceedToPayment() {
    // Add logic for proceeding to payment
    console.log('Total cost:', this.totalCost);
  }
}

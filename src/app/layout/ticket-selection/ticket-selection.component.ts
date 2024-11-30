import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { StepperModule } from 'primeng/stepper';
import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';

type TicketCategory = 'adult' | 'student' | 'child'; // Define the specific type
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
  poster: string = '';
  ticketCounts: Record<TicketCategory, number> = {
    adult: 0,
    student: 0,
    child: 0,
  }; // Use the type for ticketCounts

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

  ticketOptions = [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ];
  ticketCategories: TicketCategory[] = ['adult', 'student', 'child']; // Use the type for ticketCategories

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

  proceedToPayment() {
    // Add logic for proceeding to payment
  }
}

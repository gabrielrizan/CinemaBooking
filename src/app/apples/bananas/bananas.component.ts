import { Component, Input } from '@angular/core';
import { ApplesComponent } from '../apples.component';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bananas',
  standalone: true,
  imports: [
    ApplesComponent,
    ButtonModule,
    StepperModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './bananas.component.html',
  styleUrl: './bananas.component.css',
})
export class BananasComponent {
  seatRows: any[][] = [];
  selectedSeats: any[] = [];

  constructor() {
    this.initializeSeats();
  }

  initializeSeats(): void {
    const rows = 5; // Number of rows
    const seatsPerRow = 10; // Seats per row

    for (let i = 0; i < rows; i++) {
      const row: any[] = [];
      for (let j = 0; j < seatsPerRow; j++) {
        row.push({
          label: `Row ${String.fromCharCode(65 + i)} Seat ${j + 1}`,
          reserved: Math.random() < 0.2, // Randomly set some seats as reserved
        });
      }
      this.seatRows.push(row);
    }
  }

  toggleSeatSelection(seat: any): void {
    const index = this.selectedSeats.indexOf(seat);
    if (index === -1) {
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats.splice(index, 1);
    }
  }

  getRowLabel(index: number): string {
    return String.fromCharCode(65 + index); // Convert index to A, B, C, ...
  }
}

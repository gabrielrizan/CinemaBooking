import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.css',
})
export class SeatSelectionComponent {
  seatRows: any[][] = [];
  selectedSeats: any[] = [];

  constructor() {
    this.initializeSeats();
  }

  initializeSeats(): void {
    const rows = 8; // Number of rows
    const seatsPerRow = 16; // Seats per row
    const middleRowsForWheelchairs = [
      Math.floor(rows / 2) - 1,
      Math.floor(rows / 2),
    ]; // Middle rows for wheelchair seats

    for (let i = 0; i < rows; i++) {
      const row: any[] = [];
      for (let j = 0; j < seatsPerRow; j++) {
        // Skip stairs for the last row
        if (
          i < rows - 1 &&
          (j === Math.floor(seatsPerRow / 2) ||
            j === Math.floor(seatsPerRow / 2) - 1)
        ) {
          row.push(null); // Gap for stairs
        } else {
          // Add seat with default properties
          const seat = {
            label: `Row ${String.fromCharCode(65 + i)} Seat ${j + 1}`,
            reserved: Math.random() < 0.2, // Randomly reserve some seats
            vip: false,
            wheelchair: false,
          };

          // Assign VIP seats (center of penultimate and last rows)
          if (
            (i === rows - 2 || i === rows - 1) &&
            j >= seatsPerRow / 2 - 1 &&
            j <= seatsPerRow / 2
          ) {
            seat.vip = true;
          }

          // Assign wheelchair seats near the stairs in middle rows
          if (
            middleRowsForWheelchairs.includes(i) &&
            (j === Math.floor(seatsPerRow / 2) - 2 ||
              j === Math.floor(seatsPerRow / 2) + 1)
          ) {
            seat.wheelchair = true;
          }

          row.push(seat);
        }
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

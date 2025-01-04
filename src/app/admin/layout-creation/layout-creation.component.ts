import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CellType = 'seat' | 'empty' | 'space';

interface Cell {
  type: CellType;
}

interface SavedLayout {
  id: string;
  name: string;
  rows: number;
  layout: Cell[][];
  seatsPerRow: number[];
  createdAt: Date;
}

@Component({
  selector: 'app-layout-creation',
  templateUrl: './layout-creation.component.html',
  styleUrls: ['./layout-creation.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    DialogModule,
    TableModule,
    ToastModule,
  ],
  standalone: true,
  providers: [MessageService],
})
export class LayoutCreationComponent implements OnInit {
  rows: number = 8;
  layout: Cell[][] = [];
  seatsPerRow: number[] = [];
  selectedTool: CellType = 'seat';
  layoutName: string = '';
  savedLayouts: SavedLayout[] = [];
  showSavedLayouts: boolean = false;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.initializeLayout();
    this.loadSavedLayouts();
  }

  initializeLayout() {
    this.layout = [];
    this.seatsPerRow = Array(this.rows).fill(12);
    for (let i = 0; i < this.rows; i++) {
      this.layout.push(this.createRow(this.seatsPerRow[i]));
    }
  }

  private createRow(seats: number): Cell[] {
    return Array(seats)
      .fill(null)
      .map(() => ({ type: 'seat' as CellType }));
  }

  updateLayoutSize() {
    const oldRows = this.layout.length;
    if (this.rows > oldRows) {
      // Add new rows
      for (let i = oldRows; i < this.rows; i++) {
        this.seatsPerRow.push(12);
        this.layout.push(this.createRow(12));
      }
    } else if (this.rows < oldRows) {
      // Remove rows
      this.layout = this.layout.slice(0, this.rows);
      this.seatsPerRow = this.seatsPerRow.slice(0, this.rows);
    }
  }

  updateRowSeats(rowIndex: number, newSeats: number) {
    this.seatsPerRow[rowIndex] = newSeats;
    const currentRow = this.layout[rowIndex];
    if (newSeats > currentRow.length) {
      const additionalSeats = Array(newSeats - currentRow.length)
        .fill(null)
        .map(() => ({ type: 'seat' as CellType }));
      this.layout[rowIndex] = [...currentRow, ...additionalSeats];
    } else if (newSeats < currentRow.length) {
      this.layout[rowIndex] = currentRow.slice(0, newSeats);
    }
  }

  onCellClick(rowIndex: number, colIndex: number) {
    if (colIndex < this.seatsPerRow[rowIndex]) {
      this.layout[rowIndex][colIndex].type = this.selectedTool;
    }
  }

  getRowLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getMaxSeatsInLayout(): number {
    return Math.max(...this.seatsPerRow);
  }

  saveLayout() {
    if (!this.layoutName) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a layout name',
      });
      return;
    }

    const newLayout: SavedLayout = {
      id: Date.now().toString(),
      name: this.layoutName,
      rows: this.rows,
      layout: JSON.parse(JSON.stringify(this.layout)),
      seatsPerRow: [...this.seatsPerRow],
      createdAt: new Date(),
    };

    this.savedLayouts.push(newLayout);
    localStorage.setItem('savedLayouts', JSON.stringify(this.savedLayouts));

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Layout saved successfully',
    });

    this.layoutName = '';
  }

  loadSavedLayouts() {
    const saved = localStorage.getItem('savedLayouts');
    if (saved) {
      this.savedLayouts = JSON.parse(saved);
    }
  }

  loadLayout(savedLayout: SavedLayout) {
    this.rows = savedLayout.rows;
    this.layout = JSON.parse(JSON.stringify(savedLayout.layout));
    this.seatsPerRow = [...savedLayout.seatsPerRow];
    this.showSavedLayouts = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Layout loaded successfully',
    });
  }

  deleteLayout(id: string) {
    this.savedLayouts = this.savedLayouts.filter((layout) => layout.id !== id);
    localStorage.setItem('savedLayouts', JSON.stringify(this.savedLayouts));

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Layout deleted successfully',
    });
  }
}

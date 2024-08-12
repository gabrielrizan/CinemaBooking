import { Component, Input } from '@angular/core';
import { BananasComponent } from './bananas/bananas.component';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-apples',
  standalone: true,
  imports: [BananasComponent,FormsModule, PasswordModule, DividerModule],
  templateUrl: './apples.component.html',
  styleUrl: './apples.component.css',
})
export class ApplesComponent {
  @Input() apple: any;
  value!: string;
}

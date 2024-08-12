import { Component, Input } from '@angular/core';
import { BananasComponent } from './bananas/bananas.component';

@Component({
  selector: 'app-apples',
  standalone: true,
  imports: [BananasComponent],
  templateUrl: './apples.component.html',
  styleUrl: './apples.component.css',
})
export class ApplesComponent {
  @Input() apple: any;
  
}

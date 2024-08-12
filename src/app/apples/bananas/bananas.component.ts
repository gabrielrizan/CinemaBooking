import { Component, Input } from '@angular/core';
import { ApplesComponent } from '../apples.component';

@Component({
  selector: 'app-bananas',
  standalone: true,
  imports: [ApplesComponent],
  templateUrl: './bananas.component.html',
  styleUrl: './bananas.component.css',
})
export class BananasComponent {
  apple = 'apple + gooneeers';
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    PasswordModule,
    ButtonModule,
    DividerModule,

  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  value!: string;
  cinemaOptions: any[] = [
    { label: 'Cinema 1', value: 'cinema1' },
    { label: 'Cinema 2', value: 'cinema2' },
    { label: 'Cinema 3', value: 'cinema3' },
  ];

  genderOptions: any[] = [
    { label: 'Masculin', value: 'male' },
    { label: 'Feminin', value: 'female' },
    { label: 'Altceva', value: 'other' },
  ];

  countyOptions: any[] = [
    { label: 'Județ 1', value: 'county1' },
    { label: 'Județ 2', value: 'county2' },
    { label: 'Județ 3', value: 'county3' },
  ];

  cityOptions: any[] = [
    { label: 'Oraș 1', value: 'city1' },
    { label: 'Oraș 2', value: 'city2' },
    { label: 'Oraș 3', value: 'city3' },
  ];
}

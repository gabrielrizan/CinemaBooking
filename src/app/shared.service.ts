import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // Subject to notify when search blur should be triggered
  private searchBlurSubject = new Subject<void>();

  // Observable to subscribe to in the NavbarComponent
  searchBlur$ = this.searchBlurSubject.asObservable();

  // Method to trigger the search blur event
  triggerSearchBlur() {
    this.searchBlurSubject.next();
  }
}

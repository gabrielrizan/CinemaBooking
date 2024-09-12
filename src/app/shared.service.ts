import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // Subject to notify when search blur should be triggered
  private searchBlurSubject = new Subject<void>();

  private movieOrTvDetailsSubject = new BehaviorSubject<any>(null);
  private movieCreditsSubject = new BehaviorSubject<any>(null);

  // Observable to subscribe to in the NavbarComponent
  searchBlur$ = this.searchBlurSubject.asObservable();

  movieOrTvDetails$: Observable<any> =
    this.movieOrTvDetailsSubject.asObservable();

  movieCredits$: Observable<any> = this.movieCreditsSubject.asObservable();

  setCredits(credits: any) {
    this.movieCreditsSubject.next(credits);
  }

  setMovieOrTvDetails(details: any) {
    this.movieOrTvDetailsSubject.next(details); // Emit the new details
  }

  // Method to trigger the search blur event
  triggerSearchBlur() {
    this.searchBlurSubject.next();
  }
}

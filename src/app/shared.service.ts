import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchBlurSubject = new Subject<void>();
  searchBlur$ = this.searchBlurSubject.asObservable();

  private loginPanelSubject = new Subject<void>();
  loginPanel$ = this.loginPanelSubject.asObservable();

  private movieOrTvDetailsSubject = new BehaviorSubject<any>(null);
  private movieCreditsSubject = new BehaviorSubject<any>(null);

  movieOrTvDetails$: Observable<any> =
    this.movieOrTvDetailsSubject.asObservable();
  movieCredits$: Observable<any> = this.movieCreditsSubject.asObservable();

  setCredits(credits: any) {
    this.movieCreditsSubject.next(credits);
    localStorage.setItem('movieCredits', JSON.stringify(credits));
  }

  setMovieOrTvDetails(details: any) {
    this.movieOrTvDetailsSubject.next(details);
    localStorage.setItem('movieOrTvDetails', JSON.stringify(details));
  }

  loadStoredMovieOrTvDetails() {
    const storedDetails = localStorage.getItem('movieOrTvDetails');
    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails);
      this.movieOrTvDetailsSubject.next(parsedDetails);
    }
  }

  loadStoredMovieCredits() {
    const storedCredits = localStorage.getItem('movieCredits');
    if (storedCredits) {
      const parsedCredits = JSON.parse(storedCredits);
      this.movieCreditsSubject.next(parsedCredits);
    }
  }

  // Method to trigger the search blur event
  triggerSearchBlur() {
    this.searchBlurSubject.next();
  }

  // Method to notify subscribers that the login panel should open
  showLoginPanel() {
    this.loginPanelSubject.next();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MultiSearchService } from '../../multi-search.service';
import { SearchCardComponent } from '../../search-card/search-card.component';
import { BigsearchComponent } from '../../bigsearch/bigsearch.component';
import { of } from 'rxjs';
import { SharedService } from '../../shared.service';
import { LoginComponent } from '../../auth/login/login.component';
import { AuthService } from '../../services/auth.service';
import { Genres, HomepageMovie, SearchMedia } from '../../models/movie.model';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    FormsModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    OverlayPanelModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    TieredMenuModule,
    SearchCardComponent, // Assuming this is a standalone component
    LoginComponent, // Assuming this is a standalone component
    RouterModule,
    TooltipModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  movies: SearchMedia[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';

  items: MenuItem[] | undefined;
  isLoggedIn = false; // Set this based on your actual authentication logic
  isSearchActive: boolean = false;
  visible: boolean = false;
  filteredMovies: HomepageMovie[] = [];
  movieGenres: Genres[] = [];
  tvGenres: Genres[] = [];

  @ViewChild('op') overlayPanel: OverlayPanel | undefined;

  private searchSubject = new Subject<string>(); // Subject to handle the search input
  userFirstName: string = '';

  constructor(
    private movieService: MultiSearchService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/home'],
      },
      {
        label: 'Movies',
        icon: 'pi pi-video',
        items: [
          {
            label: 'Now Showing',
            icon: 'pi pi-play',
            routerLink: ['/movies/now-showing'],
          },
          {
            label: 'Coming Soon',
            icon: 'pi pi-clock',
            routerLink: ['/movies/coming-soon'],
          },
          {
            label: 'Top Rated',
            icon: 'pi pi-thumbs-up',
            routerLink: ['/movies/top-rated'],
          },
        ],
      },
      {
        label: 'Offers',
        icon: 'pi pi-tag',
        items: [
          {
            label: 'Discounts',
            icon: 'pi pi-percentage',
            routerLink: ['/offers/discounts'],
          },
          {
            label: 'Memberships',
            icon: 'pi pi-id-card',
            routerLink: ['/offers/memberships'],
          },
        ],
      },
      {
        label: 'Snacks',
        icon: 'pi pi-shopping-bag',
        items: [
          {
            label: 'Popcorn',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/snacks/popcorn'],
          },
          {
            label: 'Drinks',
            icon: 'pi pi-glass-martini',
            routerLink: ['/snacks/drinks'],
          },
          {
            label: 'Combos',
            icon: 'pi pi-box',
            routerLink: ['/snacks/combos'],
          },
        ],
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        routerLink: ['/contact'],
      },
      {
        label: 'About Us',
        icon: 'pi pi-info-circle',
        routerLink: ['/about'],
      },
      {
        label: 'My Movies',
        icon: 'pi pi-video',
        routerLink: '/my-movies',
        visible: true,
      },
    ];

    this.searchSubject
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        distinctUntilChanged() // Ignore if next search term is same as previous
      )
      .subscribe((query) => {
        if (!query.trim()) {
          this.movies = []; // Clear the results if the query is empty
          return;
        }

        this.loading = true;
        this.error = null;

        this.movieService.searchMovies(query).subscribe({
          next: (response) => {
            this.movies = response.results || []; // Handle the API response and extract results
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to fetch movies';
            this.loading = false;
          },
        });
      });

    this.movieService.getMovieGenres().subscribe((data) => {
      this.movieGenres = data;
    });

    this.movieService.getTvGenres().subscribe((data) => {
      this.tvGenres = data;
    });

    this.sharedService.searchBlur$.subscribe(() => {
      this.isSearchActive = false;
    });

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.loadUserDetails();
      } else {
        this.userFirstName = '';
      }
    });
  }

  private loadUserDetails() {
    this.authService.getUserDetails().subscribe({
      next: (user) => {
        this.userFirstName = user.firstname;
        // Update menu items to show user name
        this.updateMenuItems();
      },
      error: (error) => {
        console.error('Error loading user details:', error);
      }
    });
  }

  private updateMenuItems() {
    // Update the account menu item to show user name
    const accountItem = this.items?.find(item => item.label === 'My Account');
    if (accountItem) {
      accountItem.label = `Hi, ${this.userFirstName}`;
    }
  }

  logout() {
    // Implement your logout logic here
    this.isLoggedIn = false;
    this.overlayPanel?.hide();
  }

  // logIn() {
  //   // Handle log in logic
  //   console.log('Log In button clicked');
  // }

  // signUp() {
  //   // Handle sign up logic
  //   console.log('Sign Up button clicked');
  // }

  onSearchFocus() {
    this.isSearchActive = true;
  }

  onSearchBlur() {
    this.isSearchActive = false;
  }

  onSearchChange(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchSubject.next(query); // Emit the query to the searchSubject
  }
  isDarkMode: boolean = false;

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');
    // showSignUpForm() {
    //   this.visible = true;
    // }
  }
}

import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
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
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MultiSearchService } from '../../multi-search.service';
import { SearchCardComponent } from '../../search-card/search-card.component';
import { BigsearchComponent } from '../../bigsearch/bigsearch.component';
import { of } from 'rxjs';
import { SharedService } from '../../shared.service';
import { LoginComponent } from '../../auth/login/login.component';
import { AuthService } from '../../services/auth.service';
import { Genres, HomepageMovie, SearchMedia } from '../../models/movie.model';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ChatbotComponent } from '../../chatbot/chatbot.component';

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
    SearchCardComponent,
    LoginComponent,
    RouterModule,
    TooltipModule,
    ChatbotComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  movies: SearchMedia[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  isAdminView: boolean = true;
  items: MenuItem[] | undefined;
  isLoggedIn = false;
  isSearchActive: boolean = false;
  visible: boolean = false;
  filteredMovies: HomepageMovie[] = [];
  movieGenres: Genres[] = [];
  tvGenres: Genres[] = [];
  isChatOpen: boolean = false;

  @ViewChild('op') overlayPanel: OverlayPanel | undefined;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('avatarEl', { static: false }) avatarEl!: ElementRef;
  @ViewChild('loginComponent') loginComponent!: LoginComponent;

  private searchSubject = new Subject<string>();
  userFirstName: string = '';
  private authSubscription!: Subscription;
  isAdmin: boolean = false;

  constructor(
    private movieService: MultiSearchService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          // Get user details when logged in
          this.authService.getUserDetails().subscribe({
            next: (user) => {
              this.userFirstName = user.firstname;
              this.isAdmin = user.is_staff === true;
              this.updateMenuItems(); // Update menu items when admin status changes
            },
            error: (error) => {
              console.error('Error loading user details:', error);
            },
          });
        } else {
          // Reset admin status and menu items when logged out
          this.isAdmin = false;
          this.userFirstName = '';
          this.updateMenuItems();
        }
      }
    );

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
        label: 'My Movies',
        icon: 'pi pi-video',
        routerLink: ['/my-movies'],
        visible: this.isLoggedIn,
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

    // Add subscription to check if user is admin
    this.authService.getUserDetails().subscribe({
      next: (user) => {
        this.userFirstName = user.firstname;
        this.isAdmin = user.is_staff === true;
        this.updateMenuItems();
      },
      error: (error) => {
        console.error('Error loading user details:', error);
      },
    });

    // Subscribe to admin view changes
    this.authService.adminView$.subscribe((isAdminView) => {
      this.isAdminView = isAdminView;
      this.updateMenuItems();
    });
  }

  toggleAdminView() {
    this.isAdminView = !this.isAdminView;
    this.updateMenuItems();
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
      },
    });
  }

  private updateMenuItems() {
    const baseItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/home'],
      },
    ];

    const regularItems = [
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
        label: 'My Movies',
        icon: 'pi pi-video',
        routerLink: ['/my-movies'],
        visible: this.isLoggedIn,
      },
      {
        label: 'For You',
        icon: 'pi pi-user',
        routerLink: ['/for-you'],
        visible: this.isLoggedIn,
      },
    ];

    const adminItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        routerLink: ['/admin/dashboard'],
      },
      {
        label: 'Analytics',
        icon: 'pi pi-chart-line',
        items: [
          {
            label: 'Sales Statistics',
            icon: 'pi pi-dollar',
            routerLink: ['/admin/statistics/sales'],
          },
          {
            label: 'Movie Performance',
            icon: 'pi pi-chart-pie',
            routerLink: ['/admin/statistics/movies'],
          },
        ],
      },
      {
        label: 'Cinema Management',
        icon: 'pi pi-building',
        items: [
          {
            label: 'Cinema Layouts',
            icon: 'pi pi-th-large',
            routerLink: ['/admin/layout'],
          },
          {
            label: 'Add New Cinema',
            icon: 'pi pi-plus',
            routerLink: ['/admin/cinemas/new'],
          },
        ],
      },
      {
        label: 'Movie Management',
        icon: 'pi pi-video',
        items: [
          {
            label: 'All Movies',
            icon: 'pi pi-list',
            routerLink: ['/admin/movies'],
          },
          {
            label: 'Add Movie',
            icon: 'pi pi-plus',
            routerLink: ['/admin/movies/new'],
          },
          {
            label: 'Manage Showtimes',
            icon: 'pi pi-calendar',
            routerLink: ['/admin/movies/showtimes'],
          },
        ],
      },
    ];

    this.items = [
      ...baseItems,
      ...(this.isAdmin && this.authService.isAdminView()
        ? adminItems
        : regularItems),
    ];
  }

  logout() {
    this.authService.logout(); // Use the service's logout method
    this.overlayPanel?.hide();
  }

  onSearchFocus() {
    this.isSearchActive = true;
    // Focus the expanded search input after dialog opens
    setTimeout(() => {
      if (this.searchInput?.nativeElement) {
        this.searchInput.nativeElement.focus();
      }
    }, 0);
  }

  onSearchBlur() {
    this.isSearchActive = false;
  }

  onSearchChange(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchSubject.next(query); // Emit the query to the searchSubject
  }
  isDarkMode: boolean = true;

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}

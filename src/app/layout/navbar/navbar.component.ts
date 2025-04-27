import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MultiSearchService } from '../../multi-search.service';
import { SearchCardComponent } from '../../search-card/search-card.component';
import { BigsearchComponent } from '../../bigsearch/bigsearch.component';
import { SharedService } from '../../shared.service';
import { LoginComponent } from '../../auth/login/login.component';
import { AuthService } from '../../services/auth.service';
import { Genres, HomepageMovie, SearchMedia } from '../../models/movie.model';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ChatbotComponent } from '../../chatbot/chatbot.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
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
  loading = false;
  error: string | null = null;
  searchTerm = '';
  items: MenuItem[] = [];
  isLoggedIn = false;
  isSearchActive = false;
  movieGenres: Genres[] = [];
  tvGenres: Genres[] = [];
  userFirstName = '';
  isAdmin = false;
  isDarkMode = true;
  isChatOpen = false;

  private searchSubject = new Subject<string>();
  private authSub!: Subscription;
  private adminViewSub!: Subscription;

  @ViewChild('overlay') overlayPanel?: OverlayPanel;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('loginComponent') loginComponent!: LoginComponent;

  constructor(
    private movieService: MultiSearchService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // 1) respond to login/logout
    this.authSub = this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.authService.getUserDetails().subscribe((user) => {
          this.userFirstName = user.firstname;
          this.isAdmin = user.is_staff === true;
          // if admin and not already in adminView, toggle on
          if (this.isAdmin && !this.authService.isAdminView()) {
            this.authService.toggleAdminView();
          }
          this.updateMenuItems();
        });
      } else {
        this.isAdmin = false;
        this.userFirstName = '';
        this.updateMenuItems();
      }
    });

    // 2) respond to adminView toggle so switch-to-regular works
    this.adminViewSub = this.authService.adminView$.subscribe((_) => {
      this.updateMenuItems();
    });

    // initial menu
    this.updateMenuItems();

    // search handling
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((q) => {
        if (!q.trim()) {
          this.movies = [];
          return;
        }
        this.loading = true;
        this.movieService.searchMovies(q).subscribe({
          next: (r) => {
            this.movies = r.results || [];
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to fetch movies';
            this.loading = false;
          },
        });
      });

    // load genres
    this.movieService.getMovieGenres().subscribe((g) => (this.movieGenres = g));
    this.movieService.getTvGenres().subscribe((g) => (this.tvGenres = g));

    // shared blur
    this.sharedService.searchBlur$.subscribe(
      () => (this.isSearchActive = false)
    );
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.adminViewSub.unsubscribe();
  }

  private updateMenuItems() {
    const base: MenuItem[] = [
      { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
    ];

    const regular: MenuItem[] = [
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

    const admin: MenuItem[] = [
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
      ...base,
      ...(this.isAdmin && this.authService.isAdminView() ? admin : regular),
    ];
  }

  onSearchChange(e: Event) {
    this.searchSubject.next((e.target as HTMLInputElement).value);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark-mode');
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  logout() {
    this.authService.logout();
    this.overlayPanel?.hide();
  }

  onSearchFocus() {
    this.isSearchActive = true;
  }
  onSearchBlur() {
    this.isSearchActive = false;
  }
}

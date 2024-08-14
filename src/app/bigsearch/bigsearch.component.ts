import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SearchCardComponent } from '../search-card/search-card.component';
import { popResultSelector } from 'rxjs/internal/util/args';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-bigsearch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    SearchCardComponent,
    DialogModule,
  ],
  templateUrl: './bigsearch.component.html',
  styleUrls: ['./bigsearch.component.css'],
})
export class BigsearchComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  searchQuery: string = '';
  filteredMovies: any[] = [];

  // Example movie data
  movieList = [
    {
      title: 'The Shawshank Redemption',
      year: 1994,
      director: 'Frank Darabont',
      duration: 142,
      genres: 'Drama',
      description:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      poster: 'shawshack-redemption.jpg',
      background: 'shawshank-backdrop.jpg',
    },
    {
      title: 'The Godfather',
      year: 1972,
      description:
        'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
      poster: 'godfather.jpg',
    },
    {
      title: 'The Dark Knight',
      year: 2008,
      description:
        'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
      poster: 'dark-knight.jpg',
      backClass: 'dark-knight-backdrop.jpg',
    },
    {
      title: 'Warcraft',
      year: 2016,
      description:
        'As an Orc horde invades the planet Azeroth using a magic portal, a few human heroes and dissenting Orcs must attempt to stop the true evil behind this war.',
      duration: 123,
      poster: 'warcraft.jpg',
      genre: 'Action, Adventure, Fantasy',
      director: 'Duncan Jones',
      background: 'warcraft-backdrop.jpg',
    },
  ];

  searchMovies() {
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      this.filteredMovies = this.movieList.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
    } else {
      this.filteredMovies = [];
    }
  }
}

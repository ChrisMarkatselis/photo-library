import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Photo } from '../../models/photo.model';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPageComponent {
  favorites$: Observable<Photo[]>;

  constructor(public favorites: FavoritesService) {
    this.favorites$ = this.favorites.getAll$();
  }

  trackByPhotoId(_: number, photo: Photo): number {
    return photo.id;
  }
}

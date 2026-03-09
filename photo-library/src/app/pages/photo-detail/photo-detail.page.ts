import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { Photo } from '../../models/photo.model';
import { FavoritesService } from '../../services/favorites.service';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-photo-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './photo-detail.page.html',
  styleUrls: ['./photo-detail.page.scss'],
})
export class PhotoDetailPageComponent implements OnInit, OnDestroy {
  photo = signal<Photo | null>(null);
  errorMessage = signal<string | null>(null);
  isLoading: WritableSignal<boolean> = signal(true);

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService,
    public favorites: FavoritesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
            switchMap((params) => {
          const id = Number(params.get('id'));
          if (Number.isNaN(id)) {
            this.errorMessage.set('Invalid photo ID.');
            this.photo.set(null);
            this.isLoading.set(false);
            return of(null);
          }

          this.errorMessage.set(null);
          this.isLoading.set(true);
          return this.photoService.getPhotoById(id);
        })
      )
      .subscribe({
        next: (photo) => {
          this.photo.set(photo ?? null);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to load photo. Try again.');
          this.isLoading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Checks if the current photo is in the favorites list.
   * Returns false if no photo is loaded.
   */
  get isFavorited(): boolean {
    return this.photo() ? this.favorites.isFavorited(this.photo()!.id) : false;
  }

  toggleFavorite(): void {
    const photo = this.photo();
    if (!photo) {
      return;
    }

    this.favorites.toggle(photo);
  }
}

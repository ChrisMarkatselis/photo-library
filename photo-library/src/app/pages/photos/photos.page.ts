import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, fromEvent, Subject, takeUntil, throttleTime } from 'rxjs';
import { Photo } from '../../models/photo.model';
import { FavoritesService } from '../../services/favorites.service';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-photos-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPageComponent implements OnInit, OnDestroy {
  photos$ = new BehaviorSubject<Photo[]>([]);
  isLoading: WritableSignal<boolean> = signal(false);

  private destroy$ = new Subject<void>();
  private currentPage = 0;

  constructor(
    private photoService: PhotoService,
    public favorites: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadMore();

    fromEvent(window, 'scroll')
      .pipe(throttleTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const threshold = document.documentElement.scrollHeight - 300;
        if (scrollPosition >= threshold) {
          this.loadMore();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByPhotoId(_: number, photo: Photo): number {
    return photo.id;
  }

  onPhotoClick(photo: Photo): void {
    this.favorites.toggle(photo);
  }

  isFavorited(photo: Photo): boolean {
    return this.favorites.isFavorited(photo.id);
  }

  private loadMore(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.photoService.getPhotos(this.currentPage).subscribe({
      next: (photos) => {
        this.photos$.next([...this.photos$.value, ...photos]);
        this.currentPage += 1;
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}

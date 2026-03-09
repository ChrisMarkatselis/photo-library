import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

const STORAGE_KEY = 'photo-library-favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly favorites$ = new BehaviorSubject<Photo[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  getAll(): Photo[] {
    return this.favorites$.value;
  }

  getAll$(): Observable<Photo[]> {
    return this.favorites$.asObservable();
  }

  isFavorited(photoId: number): boolean {
    return this.getAll().some((item) => item.id === photoId);
  }

  add(photo: Photo): void {
    if (this.isFavorited(photo.id)) {
      return;
    }

    const next = [...this.getAll(), photo];
    this.favorites$.next(next);
    this.saveToStorage(next);
  }

  remove(photoId: number): void {
    const next = this.getAll().filter((item) => item.id !== photoId);
    this.favorites$.next(next);
    this.saveToStorage(next);
  }

  toggle(photo: Photo): void {
    if (this.isFavorited(photo.id)) {
      this.remove(photo.id);
    } else {
      this.add(photo);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.favorites$.next([]);
        return;
      }

      const parsed = JSON.parse(stored) as Photo[];
      if (Array.isArray(parsed)) {
        this.favorites$.next(parsed);
      }
    } catch {
      // Ignore parse errors.
      this.favorites$.next([]);
    }
  }

  private saveToStorage(photos: Photo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch {
      // Ignore storage errors (e.g. private mode).
    }
  }
}

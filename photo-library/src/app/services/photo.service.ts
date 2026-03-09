import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private readonly baseSeed = Math.floor(Math.random() * 1_000_000);

  /**
   * Loads a page of photos with a small randomized network delay.
   */
  getPhotos(page = 0, size = 20): Observable<Photo[]> {
    const photos: Photo[] = Array.from({ length: size }, (_, idx) => {
      const id = page * size + idx + 1;
      const seed = `photo-${this.baseSeed}-${id}`;
      return this.makePhoto(id, seed);
    });

    return of(photos).pipe(delay(this.randomDelay()));
  }

  /**
   * Loads a single photo (used for the photo details route).
   */
  getPhotoById(id: number): Observable<Photo> {
    const seed = `photo-${this.baseSeed}-${id}`;
    return of(this.makePhoto(id, seed)).pipe(delay(this.randomDelay()));
  }

  private makePhoto(id: number, seed: string): Photo {
    const thumbUrl = `https://picsum.photos/seed/${seed}/360/240`;
    const fullUrl = `https://picsum.photos/seed/${seed}/1200/900`;
    return { id, thumbUrl, fullUrl };
  }

  private randomDelay(): number {
    // Emulate real-world API latency between 200-300ms.
    return 200 + Math.round(Math.random() * 100);
  }
}

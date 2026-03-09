import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const samplePhoto = {
    id: 1,
    thumbUrl: 'https://picsum.photos/seed/1/360/240',
    fullUrl: 'https://picsum.photos/seed/1/1200/900',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [FavoritesService] });
    service = TestBed.inject(FavoritesService);
  });

  it('should start with an empty list', () => {
    expect(service.getAll()).toEqual([]);
  });

  it('should add and remove a favorite', () => {
    service.add(samplePhoto);
    expect(service.getAll()).toEqual([samplePhoto]);

    service.remove(samplePhoto.id);
    expect(service.getAll()).toEqual([]);
  });

  it('should persist favorites to localStorage', () => {
    service.add(samplePhoto);

    const stored = JSON.parse(localStorage.getItem('photo-library-favorites') ?? '[]');
    expect(stored).toEqual([samplePhoto]);
  });

  it('should not add the same photo twice', () => {
    service.add(samplePhoto);
    service.add(samplePhoto);

    expect(service.getAll()).toEqual([samplePhoto]);
  });
});

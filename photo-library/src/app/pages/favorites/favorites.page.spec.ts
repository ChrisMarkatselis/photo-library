import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { FavoritesPageComponent } from './favorites.page';

const samplePhoto = {
  id: 1,
  thumbUrl: 'https://picsum.photos/seed/1/360/240',
  fullUrl: 'https://picsum.photos/seed/1/1200/900',
};

describe('FavoritesPageComponent', () => {
  let fixture: ComponentFixture<FavoritesPageComponent>;
  let favorites$: BehaviorSubject<any[]>;
  let favoritesService: Partial<FavoritesService>;

  beforeEach(async () => {
    favorites$ = new BehaviorSubject<any[]>([]);
    favoritesService = {
      getAll$: () => favorites$.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent, RouterTestingModule.withRoutes([])],
      providers: [{ provide: FavoritesService, useValue: favoritesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPageComponent);
    fixture.detectChanges();
  });

  it('should render empty state when no favorites', () => {
    favorites$.next([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No favorites yet');
  });

  it('should render favorite photos when available', () => {
    favorites$.next([samplePhoto]);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.favorite-card');
    expect(cards.length).toBe(1);
  });
});

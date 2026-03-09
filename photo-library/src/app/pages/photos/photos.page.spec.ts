import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { Photo } from '../../models/photo.model';
import { FavoritesService } from '../../services/favorites.service';
import { PhotoService } from '../../services/photo.service';
import { PhotosPageComponent } from './photos.page';

describe('PhotosPageComponent', () => {
  let fixture: ComponentFixture<PhotosPageComponent>;
  let photoService: Partial<PhotoService>;
  let favoritesService: Partial<FavoritesService>;

  const samplePhoto: Photo = {
    id: 1,
    thumbUrl: 'https://picsum.photos/seed/1/360/240',
    fullUrl: 'https://picsum.photos/seed/1/1200/900',
  };

  beforeEach(async () => {
    photoService = {
      getPhotos: vi.fn().mockReturnValue(of([samplePhoto])),
    };

    favoritesService = {
      toggle: vi.fn(),
      isFavorited: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [
        { provide: PhotoService, useValue: photoService },
        { provide: FavoritesService, useValue: favoritesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosPageComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render photo cards from the photo service', () => {
    const cards = fixture.nativeElement.querySelectorAll('.photo-card');
    expect(cards.length).toBe(1);
  });

  it('should toggle favorite when photo is clicked', () => {
    const card = fixture.nativeElement.querySelector('.photo-card');
    card.dispatchEvent(new Event('click'));
    expect((favoritesService.toggle as any)).toHaveBeenCalledWith(samplePhoto);
  });

  it('should add the favorited class to the icon when photo is favorited', () => {
    (favoritesService.isFavorited as any).mockReturnValue(true);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.favorite-icon');
    expect(icon.classList.contains('favorited')).toBe(true);
  });

  it('should stop loading when photo service errors', () => {
    (photoService.getPhotos as any).mockReturnValueOnce(throwError(() => new Error('fail')));

    fixture.componentInstance['loadMore']();
    expect(fixture.componentInstance.isLoading()).toBe(false);
  });

  it('should not call getPhotos again while already loading', () => {
    // ngOnInit already triggers loadMore once, so ensure the call count does not increase when loading is true
    const callsBefore = (photoService.getPhotos as any).mock.calls.length;

    fixture.componentInstance['isLoading'].set(true);
    fixture.componentInstance['loadMore']();

    const callsAfter = (photoService.getPhotos as any).mock.calls.length;
    expect(callsAfter).toBe(callsBefore);
  });

  it('should trigger loadMore when scrolling near bottom', async () => {
    const component = fixture.componentInstance as any;
    const loadMoreSpy = vi.spyOn(component, 'loadMore');

    component.isLoading.set(false);

    // simulate being close to bottom
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 900, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500, configurable: true });

    vi.useFakeTimers();
    window.dispatchEvent(new Event('scroll'));
    await vi.advanceTimersByTimeAsync(150);
    vi.useRealTimers();

    expect(loadMoreSpy).toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { PhotoService } from '../../services/photo.service';
import { PhotoDetailPageComponent } from './photo-detail.page';

const samplePhoto = {
  id: 1,
  thumbUrl: 'https://picsum.photos/seed/1/360/240',
  fullUrl: 'https://picsum.photos/seed/1/1200/900',
};

describe('PhotoDetailPageComponent', () => {
  let fixture: ComponentFixture<PhotoDetailPageComponent>;
  let photoService: Partial<PhotoService>;
  let favoritesService: Partial<FavoritesService>;

  beforeEach(async () => {
    photoService = {
      getPhotoById: vi.fn().mockReturnValue(of(samplePhoto)),
    };

    favoritesService = {
      toggle: vi.fn(),
      isFavorited: vi.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      imports: [PhotoDetailPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: `${samplePhoto.id}` })) },
        },
        { provide: PhotoService, useValue: photoService },
        { provide: FavoritesService, useValue: favoritesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailPageComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the photo after loading', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.src).toContain(samplePhoto.fullUrl);
  });

  it('should toggle favorite when button clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect((favoritesService.toggle as any)).toHaveBeenCalledWith(samplePhoto);
  });

  it('should display remove text when already favorited', async () => {
    await TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [PhotoDetailPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: `${samplePhoto.id}` })) },
        },
        { provide: PhotoService, useValue: photoService },
        { provide: FavoritesService, useValue: { ...favoritesService, isFavorited: () => true } },
      ],
    }).compileComponents();

    const favFixture = TestBed.createComponent(PhotoDetailPageComponent);
    favFixture.detectChanges();

    const button = favFixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Remove from favorites');
  });

  describe('when route id is invalid', () => {
    it('should show an error message and not render an image', async () => {
      await TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [PhotoDetailPageComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(convertToParamMap({ id: 'not-a-number' })) },
          },
          { provide: PhotoService, useValue: photoService },
          { provide: FavoritesService, useValue: favoritesService },
        ],
      }).compileComponents();

      const badFixture = TestBed.createComponent(PhotoDetailPageComponent);
      badFixture.detectChanges();

      expect(badFixture.componentInstance.isLoading()).toBe(false);
      expect(badFixture.nativeElement.querySelector('img')).toBeNull();
      expect(badFixture.nativeElement.textContent).toContain('Invalid photo ID');
    });
  });

  describe('when photo service errors', () => {
    it('should show an error message and stop loading when getPhotoById errors', async () => {
      await TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [PhotoDetailPageComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(convertToParamMap({ id: `${samplePhoto.id}` })) },
          },
          { provide: PhotoService, useValue: { getPhotoById: () => throwError(() => new Error('fail')) } },
          { provide: FavoritesService, useValue: favoritesService },
        ],
      }).compileComponents();

      const errorFixture = TestBed.createComponent(PhotoDetailPageComponent);
      errorFixture.detectChanges();

      expect(errorFixture.componentInstance.isLoading()).toBe(false);
      expect(errorFixture.nativeElement.querySelector('img')).toBeNull();
      expect(errorFixture.nativeElement.textContent).toContain('Failed to load photo');
    });
  });
});

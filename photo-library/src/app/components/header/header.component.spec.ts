import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule.withRoutes([
          { path: '', component: HeaderComponent },
          { path: 'favorites', component: HeaderComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark Photos view active when url is /', async () => {
    await router.navigateByUrl('/');
    fixture.detectChanges();

    expect(component.activeView).toBe('photos');

    const firstLink = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(firstLink.classList.contains('active')).toBe(true);
  });

  it('should mark Favorites view active when url starts with /favorites', async () => {
    await router.navigateByUrl('/favorites');
    fixture.detectChanges();

    expect(component.activeView).toBe('favorites');

    const anchors = Array.from(
      fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>
    );
    const favoritesLink = anchors.find((a) => a.textContent?.includes('Favorites'));
    expect(favoritesLink).toBeTruthy();
    expect(favoritesLink?.classList.contains('active')).toBe(true);
  });
});

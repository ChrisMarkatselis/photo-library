import { firstValueFrom } from 'rxjs';
import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    service = new PhotoService();
  });

  it('should return a page of photos', async () => {
    const photos = await firstValueFrom(service.getPhotos(0, 5));
    expect(photos.length).toBe(5);
    expect(photos[0].id).toBe(1);
    expect(photos[0].thumbUrl).toContain('https://picsum.photos/');
  });

  it('should return a photo by id', async () => {
    const photo = await firstValueFrom(service.getPhotoById(12));
    expect(photo.id).toBe(12);
    expect(photo.fullUrl).toContain('https://picsum.photos/');
  });
});

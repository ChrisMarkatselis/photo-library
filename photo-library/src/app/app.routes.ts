import { Routes } from '@angular/router';
import { FavoritesPageComponent } from './pages/favorites/favorites.page';
import { PhotoDetailPageComponent } from './pages/photo-detail/photo-detail.page';
import { PhotosPageComponent } from './pages/photos/photos.page';

export const routes: Routes = [
  { path: '', component: PhotosPageComponent, title: 'Photos' },
  { path: 'favorites', component: FavoritesPageComponent, title: 'Favorites' },
  { path: 'photos/:id', component: PhotoDetailPageComponent, title: 'Photo' },
  { path: '**', redirectTo: '' },
];

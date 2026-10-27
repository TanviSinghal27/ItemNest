import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Addproduct } from './components/addproduct/addproduct';
import { Editproduct } from './components/editproduct/editproduct';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'dashboard', component: Dashboard },
  { path: 'add', component: Addproduct },
  { path: 'edit/:id', component: Editproduct },
  { path: '**', component: NotFound },
];

import { Routes } from '@angular/router';
import { Candidate } from './component/candidate/candidate';
import { Dashboard } from './component/dashboard/dashboard';

export const routes: Routes = [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'candidates', component: Candidate },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'dashboard' },
];

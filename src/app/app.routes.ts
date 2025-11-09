import { Routes } from '@angular/router';
import { Candidate } from './component/candidate/candidate';
import { Dashboard } from './component/dashboard/dashboard';
import { ViewCandidate } from './component/candidate/view-candidate/view-candidate';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'candidates', component: Candidate },
  { path: 'candidates/view', component: ViewCandidate },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'dashboard' },
];

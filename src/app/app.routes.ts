import { Routes } from '@angular/router';
import { Candidate } from './component/candidate/candidate';
import { Dashboard } from './component/dashboard/dashboard';
import { ViewCandidate } from './component/candidate/view-candidate/view-candidate';
import { CreateCandidate } from './component/candidate/create-candidate/create-candidate';
import { CandidateProceedFurther } from './component/candidate/candidate-proceed-further/candidate-proceed-further';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'candidates', component: Candidate },
  { path: 'candidates/view/:id', component: ViewCandidate },
  { path: 'candidates/create', component: CreateCandidate },
  { path: 'candidates/proceed/:id', component: CandidateProceedFurther },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'dashboard' },
];

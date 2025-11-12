import { Routes } from '@angular/router';
import { Candidate } from './component/candidate/candidate';
import { Dashboard } from './component/dashboard/dashboard';
import { ViewCandidate } from './component/candidate/view-candidate/view-candidate';
import { CreateCandidate } from './component/candidate/create-candidate/create-candidate';
import {CandidateProceedComponent} from './component/candidate/candidate-proceed/candidate-proceed.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'candidates', component: Candidate },
  { path: 'candidates/view/:id', component: ViewCandidate },
  { path: 'candidates/create', component: CreateCandidate },
  { path: 'candidates/proceed/:id', component: CandidateProceedComponent },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'dashboard' },
];

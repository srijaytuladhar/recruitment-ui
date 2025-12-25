import { Routes } from '@angular/router';
import { Candidate } from './component/candidate/candidate';
import { Dashboard } from './component/dashboard/dashboard';
import { ViewCandidate } from './component/candidate/view-candidate/view-candidate';
import { CreateCandidate } from './component/candidate/create-candidate/create-candidate';
import { CandidateProceedFurtherComponent } from './component/candidate/candidate-proceed-further/candidate-proceed-further';
import {ViewClientDetailsComponent} from './component/client-details/view-client-details/view-client-details.component';
import {
  CreateClientDetailsComponent
} from './component/client-details/create-client-details/create-client-details.component';
import {ClientDetailsComponent} from './component/client-details/client-details.component';
import {JobDetailsComponent} from './component/job-details/job-details.component';
import {ViewJobDetailsComponent} from './component/job-details/view-job-details/view-job-details.component';
import {CreateJobDetailsComponent} from './component/job-details/create-job-details/create-job-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'client', component: ClientDetailsComponent },
  { path: 'client/view/:id', component: ViewClientDetailsComponent },
  { path: 'client/create', component: CreateClientDetailsComponent },
  { path: 'job-details', component: JobDetailsComponent },
  { path: 'job-details/view/:id', component: ViewJobDetailsComponent },
  { path: 'job-details/create', component: CreateJobDetailsComponent },
  { path: 'candidates', component: Candidate },
  { path: 'candidates/view/:id', component: ViewCandidate },
  { path: 'candidates/create', component: CreateCandidate },
  { path: 'candidates/proceed/:id', component: CandidateProceedFurtherComponent },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'dashboard' },

];

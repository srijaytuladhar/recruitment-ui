import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PathConfig } from '../config/path-config';

export class CandidateProcess {
  id?: string;
  candidateId?: string;
  jobId?: string;
  resumeSource?: string;
  interviewMode?: string;
  interviewDate?: Date;
  interviewName?: string;
  interviewFor?: string;
  interviewRemarks?: string;
  profileAssessment?: string;
  profileForwardedDate?: Date;
  followUp1Date?: Date;
  followUp2Date?: Date;
  followUp3Date?: Date;
  clientInterviewDate?: Date;
  clientInterviewRounds?: number;
  clientInterviewAssessment?: string;
  clientSelectionOfferDate?: Date;
  offerAmount?: number;
  offerStartDate?: Date;
  currentStep?: number;
  status?: 'IN_PROGRESS' | 'COMPLETED';
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private baseUrl = PathConfig.API_ENDPOINT + 'api/candidate';

  constructor(private http: HttpClient) { }

  fetchAllCandidate() {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  createCandidate(data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/create`, data);
  }

  fetchCandidateById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/detail/${id}`);
  }

  getPreScreening(candidateId: string) {
    return this.http.get<any>(`${this.baseUrl}/pre-screening/${candidateId}`);
  }

  savePreScreening(process: CandidateProcess) {
    return this.http.post<any>(`${this.baseUrl}/pre-screening`, process);
  }

  getJobProcess(candidateId: string, jobId: string) {
    return this.http.get<any>(`${this.baseUrl}/job-process/${candidateId}?jobId=${jobId}`);
  }

  saveJobProcess(process: CandidateProcess) {
    return this.http.post<any>(`${this.baseUrl}/job-process`, process);
  }

  getJobProcessesByJob(jobId: string) {
    return this.http.get<any>(`${this.baseUrl}/job-process/job/${jobId}`);
  }



  fetchDropdown() {
    return this.http.get<any[]>(PathConfig.API_ENDPOINT + `dropdown/fetchJobList`);
  }

  fetchCandidatesByIds(candidateIds: string[]) {
    return this.http.post<any>(`${this.baseUrl}/by-ids`, { candidateIds });
  }
}

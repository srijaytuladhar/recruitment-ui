import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-view-candidate',
  imports: [ButtonModule],
  templateUrl: './view-candidate.html',
  styleUrl: './view-candidate.css',
})
export class ViewCandidate {

  constructor(
    private router: Router
  ) {

  }
   navigateTo(path: string) {
    this.router.navigate([path]);
  }
}

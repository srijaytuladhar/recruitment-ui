import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-candidate-proceed-further',
  imports: [ButtonModule],
  templateUrl: './candidate-proceed-further.html',
  styleUrl: './candidate-proceed-further.css',
})
export class CandidateProceedFurther {

  constructor(
    private router: Router
  ) {

  }

  goBack() {
    this.router.navigate(['/candidates']);
  }
}

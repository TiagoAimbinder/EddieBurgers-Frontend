import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
    constructor(private router: Router) { }


}

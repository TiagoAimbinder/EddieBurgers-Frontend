import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from 'src/app/core/services/ReviewService/review.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  reviewForm!: FormGroup;
  menus: any[] = [];

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      userxr_name: ['', Validators.required],
      userxr_email: ['', [Validators.required, Validators.email]],
      userxr_phone: ['', Validators.required],
      men_id: ['', Validators.required],
      mxr_star: ['', Validators.required],
      rev_message: ['']
    });

    this._loadMenus();
  }

  private _loadMenus(): void {
    this.reviewService.getAllMenu().subscribe({
      next: (res: any) => this.menus = res.menus,
      error: (err) => console.error('Error al cargar menús:', err)
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.reviewService.createReview(this.reviewForm.value).subscribe({
        next: (res) => alert('Reseña enviada correctamente!'),
        error: (err) => console.error('Error al crear reseña:', err)
      });
    }
  }
}


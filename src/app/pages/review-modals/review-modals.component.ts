import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalReviewComponent } from 'src/app/core/components/modal-review/modal-review.component';
import Swal from 'sweetalert2';
import { ReviewService } from 'src/app/core/services/ReviewService/review.service';

@Component({
  selector: 'app-review-modals',
  standalone: true,
  imports: [CommonModule, ModalReviewComponent, ReactiveFormsModule],
  templateUrl: './review-modals.component.html',
  styleUrls: ['./review-modals.component.css']
})
export class ReviewModalsComponent implements OnInit {

  reviewForm!: FormGroup;
  menus: any[] = [];
  private reviewService: ReviewService = inject(ReviewService); 
  private fb: FormBuilder = inject(FormBuilder);
  
  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      men_id: ['', Validators.required],
      review_message: ['']
    });

    this._loadMenus();
  }

  public Quest: Record<number, { askId: string, ask: string, text: string }> = {
    1: { askId: 'q1', ask: '¿Cómo calificas tu experiencia de hoy?', text: 'Tu opinión nos importa' },
    2: { askId: 'q2', ask: '¿Como calificas la atención en caja?', text: 'Tu opinión nos importa' },
    3: { askId: 'q3', ask: '¿Cómo calificas la calidad de la hamburguesa?', text: 'Tu opinión nos importa' },
    4: { askId: 'q4', ask: '¿Cómo calificas el tiempo de demora?', text: 'Tu opinión nos importa' }
  };

  private _loadMenus(): void {
    this.reviewService.getAllMenu().subscribe({
      next: (res: any) => this.menus = res.menus,
      error: (err) => console.error('Error al cargar menús:', err)
    });
  }

  public answers: { [key: string]: number } = {};
  public currentIndex: number = 1;

  public receptReview = (obj: { value: number, askId: string }) => {
    this.answers[obj.askId] = obj.value;
    this.currentIndex++;
  };

  onSubmit(): void {
  if (this.reviewForm.invalid) { 
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, seleccioná un menú.',
      confirmButtonText: 'Aceptar'
    });
    return; 
  }

  this.currentIndex = 10; 

  const obj = {
    men_id: this.reviewForm.value.men_id,
    review_message: this.reviewForm.value.review_message,
    q1: this.answers["q1"] || null,
    q2: this.answers["q2"] || null,
    q3: this.answers["q3"] || null,
    q4: this.answers["q4"] || null
  };

  this.reviewService.createExperienceReview(obj).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: '¡Gracias!',
        text: 'Tu reseña se ha guardado correctamente.',
        confirmButtonText: 'Aceptar'
      });
    },
    error: (err) => {
      console.error("Error al crear reseña", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al guardar la reseña.',
        confirmButtonText: 'Aceptar'
      });
    }
  });
}
}

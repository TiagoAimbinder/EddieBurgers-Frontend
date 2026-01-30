import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from 'src/app/core/services/ReviewService/review.service';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';

interface Review {
  exp_id: number;
  menu: { men_id: number; men_name: string } | null;
  review_message: string;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
}

interface MenuStats {
  total: number;
  sumStars: number;
  avgStars?: string;
}

interface FilteredReview {
  userName: string;
  message: string;
  stars: number;
}

@Component({
  selector: 'app-review-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './review-stats.component.html',
  styleUrls: ['./review-stats.component.css']
})
export class ReviewStatsComponent implements OnInit {
  reviews: Review[] = [];
  stats: Record<string, MenuStats> = {};
  menus: string[] = [];
  selectedMenu: string = '';
  filteredReviews: FilteredReview[] = [];
  selectedMenuSearch: string = '';

  experienceStats: any = {};

  emojiMap = [
    { value: 1, icon: '😞' },
    { value: 2, icon: '😐' },
    { value: 3, icon: '😊' },
    { value: 4, icon: '😍' },
    { value: 5, icon: '🤩' }
  ];

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    // 👉 Nuevo: traer reviews desde ExperienceReview
    this.reviewService.getAllExperienceReviews().subscribe({
      next: (res: any) => {
        this.reviews = Array.isArray(res) ? res : res.reviews || [];
        console.log('Reviews de ExperienceReview recibidas:', this.reviews);
        this.calculateStats();
      },
      error: (err) => console.error('Error al obtener reviews de experiencia:', err)
    });

    // Traer estadísticas de experiencia
    this.reviewService.getExperienceStats().subscribe({
      next: (res: any) => {
        this.experienceStats = res;
        console.log('📊 Stats de experiencia recibidas:', this.experienceStats);
      },
      error: (err) => console.error('Error al obtener stats de experiencia:', err)
    });
  }

  onSearchChange() {
    const search = this.selectedMenuSearch.toLowerCase();
    this.menus = Object.keys(this.stats).filter(menu => menu.toLowerCase().includes(search));
  }

  onSelectMenu(menu: string) {
    this.selectedMenu = menu;
    this.selectedMenuSearch = menu;
    this.onMenuChange();
  }

  calculateStats(): void {
    const menuStats: Record<string, MenuStats> = {};

    this.reviews.forEach((item) => {
      if (!item.menu || !item.menu.men_name) return;

      const menuName = item.menu.men_name;
      if (!menuStats[menuName]) menuStats[menuName] = { total: 0, sumStars: 0 };
      menuStats[menuName].total += 1;
      menuStats[menuName].sumStars += item.q1 || 0; // Usamos q1 como proxy de "stars"
    });

    for (const menu in menuStats) {
      menuStats[menu].avgStars = (menuStats[menu].sumStars / menuStats[menu].total).toFixed(2);
    }

    this.stats = menuStats;
    this.menus = Object.keys(this.stats).sort((a, b) => this.stats[b].total - this.stats[a].total);
    console.log('Stats calculadas y ordenadas:', this.stats);
  }

  onMenuChange(): void {
    if (!this.selectedMenu) {
      this.filteredReviews = [];
      return;
    }

    this.filteredReviews = this.reviews
      .filter((item) => item.menu?.men_name === this.selectedMenu)
      .map((item) => ({
        userName: 'Anónimo', // No tenemos usuarios en ExperienceReview
        message: item.review_message || '',
        stars: item.q1 || 0
      }));
  }

  getMenuNames(): string[] {
    return this.menus;
  }

  getCountFor(question: string, value: number): number {
    if (!this.experienceStats || !this.experienceStats[question]) return 0;
    const found = this.experienceStats[question].find((s: any) => s.value === value);
    return found ? found.count : 0;
  }

  getExperienceKeys(): string[] {
    return Object.keys(this.experienceStats || {});
  }

  getQuestionLabel(question: string): string {
    const labels: Record<string, string> = {
      q1: '¿Como calificas tu experiencia de hoy?',
      q2: '¿Como calificas la atención en caja?',
      q3: '¿Cómo calificas la calidad de la hamburguesa?',
      q4: '¿Cómo calificas el tiempo de demora?'
    };
    return labels[question] || question;
  }
}

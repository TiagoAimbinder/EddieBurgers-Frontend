import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from 'src/app/core/services/ReviewService/review.service';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';

interface Review {
  men_id: number;
  mxr_id: number;
  mxr_star: number;
  menu: { men_id: number; men_name: string } | null;
  rev_id: number;
  review: {
    rev_id: number;
    rev_message: string;
    usu_id?: number;
    usuxr_name?: string;
    usuxr_email?: string;
  };
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

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getAllReviewsWithMenus().subscribe({
      next: (res: any) => {
        this.reviews = Array.isArray(res) ? res : res.reviews || [];
        console.log('Reviews recibidas:', this.reviews);
        this.calculateStats();
      },
      error: (err) => console.error('Error al obtener reseñas:', err)
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
      // Ignorar reseñas con menú eliminado
      if (!item.menu || !item.menu.men_name) return;

      const menuName = item.menu.men_name;
      if (!menuStats[menuName]) menuStats[menuName] = { total: 0, sumStars: 0 };
      menuStats[menuName].total += 1;
      menuStats[menuName].sumStars += item.mxr_star;
    });

    // Calcular promedio de estrellas
    for (const menu in menuStats) {
      menuStats[menu].avgStars = (menuStats[menu].sumStars / menuStats[menu].total).toFixed(2);
    }

    this.stats = menuStats;

    // Ordenar menús de mayor a menor según total de reseñas
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
        userName: item.review.usuxr_name || item.review.usuxr_email || 'Anónimo',
        message: item.review.rev_message,
        stars: item.mxr_star
      }));
  }

  getMenuNames(): string[] {
    return this.menus;
  }
}

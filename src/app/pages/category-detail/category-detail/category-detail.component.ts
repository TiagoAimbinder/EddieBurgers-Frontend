import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,RouterModule } from '@angular/router';
import { RecipeService } from 'src/app/core/services/RecipeService/recipe.service';
import { SuppliesService } from 'src/app/core/services/SuppliesService/supplies.service';
import { CategoriesService } from 'src/app/core/services/CategoriesService/categories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, NgFor, NgIf, DecimalPipe,RouterModule],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

  cat_id: number = 0;
  category: any = null; // Datos de la hamburguesa (nombre, %)
  recipeItems: any[] = []; // Lista de ingredientes cargados
  allSupplies: any[] = []; // Lista de insumos para el select
  
  // Formulario Agregar
  selectedSupplyId: number | null = null;
  selectedQuantity: number = 1;

  // Calculadora
  totalCost: number = 0;
  suggestedPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private suppliesService: SuppliesService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cat_id = Number(params['cat_id']);
      this.loadData();
    });
  }

  async loadData() {
    await this.loadCategoryInfo();
    await this.loadSupplies();
    await this.loadRecipe();
  }

  async loadCategoryInfo() {
    // Truco: Traemos todas y buscamos la nuestra (si no tienes endpoint específico)
    (await this.categoriesService.getAllCategories()).subscribe({
      next: (data: any) => {
        this.category = data.categories.find((c: any) => c.cat_id === this.cat_id);
        this.calculateTotals(); // Recalcular cuando tengamos el %
      }
    });
  }

  async loadSupplies() {
    (await this.suppliesService.getAllSupplies()).subscribe({
      next: (data: any) => this.allSupplies = data.data
    });
  }

  async loadRecipe() {
    (await this.recipeService.getRecipeByCatId(this.cat_id)).subscribe({
      next: (data: any) => {
        // El backend devuelve una lista con la relación.
        // Asegúrate que el backend incluya el precio del supply en la respuesta o cruza datos.
        // Si el backend no devuelve el precio del insumo en el join, lo cruzamos aquí:
        this.recipeItems = data.data.map((item: any) => {
            // Buscamos el precio en la lista de todos los insumos si no viene
            const sup = this.allSupplies.find(s => s.sup_id === item.sup_id);
            return {
                ...item,
                sup_name: sup ? sup.sup_name : 'Insumo',
                sup_price: sup ? sup.sup_price : 0
            };
        });
        this.calculateTotals();
      }
    });
  }

  // --- ACCIONES ---

  async addIngredient() {
    if (!this.selectedSupplyId || this.selectedQuantity <= 0) return;

    const payload = {
        cat_id: this.cat_id,
        sup_id: this.selectedSupplyId,
        cxs_quantity: this.selectedQuantity
    };

    (await this.recipeService.addIngredient(payload)).subscribe({
        next: () => {
            this.loadRecipe(); // Recargar lista
            this.selectedSupplyId = null;
            this.selectedQuantity = 1;
            this._toast('Ingrediente agregado');
        },
        error: () => this._alert('Error al agregar')
    });
  }

  async removeIngredient(cxs_id: number) {
    (await this.recipeService.removeIngredient(cxs_id)).subscribe({
        next: () => {
            this.loadRecipe();
            this._toast('Ingrediente eliminado');
        }
    });
  }

  calculateTotals() {
    if (!this.category) return;

    // 1. Costo
    this.totalCost = this.recipeItems.reduce((acc, item) => {
        return acc + (item.sup_price * item.cxs_quantity);
    }, 0);

    // 2. Precio Venta
    const profit = this.totalCost * (this.category.cat_profit_percent / 100);
    this.suggestedPrice = this.totalCost + profit;
  }

  // --- UTILS ---
  _alert(msg: string) { Swal.fire('Error', msg, 'error'); }
  _toast(msg: string) { 
    const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    Toast.fire({ icon: 'success', title: msg });
  }
}
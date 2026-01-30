import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoriesService } from 'src/app/core/services/CategoriesService/categories.service'; 

@Component({
  selector: 'app-categories', 
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriasComponent implements OnInit { 

  public categories: any[] = [];
  public categoriesOriginal: any[] = []; 
  public sec_id: number = 0; 
  public usu_id: number = 0;

  public showModalCreate: boolean = false;
  public showModalModify: boolean = false;
  public spinnerLoader: boolean = false;

  public formCategoryCreate: FormGroup;
  public formCategory: FormGroup;
  
  public selectedCatId: number | null = null;

  constructor(
    private categoriesService: CategoriesService, 
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.usu_id = Number(localStorage.getItem('usu_id'));

    this.formCategoryCreate = this.formBuilder.group({
      cat_name: ['', Validators.required],
      cat_profit_percent: ['', Validators.required]
    });

    this.formCategory = this.formBuilder.group({
      cat_name: ['', Validators.required],
      cat_profit_percent: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.sec_id = Number(params['sec_id']); 
      this._getAllCategories();
    });
  }

  // --- OBTENER CATEGORÍAS ---
private async _getAllCategories() {
    try {
      (await this.categoriesService.getAllCategories(this.sec_id)).subscribe({
        next: (data: any) => {
          const list = data.categories || [];
          
          // --- FILTRO MAGICO ---
          // Solo mostramos las categorías que coincidan con la sección actual
          if (this.sec_id) {
             this.categories = list.filter((cat: any) => cat.sec_id === this.sec_id);
          } else {
             this.categories = list;
          }
          
          this.categoriesOriginal = this.categories;
        },
        error: (err: any) => {
          console.error(err);
          this.categories = [];
        }
      });
    } catch (error) {
       console.error(error);
    }
  }

  public onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    if (!term) {
      this.categories = this.categoriesOriginal;
      return;
    }
    this.categories = this.categoriesOriginal.filter((cat: any) => 
      cat.cat_name.toLowerCase().includes(term)
    );
  }

  public onClickAddCategory() {
    this.showModalCreate = true;
    this.showModalModify = false;
    this.formCategoryCreate.reset();
  }

  public onClickModify(cat_id: number) {
    this.selectedCatId = cat_id;
    this.showModalModify = true;
    this.showModalCreate = false;

    const cat = this.categories.find((c: any) => c.cat_id === cat_id);
    if (cat) {
      this.formCategory.patchValue({
        cat_name: cat.cat_name,
        cat_profit_percent: cat.cat_profit_percent
      });
    }
  }

  public onClickCancel() {
    this.showModalCreate = false;
    this.showModalModify = false;
    this.formCategoryCreate.reset();
    this.formCategory.reset();
  }

  // --- CREAR ---
  public async submitFormCreate() {
    if (this.formCategoryCreate.invalid) {
      this._alert('warning', 'Atención', 'Complete todos los campos');
      return;
    }

    this.spinnerLoader = true;
    
    // PREPARAMOS LOS DATOS PARA EVITAR ERROR 400
    const data = {
      ...this.formCategoryCreate.value,
      // Aseguramos que el porcentaje sea número
      cat_profit_percent: Number(this.formCategoryCreate.value.cat_profit_percent),
      sec_id: Number(this.sec_id),
      usu_id: Number(this.usu_id)
    };

    (await this.categoriesService.createCategories(data)).subscribe({
      next: () => {
        this.spinnerLoader = false;
        this.showModalCreate = false; 
        this._getAllCategories();
        this._alert('success', 'Éxito', 'Categoría creada correctamente');
      },
      error: (err: any) => {
        this.spinnerLoader = false;
        this._alert('error', 'Error', 'No se pudo crear la categoría');
      }
    });
  }

  // --- ACTUALIZAR (AQUÍ ESTABA EL PROBLEMA) ---
  public async submitForm() {
    if (this.formCategory.invalid) {
      this._alert('warning', 'Atención', 'Complete todos los campos');
      return;
    }

    this.spinnerLoader = true;

    // PREPARAMOS LOS DATOS: Convertimos a número y agregamos ID por si acaso
    const data = {
        ...this.formCategory.value,
        cat_profit_percent: Number(this.formCategory.value.cat_profit_percent), // <-- Importante
        cat_id: Number(this.selectedCatId) // <-- Importante
    };

    // Llamamos a updateCategory respetando la firma de tu servicio
    // Orden probable: (data, cat_id, usu_id) o (categories, cat_id, usu_id)
    (await this.categoriesService.updateCategory(data, this.selectedCatId!, this.usu_id)).subscribe({
      next: () => {
        this.spinnerLoader = false;
        this.showModalModify = false; // <--- ESTO CIERRA EL CARTEL
        this._getAllCategories();
        this._alert('success', 'Éxito', 'Categoría actualizada correctamente');
      },
      error: (err: any) => {
        this.spinnerLoader = false;
        // Si sigue el error, imprime esto en consola para ver qué dice el backend
        console.error("Error al actualizar:", err);
        this._alert('error', 'Error', 'No se pudo actualizar la categoría');
      }
    });
  }

  // --- ELIMINAR ---
  public onClickDelete(cat_id: number, cat_name: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar la categoría "${cat_name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6b6b',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#252525',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        (await this.categoriesService.deleteCategory(cat_id)).subscribe({
          next: () => {
            this._getAllCategories();
            this._alert('success', 'Eliminado', 'Categoría eliminada');
          },
          error: (err: any) => {
            this._alert('error', 'Error', 'No se pudo eliminar');
          }
        });
      }
    });
  }

  private _alert(icon: any, title: string, text: string) {
    Swal.fire({
      icon,
      title,
      text,
      background: '#252525',
      color: '#fff',
      confirmButtonColor: '#4ecdc4'
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { ReviewService } from 'src/app/core/services/ReviewService/review.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-review-menu',
  standalone: true,
  imports: [CommonModule,NavbarComponent, NgFor],
  templateUrl: './review-menu.component.html',
  styleUrls: ['./review-menu.component.css']
})

export class ReviewMenuComponent implements OnInit {
  menus: any[] = [];

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this._getAllMenu();
  }

  private _getAllMenu(): void {
    this.reviewService.getAllMenu().subscribe({
      next: (res: any) => {
        this.menus = res.menus; // 👈 según tu backend
      },
      error: (err) => {
        console.error('Error al obtener menús:', err);
      }
    });
  }

  addMenu(): void {
    Swal.fire({
      title: 'Agregar Menú',
      input: 'text',
      inputLabel: 'Nombre del menú',
      inputPlaceholder: 'Ej: Hamburguesa doble',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'El nombre no puede estar vacío';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.reviewService.createMenu(result.value).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Menú creado correctamente', 'success');
            this._getAllMenu(); // recargar la lista
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo crear el menú', 'error');
          }
        });
      }
    });
  }

    editMenu(menu: any) {
      const nuevoNombre = prompt("Nuevo nombre para el menú:", menu.men_name);
      if (nuevoNombre) {
        this.reviewService.updateMenu(menu.men_id, nuevoNombre).subscribe({
          next: () => this._getAllMenu(), // recarga la tabla
          error: (err) => console.error("Error al actualizar:", err)
        });
      }
    }

  deleteMenu(menu: any) {
    if (confirm(`¿Seguro que quieres eliminar el menú "${menu.men_name}"?`)) {
      this.reviewService.deleteMenu(menu.men_id).subscribe({
        next: () => this._getAllMenu(), // recarga la tabla
        error: (err) => console.error("Error al eliminar:", err)
      });
    }
  }

}


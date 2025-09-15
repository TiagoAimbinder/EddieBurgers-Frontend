import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { ReviewService } from 'src/app/core/services/ReviewService/review.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-menu',
  standalone: true,
  imports: [CommonModule, NavbarComponent, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './review-menu.component.html',
  styleUrls: ['./review-menu.component.css']
})
export class ReviewMenuComponent implements OnInit {
  menus: any[] = [];

  showModalCreate: boolean = false;
  showModalModify: boolean = false;

  formMenuCreate: FormGroup;
  formMenuModify: FormGroup;
  spinnerLoader: boolean = false;

  private _menuSelected: any;

  constructor(private reviewService: ReviewService, private fb: FormBuilder) {
    this.formMenuCreate = this._initForm();
    this.formMenuModify = this._initForm();
  }

  ngOnInit(): void {
    this._getAllMenu();
  }

  private _initForm(): FormGroup {
    return this.fb.group({
      men_name: ['', Validators.required],
      men_id: ['']
    });
  }

  private _getAllMenu(): void {
    this.reviewService.getAllMenu().subscribe({
      next: (res: any) => this.menus = res.menus,
      error: (err) => console.error('Error al obtener menús:', err)
    });
  }

  // Abrir modal para crear
  onClickAddMenu() {
    this.showModalCreate = true;
    this.formMenuCreate.reset();
    this._menuSelected = null;
  }

  // Abrir modal para modificar
  onClickModify(menu: any) {
    this.showModalModify = true;
    this._menuSelected = menu.men_id;
    this.formMenuModify.patchValue({
      men_id: menu.men_id,
      men_name: menu.men_name
    });
  }

  // Cancelar modales
  onClickCancel() {
    this.showModalCreate = false;
    this.showModalModify = false;
    this.formMenuCreate.reset();
    this.formMenuModify.reset();
  }

  // Crear menú
  submitFormCreate() {
    if (!this.formMenuCreate.valid) return this._alert(2, 'Error', 'Faltan campos por rellenar');

    this.spinnerLoader = true;

    this.reviewService.createMenu(this.formMenuCreate.value.men_name).subscribe({
      next: () => {
        this._getAllMenu();
        this.showModalCreate = false;
        this.spinnerLoader = false;
        this._alert(1, 'Menú creado', 'El menú se creó correctamente');
      },
      error: (err) => {
        console.error(err);
        this.spinnerLoader = false;
        this._alert(2, 'Error', 'No se pudo crear el menú');
      }
    });
  }

  // Modificar menú
  submitFormModify() {
    if (!this.formMenuModify.valid) return this._alert(2, 'Error', 'Faltan campos por rellenar');

    this.spinnerLoader = true;

    this.reviewService.updateMenu(this._menuSelected, this.formMenuModify.value.men_name).subscribe({
      next: () => {
        this._getAllMenu();
        this.showModalModify = false;
        this.spinnerLoader = false;
        this._alert(1, 'Menú actualizado', 'El menú se actualizó correctamente');
      },
      error: (err) => {
        console.error(err);
        this.spinnerLoader = false;
        this._alert(2, 'Error', 'No se pudo actualizar el menú');
      }
    });
  }

  // Eliminar menú
  deleteMenu(menu: any) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás por eliminar el menú ${menu.men_name}`,
      icon: "warning",
      background: 'var(--secondary-color)',
      color: 'var(--light-color)',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: 'var(--main-color)',
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteMenu(menu.men_id).subscribe({
          next: () => {
            this._getAllMenu();
            this._alert(1, 'Eliminado', 'El menú ha sido eliminado');
          },
          error: (err) => this._alert(2, 'Error', 'No se pudo eliminar el menú')
        });
      }
    });
  }

  private _alert(type: number, title: string, text: string) {
    Swal.fire({
      icon: type === 1 ? 'success' : 'error',
      title,
      text,
      color: "var(--main-color)",
      background: "var(--secondary-color)",
      confirmButtonColor: "var(--main-color)",
    });
  }
}

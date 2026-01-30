import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SectionsService } from 'src/app/core/services/SectionsService/sections.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {
  
  public sections: any[] = [];
  public allSections: any[] = [];
  
  public showModalCreate: boolean = false;
  public formSection: FormGroup;
  public spinnerLoader: boolean = false;
  
  // VARIABLE PARA SABER SI EDITAMOS
  public selectedSecId: number | null = null; 

  constructor(
    private sectionsService: SectionsService,
    private formBuilder: FormBuilder
  ) {
    this.formSection = this.formBuilder.group({
      sec_name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._getAllSections();
  }

  private _getAllSections = async () => {
    (await this.sectionsService.getAllSections()).subscribe({
      next: (data: any) => {
        this.allSections = data.data || [];
        this.sections = this.allSections;
      },
      error: (err) => console.error(err)
    });
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase();
    if (!term) {
      this.sections = this.allSections;
      return;
    }
    this.sections = this.allSections.filter(sec => 
      sec.sec_name.toLowerCase().includes(term)
    );
  }

  // --- ACCIONES ---

  // Abrir modal para CREAR
  onClickAdd() {
    this.showModalCreate = true;
    this.selectedSecId = null; // Modo Crear
    this.formSection.reset();
  }

  // Abrir modal para EDITAR
  onClickEdit(sec: any) {
    this.showModalCreate = true;
    this.selectedSecId = sec.sec_id; // Modo Editar
    this.formSection.patchValue({ sec_name: sec.sec_name });
  }

  // ELIMINAR
  onClickDelete(sec_id: number, name: string) {
    Swal.fire({
      title: "¿Borrar Sección?",
      text: `Se eliminará "${name}". Cuidado: Esto podría borrar todas las categorías dentro.`,
      icon: "warning",
      background: 'var(--secondary-color)', color: 'white',
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      confirmButtonColor: '#d33',
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        (await this.sectionsService.deleteSection(sec_id)).subscribe({
          next: () => {
            this._alert(1, 'Eliminado', 'Sección eliminada');
            this._getAllSections();
          },
          error: () => this._alert(2, 'Error', 'No se pudo eliminar')
        });
      }
    });
  }

  // GUARDAR (Crea o Edita)
  async submitForm() {
    this.spinnerLoader = true;
    if (this.formSection.invalid) {
        this.spinnerLoader = false;
        return;
    }

    const payload = this.formSection.value;

    if (this.selectedSecId) {
        // ACTUALIZAR
        (await this.sectionsService.updateSection(payload, this.selectedSecId)).subscribe({
            next: () => {
                this._alert(1, 'Actualizado', 'Sección editada correctamente');
                this._finalize();
            },
            error: () => {
                this._alert(2, 'Error', 'No se pudo editar');
                this.spinnerLoader = false;
            }
        });
    } else {
        // CREAR
        (await this.sectionsService.createSection(payload)).subscribe({
            next: () => {
                this._alert(1, 'Creado', 'Sección creada correctamente');
                this._finalize();
            },
            error: () => {
                this._alert(2, 'Error', 'No se pudo crear');
                this.spinnerLoader = false;
            }
        });
    }
  }

  _finalize() {
    this._getAllSections();
    this.showModalCreate = false;
    this.formSection.reset();
    this.spinnerLoader = false;
  }

  private _alert(type: number, title: string, text: string) {
    Swal.fire({
      icon: type === 1 ? 'success' : 'error',
      title: title, text: text,
      color: "var(--main-color)", background: "var(--secondary-color)", confirmButtonColor: "var(--main-color)"
    });
  }
}
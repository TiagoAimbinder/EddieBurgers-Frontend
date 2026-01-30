import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SuppliesService } from 'src/app/core/services/SuppliesService/supplies.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplies',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, FormsModule, NgFor, NgIf],
  templateUrl: './supplies.component.html',
  styleUrls: ['./supplies.component.css']
})
export class SuppliesComponent implements OnInit {

  public showModalCreate: boolean = false;
  public formSupply: FormGroup;
  public spinnerLoader: boolean = false;
  public supplies: any[] = [];
  public allSupplies: any[] = [];
  
  // 1. Variable clave para controlar Edición vs Creación
  public selectedSupplyId: number | null = null; 

  constructor(
    private suppliesService: SuppliesService,
    private formBuilder: FormBuilder
  ) {
    this.formSupply = this.formBuilder.group({
      sup_name: ['', Validators.required],
      sup_price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this._getAllSupplies();
  }

  private _getAllSupplies = async () => {
    (await this.suppliesService.getAllSupplies()).subscribe({
          next: (data: any) => {
            this.allSupplies = data.data; // <--- Guardamos TODO aquí
            this.supplies = this.allSupplies; // <--- Inicialmente mostramos todo
          },
          error: (err: any) => console.error(err)
    });
  }

  onSearch(event: any) {
    const term = event.target.value.toLowerCase(); // Convertimos a minúsculas para buscar bien

    // Si no hay texto, volvemos a mostrar todo
    if (!term) {
      this.supplies = this.allSupplies;
      return;
    }

    // Filtramos la lista maestra
    this.supplies = this.allSupplies.filter(item => 
      item.sup_name.toLowerCase().includes(term)
    );
  }

  // --- MODO CREAR (Limpio) ---
  onClickAddSupply() {
    this.showModalCreate = true;
    this.selectedSupplyId = null; // Ponemos NULL para indicar que es nuevo
    this.formSupply.reset();
  }

  // --- MODO EDITAR (Cargar datos) ---
  onClickEdit(supply: any) {
    this.showModalCreate = true;
    this.selectedSupplyId = supply.sup_id; // Guardamos el ID para usarlo al guardar
    
    // Rellenamos el formulario con los datos existentes
    this.formSupply.patchValue({
      sup_name: supply.sup_name,
      sup_price: supply.sup_price
    });
  }

  onClickCancel() {
    this.showModalCreate = false;
    this.spinnerLoader = false;
    this.formSupply.reset();
  }

  // --- GUARDAR (Inteligente) ---
  async submitForm() {
    this.spinnerLoader = true;
    if (this.formSupply.invalid) {
      this.spinnerLoader = false;
      return this._alert(2, 'Error', 'Complete todos los campos');
    }

    const payload = {
      sup_name: this.formSupply.value.sup_name,
      sup_price: this.formSupply.value.sup_price
    };

    if (this.selectedSupplyId) {
      // --> SI HAY ID, ACTUALIZAMOS
      (await this.suppliesService.updateSupply(payload, this.selectedSupplyId)).subscribe({
        next: () => {
          this._alert(1, 'Actualizado', 'Insumo editado correctamente');
          this._finalizeSubmit();
        },
        error: (err: any) => {
          this._alert(2, 'Error', 'No se pudo editar el insumo');
          console.error(err);
          this.spinnerLoader = false;
        }
      });
    } else {
      // --> SI NO HAY ID, CREAMOS UNO NUEVO
      (await this.suppliesService.createSupply(payload)).subscribe({
        next: () => {
          this._alert(1, 'Éxito', 'Insumo creado correctamente');
          this._finalizeSubmit();
        },
        error: (err: any) => {
          this._alert(2, 'Error', 'No se pudo crear el insumo');
          console.error(err);
          this.spinnerLoader = false;
        }
      });
    }
  }

  // Función para recargar tabla y cerrar modal
  _finalizeSubmit() {
    this._getAllSupplies();
    this.onClickCancel();
    this.spinnerLoader = false;
  }

  onClickDelete(sup_id: number, name: string) {
    Swal.fire({
      title: "¿Eliminar Insumo?",
      text: `Se borrará ${name}.`,
      icon: "warning",
      background: 'var(--secondary-color)',
      color: 'white',
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      confirmButtonColor: '#d33',
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        (await this.suppliesService.deleteSupply(sup_id)).subscribe({
          next: () => {
            this._getAllSupplies();
            this._alert(1, 'Eliminado', 'Insumo eliminado');
          },
          error: () => this._alert(2, 'Error', 'No se pudo eliminar')
        });
      }
    });
  }

  private _alert(type: number, title: string, text: string) {
    Swal.fire({
      icon: type === 1 ? 'success' : 'error',
      title: title,
      text: text,
      color: "var(--main-color)",
      background: "var(--secondary-color)",
      confirmButtonColor: "var(--main-color)"
    });
  }
}
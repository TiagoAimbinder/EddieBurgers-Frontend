import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManangementServiceService } from 'src/app/core/services/ManangementService/manangement-service.service';
import Swal from 'sweetalert2';
import { CurrencyService } from 'src/app/core/services/CurrencyService/currency.service';
import { ManangementWeekService } from 'src/app/core/services/ManangementWeekService/manangement-week.service';

@Component({
  selector: 'app-create-manangement-week',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './create-manangement-week.component.html',
  styleUrls: ['./create-manangement-week.component.css']
})
export class CreateManangementWeekComponent implements OnInit {
  public spanType: string = '';
  public spanTypeCurrency: string = '';
  public formManangement: FormGroup = this._initForm();
  public fecha: any; 
  public currencyTypes: any = []; 
  public spinnerLoader: boolean = false; 

  constructor(
    private formBuilder: FormBuilder, 
    private manangementService: ManangementWeekService, 
    private currencyService: CurrencyService) {};

  ngOnInit(): void {
    this._getAllCurrency(); 
  }; 
  
  private _initForm(): FormGroup<any> {
    return this.formManangement = this.formBuilder.group({
      hw_date: [this._formatDate(), Validators.required],
      hw_amount: ['', Validators.required],
      hw_description: ['', Validators.required],
      cur_id: [null,Validators.required],
      hw_type: [null,Validators.required]
    })
  }

  public async submitForm() {

    this.spinnerLoader = true;

    // Formulario valido
    if (this.formManangement.valid === false)  return this.spinnerLoader = false, this._alert(2, 'Error', 'Faltan campos por rellenar') ;

    // Número negativo: 
    if (this.formManangement.value.hw_amount <= 0) return this.spinnerLoader = false, this._alert(2, 'Error', 'El monto no puede ser negativo o cero'); 

    const usu_id = Number(localStorage.getItem('usu_id'))

    const manangement = {
      hw_date: this.fecha,
      hw_amount: Number(this.formManangement.value.hw_amount),
      hw_description: this.formManangement.value.hw_description,
      hw_type: this.formManangement.value.hw_type === 1 ? "Ingreso" : "Egreso",
      cur_id: this.formManangement.value.cur_id,
      usu_id: usu_id,
    }

    const result = (await this.manangementService.createManangement(manangement)).subscribe({
      next: (data) => { 
        this._alert(1, 'Movimiento creado', 'Se creo el movimiento correctamente');
        this.spinnerLoader = false;
        this._resetForm()
      },
      error: (err) => {
        this._alert(2, 'Error', 'Error al crear el movimiento, intente de nuevo más tarde.');
        console.error(err);
        this.spinnerLoader = false;
      }
    })

  }; 

  private _formatDate() {
    const date = new Date; 
    this.fecha = date; 
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/');
  }

  public onClickType(type: number) {
    if (type === 1) { this.spanType = "Ingreso"; }
    if (type === 2) { this.spanType = "Egreso"; }
    this.formManangement.get('hw_type')?.setValue(type);
  }

  public onClickCurrency(id: number) {
    this.spanTypeCurrency = this.currencyTypes.find((currency: any) => currency.cur_id === id).cur_name;
    this.formManangement.get('cur_id')?.setValue(id);
  }; 

  public formatCurrency() {
    let inputValue = this.formManangement.get('hw_amount')!.value;
    if (inputValue === null) {
      return; 
    }
  
    inputValue = parseFloat(inputValue).toFixed(2);
    inputValue = inputValue.replace(',', '.');
    this.formManangement.patchValue({ hw_amount: inputValue }, { emitEvent: false });
  };

  private _getAllCurrency = async () => {
    const currency = (await this.currencyService.getAllCurrency()).subscribe({
      next: (res) => {
        this.currencyTypes = res.currency;
      },
      error: (err) => {
        this._alert(2, 'Error', 'Error al obtener los tipos de moneda');
        console.error(err)
      } 
    });
  }

  private _resetForm() {
    this.formManangement.reset({
      hw_date: this._formatDate(),
      hw_amount: '',
      hw_description: '',
      cur_id: null,
      hw_type: null
    });
    this.spanType = '';
    this.spanTypeCurrency = '';
  }

  private _alert = (type: number, title: string, text: string) => {
    Swal.fire({
      icon: type === 1 ? "success" : "error",
      title: title,
      text: text,
      color: "var(--main-color)",
      background: "var(--secondary-color)",
      confirmButtonColor: "var(--main-color)",
    });
  }

}

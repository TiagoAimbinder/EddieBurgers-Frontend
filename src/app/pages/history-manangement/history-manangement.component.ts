import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { ManangementServiceService } from 'src/app/core/services/ManangementService/manangement-service.service';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/core/services/UserService/user.service';
import { CurrencyService } from 'src/app/core/services/CurrencyService/currency.service';
import { Currency, CurrencyTotal } from 'src/app/core/models/currency.models';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-history-manangement',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './history-manangement.component.html',
  styleUrls: ['./history-manangement.component.css']
})
export class HistoryManangementComponent implements OnInit {

  public manangementHistory: any[] = [];
  public manangementHistoryFiltered: any[] = [];

  public users: any[] = [];
  public currencyTypes: Currency[] = [];

  // Seteo de array para sumar o restar según el movimiento
  public totalAmount: CurrencyTotal[] = [];  

  // Formulario de busqueda:
  public formTable = this._initFormSearch();

  public movementType: string = 'Movimiento';
  public currencyType: string = 'Moneda';
  public timeFilter: string = 'Semana';


  // ------ Variables - Actualizar Movimiento: 
  public spanType: string = '';
  public spanTypeCurrency: string = '';
  public formManangement: FormGroup = this._initForm();
  public spinnerLoader: boolean = false; 
  public showModal: boolean = false;
  private _manangementSelected: any; 

  constructor(private formBuilder: FormBuilder, private manangementService: ManangementServiceService, private userService: UserService, private currencyService: CurrencyService, private decimalPipe: DecimalPipe) {

  }

  ngOnInit(): void {
    this._getAllCurrencyTypes();

  }

  private _getAllManangement = async () => {
    (await this.manangementService.getAllManangement()).subscribe({
      next: (data) => {
        this.manangementHistory = data.manangement; 
        this.manangementHistoryFiltered = data.manangement; 
        this._calcTotalAmount();
        this.tableFilter(this.movementType, this.currencyType, this.timeFilter)
      },
      error: (err) => {
        console.error(err); 
        this._alert(2, "Error", "Error al obtener los movimientos, intentelo de nuevo más tarde");
      }
    }) 
  }

  private _getAllUsers = async () => {
    (await this.userService.getAllUsers()).subscribe({
      
      next: (data) => {
        
        this.users = data.users;
        this._getAllManangement();
      }, 
      error: (err) => {
        console.error(err);
        this._alert(2, 'Error', 'Error al obtener los usuarios, intentelo de nuevo más tarde');
      }
    })
  };

  private _getAllCurrencyTypes = async () => {
    (await this.currencyService.getAllCurrency()).subscribe({
      next: (data) => {
        this.currencyTypes = data.currency;
        this.totalAmount = this.currencyTypes.map((cur: Currency) => ({ cur_id: cur.cur_id, cur_name: cur.cur_name, total: 0,}))
        this._getAllUsers();
        

      }, 
      error: (err) => {
        console.error(err);
        this._alert(2, 'Error', 'Error al obtener los tipos de monedas, intentelo de nuevo más tarde');
      }
    })
  };

  private _calcTotalAmount = () => {
    this.manangementHistory.forEach((manangement) => {

      // Comprobación de que esté activada: 
      if (manangement.his_status !== true) return; 

      this.totalAmount = this.totalAmount.map((ct: any) => {
        if (ct.cur_id === manangement.cur_id) {
          if (manangement.his_type === "Ingreso") ct.total += manangement.his_amount;
          else ct.total -= manangement.his_amount;
        };
        return ct;
      })
    })

  } 

   // ---------- SEARCH INPUT ---------- 
  private _initFormSearch(): FormGroup {
    return this.formBuilder.group({
      searchInput: ['', Validators.required ]
    })
  }

  // ---- Filtro para buscar  
  public tableFilter(mt: string, ct: string, time: string) {

    this.totalAmount = this.currencyTypes.map((cur: Currency) => ({ cur_id: cur.cur_id, cur_name: cur.cur_name, total: 0, }));


    // let startOfWeek: Date;
    // let endOfWeek: Date;
    
    // if (time === 'Semana') {
    //   startOfWeek = this.getStartOfWeek(new Date());
    //   endOfWeek = this.getEndOfWeek(new Date());
    // }


    const items = this.manangementHistory.filter( (item:any) => {

      // Filtrar por tipo de movimiento:
      const isTypeMatch = mt === 'Movimiento' ? (item.his_type === 'Ingreso' || item.his_type === 'Egreso') : item.his_type === mt;

      // Filtrar por tipo de moneda:
      const isCurrencyMatch = ct === 'Moneda' ? true : this.currencyTypes.some(cur => cur.cur_name === ct && cur.cur_id === item.cur_id)  

      // Filtrar por descripción:
      const isDescriptionMatch = item.his_description.toLowerCase().includes(this.formTable.value.searchInput.toLowerCase());

      // Filtrar por fecha dentro de la semana actual:
      // const itemDate = new Date(item.his_date);
      // const isDateMatch = time === 'Todo' || (itemDate >= startOfWeek && itemDate <= endOfWeek);

      return isTypeMatch && isCurrencyMatch && isDescriptionMatch;
    })

    this.manangementHistoryFiltered = items;

    items.forEach((manangement) => {
      if (manangement.his_status !== true) return;

      this.totalAmount = this.totalAmount.map((ct: any) => {
        if (ct.cur_id === manangement.cur_id) {
          if (manangement.his_type === "Ingreso") ct.total += manangement.his_amount;
          else ct.total -= manangement.his_amount;
        };
        return ct;
      })
    });
  };

  // Función para obtener el lunes de la semana actual:
  private getStartOfWeek(date: Date): Date {
    const day = date.getDay(); 
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
    const startOfWeek = new Date(date);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0); 
    return startOfWeek;
  }

  // Función para obtener el domingo de la semana actual:
  private getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); 
    return endOfWeek;
  }

  public filterType(mt: string) {
    mt === 'Movimiento' ? this.movementType = 'Ingreso' : mt === 'Ingreso' ? this.movementType = 'Egreso' : this.movementType = 'Movimiento';
  };

  public filterCurrency(ct: string) {
    if (ct === 'Moneda') return this.currencyType =  this.currencyTypes[0].cur_name;
    const index = this.currencyTypes.findIndex( (cur: any) => {return cur.cur_name === ct;});
    if (index === this.currencyTypes.length - 1) return this.currencyType = 'Moneda';
    return this.currencyType = this.currencyTypes[index+1].cur_name;
    
  };

  public filterTime(time: string) {
    time === 'Semana' ? this.timeFilter = 'Todo' : this.timeFilter = 'Semana';    
  };

  // ---------- END INPUT ---------- 

  /* -------------- TABLE -------------- */
  public returnCurrencyName(cur_id: number): string {
    const currency = this.currencyTypes.find((cur: any) => cur.cur_id === cur_id);
    return currency ? currency.cur_name : 'Unknown';
  }

  public returnUserName(usu_id: number): string {
    const name = this.users.find((usu: any) => usu.usu_id === usu_id);
    return name ? name.usu_name : 'Unknown';
  }

  public formatDate(date: Date): string {
    const newDate = new Date(date);

    const day = newDate.getDate();
    const month = newDate.getMonth() + 1; 
    const year = newDate.getFullYear() % 100; 

    return `${day}/${month < 10 ? '0' : ''}${month}/20${year < 10 ? '0' : ''}${year}`;
  }
  
  public onClickDelete = async(his_id: number, his_amount: number, his_type: string) => {
    Swal.fire({
      icon: 'warning',
      background: 'var(--secondary-color)',
      color: 'var(--main-color)'
    })

    Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás por eliminar el $${his_type} con un monto de ${his_amount}`,
      icon: "warning",
      background: 'var(--secondary-color)',
      color: 'var(--light-color)',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: 'var(--main-color)',
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = (await this.manangementService.deleteManangement(his_id)).subscribe({
          next: (data) => {
            this.totalAmount = this.currencyTypes.map((cur: Currency) => ({ cur_id: cur.cur_id, cur_name: cur.cur_name, total: 0,}))
            this._getAllManangement();
            this._alert(1, "Eliminado", "El movimiento ha sido eliminado correctamente.");
          },
          error: (err) => {
            console.error('Error al eliminar el movimiento: ', err);
            this._alert(2, "Error", "Error al intentar eliminar el movimiento, intente más tarde");
          }
        })

      }
    });
    
  };

  public onClickModify(his_id: number) {
    this.showModal = true;
    this._manangementSelected = his_id; 
    const manangement = this.manangementHistory.find((his: any) => his.his_id === his_id);
    this.onClickCurrency(manangement.cur_id);
    this.onClickType(manangement.his_type);
    this.formManangement.patchValue({
      his_amount: manangement.his_amount,
      his_description: manangement.his_description
    });
  };

  /* ---------------- Actualizar movimiento --------------------- */
  private _initForm(): FormGroup<any> {
    return this.formManangement = this.formBuilder.group({
      his_amount: ['', Validators.required],
      his_description: ['', Validators.required],
      cur_id: [null,Validators.required],
      his_type: [null,Validators.required]
    })
  }

  public formatCurrency() {
    let inputValue = this.formManangement.get('his_amount')!.value;
    if (inputValue === null) {
      return; 
    }
  
    inputValue = parseFloat(inputValue).toFixed(2);
    inputValue = inputValue.replace(',', '.');
    this.formManangement.patchValue({ his_amount: inputValue }, { emitEvent: false });
  };

  public onClickCurrency(id: number) {
    this.spanTypeCurrency = this.currencyTypes.find((currency: any) => currency.cur_id === id)!.cur_name;
    this.formManangement.get('cur_id')?.setValue(id);
  }; 

  public onClickType(type: string) {
    this.spanType = type;
    this.formManangement.get('his_type')?.setValue(type);
  }

  public onClickCancel() {
    this.showModal = false;
    this.formManangement.reset();
  }

  public async submitForm() {

    this.spinnerLoader = true;

    // Formulario valido
    if (this.formManangement.valid === false)  return this.spinnerLoader = false, this._alert(2, 'Error', 'Faltan campos por rellenar') ;

    // Número negativo: 
    if (this.formManangement.value.his_amount <= 0) return this.spinnerLoader = false, this._alert(2, 'Error', 'El monto no puede ser negativo o cero'); 

    const usu_id = Number(localStorage.getItem('usu_id'))

    const userName = this.returnUserName(usu_id);

    const currentDescription = this.formManangement.value.his_description;
    const updatedDescription = `${currentDescription} (Modificado por: ${userName})`;

    const manangement = {
      his_amount: Number(this.formManangement.value.his_amount),
      his_description: updatedDescription,
      his_type: this.formManangement.value.his_type,
      cur_id: this.formManangement.value.cur_id,
    }

    const result = (await this.manangementService.updateManangement(manangement, this._manangementSelected, usu_id)).subscribe({
      next: (data) => { 
        this._alert(1, 'Movimiento actualizado', 'Se actualizo el movimiento correctamente');
        this.totalAmount = this.currencyTypes.map((cur: Currency) => ({ cur_id: cur.cur_id, cur_name: cur.cur_name, total: 0, }))
        this._getAllManangement();
        this.showModal = false;
        this.spinnerLoader = false;
      },
      error: (err) => {
        this._alert(2, 'Error', 'Error al actualizar el movimiento, intente de nuevo más tarde.');
        console.error(err);
        this.spinnerLoader = false;
      }
    })
  }; 


  private _alert = (type: number, title: string, text: string) => {
    Swal.fire({
      icon: type === 1 ? "success" : "error",
      title: title,
      text: text,
      color: "var(--light-color)",
      background: "var(--secondary-color)",
      confirmButtonColor: "var(--main-color)",
    });
  }
}







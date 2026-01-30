import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Módulo necesario para ngModel
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { UnitsSoldService } from 'src/app/core/services/UnitsSoldService/units-sold.service';

@Component({
  selector: 'app-units-sold-history',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './units-sold-history.component.html',
  styleUrls: ['./units-sold-history.component.css']
})
export class UnitsSoldHistoryComponent implements OnInit {

  public saleHistoryFiltered: any[] = [];
  public saleHistory: any[] = [];
  
  // Opciones de locales
  public localType: any = [
    { value: 1, name: "Eddie Costa"},
    { value: 2, name: "Eddie Centro"},
  ];

  public selectedLocal: any = null;
  public totals: WritableSignal<any> = signal(null);
  
  // Variable para el input de fecha (YYYY-MM)
  public filterDate: string = '';

  constructor(private UnitsSoldService: UnitsSoldService) { }

  ngOnInit(): void {
    this.setToday(); // Iniciamos con fecha actual
    this._getAllCategories();
    this.getTotalsSaleHistory();
  }

  // --- LÓGICA DE FECHAS ---

  // Establece la fecha actual en el input
  setToday() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    this.filterDate = `${year}-${month}`;
  }

  // Resetea a hoy y recarga
  resetDate() {
    this.setToday();
    this.onDateChange();
  }

  // Verifica si el filtro es el mes actual (para ocultar el botón "Hoy")
  isCurrentMonth(): boolean {
    const now = new Date();
    const current = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    return this.filterDate === current;
  }

  // Cambia el mes (+1 o -1)
  changeMonth(delta: number) {
    if (!this.filterDate) return;

    const [yearStr, monthStr] = this.filterDate.split('-');
    let year = Number(yearStr);
    let month = Number(monthStr);

    // Creamos fecha auxiliar (el día 1 del mes)
    // Javascript maneja automáticamente el desbordamiento de meses (ej: mes 13 pasa al año siguiente)
    const date = new Date(year, month - 1 + delta, 1);
    
    const newYear = date.getFullYear();
    const newMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    
    this.filterDate = `${newYear}-${newMonth}`;
    this.onDateChange();
  }

  // Se ejecuta cuando cambia la fecha (por input o botones)
  onDateChange() {
    if (this.filterDate) {
      const [yearStr, monthStr] = this.filterDate.split('-');
      const year = Number(yearStr);
      const month = Number(monthStr);

      this._getAllCategories(month, year);
      this.getTotalsSaleHistory(this.selectedLocal ? this.selectedLocal.value : null, month, year);
    }
  }

  public _formatDate(fecha: string) {
    const date = new Date(fecha);
    // Ajuste simple para mostrar DD/MM/YY
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/');
  }

  // --- LLAMADAS AL SERVICIO ---

  private getTotalsSaleHistory = async (sal_local: number | null = null, month?: number, year?: number) => {
    const usu_id = Number(localStorage.getItem('usu_id'));
    
    // Si no vienen parámetros, usamos el filterDate actual
    if (!month && !year && this.filterDate) {
         const [y, m] = this.filterDate.split('-');
         year = Number(y);
         month = Number(m);
    }

    (await this.UnitsSoldService.unitsSoldGetTotals(usu_id, sal_local, month, year)).subscribe({
        next: (res) => {
             if (res.totals && res.totals.length > 0) {
                 this.totals.set(res.totals[0]);
            } else {
                 this.totals.set({ total_general: 0, total_mensual: 0, total_semanal: 0 });
            }
        },
        error: () => {
             // En caso de error o sin datos, ponemos ceros
             this.totals.set({ total_general: 0, total_mensual: 0, total_semanal: 0 });
        }
    })
  }

  private _getAllCategories = async (month?: number, year?: number) => {
    const usu_id = Number(localStorage.getItem('usu_id'));
    
    if (!month && !year && this.filterDate) {
         const [y, m] = this.filterDate.split('-');
         year = Number(y);
         month = Number(m);
    }

    (await this.UnitsSoldService.unitsSoldGetAll(usu_id, month, year)).subscribe({
        next: (data) => {
            this.saleHistory = data.sales || [];
            // Re-aplicamos filtro local sobre los nuevos datos
            this.tableFilterLocal(this.selectedLocal ? this.selectedLocal.name : "Local");
        },
        error: (err) => {
            this.saleHistory = [];
            this.saleHistoryFiltered = [];
        }
    });
  }

  // --- FILTROS LOCALES ---

  public tableFilterLocal(mt: string) {
    if (!this.saleHistory || this.saleHistory.length === 0) {
        this.saleHistoryFiltered = [];
        return;
    }

    if (mt === 'Local') {
        this.saleHistoryFiltered = this.saleHistory;
        return;
    }

    const items = this.saleHistory.filter((item: any) => {
        let isLocalMatch = false;
        if (mt === 'Eddie Costa') {
            isLocalMatch = item.sal_local === 1;
        } else if (mt === 'Eddie Centro') {
            isLocalMatch = item.sal_local === 2;
        }
        return isLocalMatch;
    });
    
    this.saleHistoryFiltered = items;
  }

  public getLocal() {
    if (this.selectedLocal == null){
        return this.selectedLocal = this.localType[0]
    }
    if (this.selectedLocal == this.localType[0]){
        return this.selectedLocal = this.localType[1]
    }
    return this.selectedLocal = null
  }

  public onFilterLocal() { 
    this.getLocal();
    this.tableFilterLocal(this.selectedLocal ? this.selectedLocal.name: "Local");
    
    // Al cambiar local, pedimos totales nuevos (respetando la fecha actual)
    this.getTotalsSaleHistory(this.selectedLocal ? this.selectedLocal.value: null);
  }

}
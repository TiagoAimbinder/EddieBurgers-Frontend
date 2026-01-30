import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  public navbarName = 'Eddie Burguers'; 
  mostrarItem = true
  mostrarTodoMenu = true; 


  constructor (private router: Router) {
  }

  ngOnInit(): void {
    this.navbarName = this._getNameByRoute(this.router.url);
    this.mostrarMenu()   
  } 

  mostrarMenu () {
    const role_id = Number(localStorage.getItem('role_id'));
    if ( role_id === 2) {
      this.mostrarItem = false
    }

    if (role_id === 3) {
      this.mostrarTodoMenu = false;
    }
  }


  private _getNameByRoute(url: string): string{
    if(url === '/login') return '';
    if(url === '/gestion') return 'Ingresos | Egresos';
    if(url === '/gestion/crear') return 'Crear - Ingresos | Egresos General';
    if(url === '/gestion/crearsemanal') return 'Crear - Ingresos | Egresos Semanal';
    if(url === '/gestion/historial') return 'Historial - Ingresos | Egresos General';
    if(url === '/gestion/historialsemana') return 'Historial - Ingresos | Egresos Semanal';
    if(url === '/categoria') return 'Categorias';
    
    return 'Eddie Burguers'
  }
}

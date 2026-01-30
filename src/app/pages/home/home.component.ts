import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showIngresosEgresos: boolean = true;
  showCostos: boolean = true;
  showResenas: boolean = true;
  showVentas: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const role_id = Number(localStorage.getItem('role_id'));

    // Si el rol es 3, solo mostramos el botón de "Cantidad de unidades vendidas"
    if (role_id === 3) {
      this.showIngresosEgresos = false;
      this.showCostos = false;
      this.showResenas = false;
      this.showVentas = true; // solo este visible
    }
  }
}

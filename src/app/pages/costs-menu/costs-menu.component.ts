import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { RouterLink } from '@angular/router'; // <--- IMPORTANTE

@Component({
  selector: 'app-costs-menu',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink], 
  templateUrl: './costs-menu.component.html',
  styleUrls: ['./costs-menu.component.css']
})
export class CostsMenuComponent {
}
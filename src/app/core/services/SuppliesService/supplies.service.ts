import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from 'src/environments/endpoints';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SuppliesService {

  constructor(private http: HttpClient) { }

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('usu_token')}`
    });
  }

  // 1. Obtener todos
  getAllSupplies = async(): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.getAllSupplies}`;
    return this.http.get(urlApi, { headers: this.headers() });
  }

  // 2. Crear Insumo
  createSupply = async(data: any): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.createSupply}`;
    return this.http.post(urlApi, data, { headers: this.headers() });
  }

  // Actualizar Insumo
  updateSupply = async(data: any, sup_id: number): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.updateSupply}/${sup_id}`;
    return this.http.put(urlApi, data, { headers: this.headers() });
  }

  // 3. Eliminar Insumo (Ajustado a tu ruta '/remove/:sup_id')
  deleteSupply = async(sup_id: number): Promise<Observable<any>> => {
    // Esto generará algo como: http://localhost:3000/api/supply/remove/5
    const urlApi = `${environment.const_url_server}${endpoints.deleteSupply}/${sup_id}`;
    return this.http.delete(urlApi, { headers: this.headers() });
  }
}
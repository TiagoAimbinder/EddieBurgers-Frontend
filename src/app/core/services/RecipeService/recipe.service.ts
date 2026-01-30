import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from 'src/environments/endpoints';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  constructor(private http: HttpClient) { }

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('usu_token')}`
    });
  }

  // Obtener todos los ingredientes de una hamburguesa
  getRecipeByCatId = async(cat_id: number): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.getRecipe}/${cat_id}`;
    return this.http.get(urlApi, { headers: this.headers() });
  }

  // Agregar ingrediente (Pan, Carne) a la hamburguesa
  addIngredient = async(data: { cat_id: number, sup_id: number, cxs_quantity: number }): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.addToRecipe}`;
    return this.http.post(urlApi, data, { headers: this.headers() });
  }

  // Quitar ingrediente
  removeIngredient = async(cxs_id: number): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.removeFromRecipe}/${cxs_id}`;
    return this.http.delete(urlApi, { headers: this.headers() });
  }
}
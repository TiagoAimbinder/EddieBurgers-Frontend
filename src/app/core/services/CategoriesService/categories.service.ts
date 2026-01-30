import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from 'src/environments/endpoints';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  private headers(): HttpHeaders {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('usu_token')}`
    });
    return headers; 
  }

  // Crear categoría
  createCategories = async (categories: any) : Promise<Observable<any>> => {
    const urlApi = environment.const_url_server + endpoints.createCategories; 
    return this.http.post(urlApi, categories, { headers: this.headers() });
  }

  // Obtener categorías (AHORA ACEPTA sec_id OPCIONAL)
  getAllCategories = async(sec_id: number | null = null): Promise<Observable<any>> => { 
    // URL base: .../getAll/USER_ID
    let urlApi = `${environment.const_url_server}${endpoints.getAllCategories}/${localStorage.getItem('usu_id')}`;
    
    // Si mandamos una sección, la agregamos como Query Param (ej: ?sec_id=1)
    if (sec_id) {
        urlApi += `?sec_id=${sec_id}`;
    }

    return this.http.get(urlApi, {headers: this.headers() })
  }
  
  // Actualizar
  updateCategory = async ( categories: any, cat_id: number,  usu_id: number): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.updateCategories}/${cat_id}/${usu_id}`; 
    return this.http.put(urlApi, categories, { headers: this.headers() });
  };

  // Eliminar
  deleteCategory = async (cat_id: number): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.deleteCategories}/${cat_id}/${localStorage.getItem('usu_id')}`
    return this.http.delete(urlApi, { headers: this.headers() })
  };

}
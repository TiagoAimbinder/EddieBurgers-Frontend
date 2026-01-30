import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from 'src/environments/endpoints';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SectionsService {
  constructor(private http: HttpClient) { }

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('usu_token')}`
    });
  }

  getAllSections = async(): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.getAllSections}`;
    return this.http.get(urlApi, { headers: this.headers() });
  }
  createSection = async(data: { sec_name: string }): Promise<Observable<any>> => {
    // Asegúrate de tener 'createSection' en tu archivo endpoints.ts también
    const urlApi = `${environment.const_url_server}${endpoints.createSection}`; 
    return this.http.post(urlApi, data, { headers: this.headers() });
  }

  // Update
  updateSection = async(data: { sec_name: string }, sec_id: number): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.updateSection}/${sec_id}`;
    return this.http.put(urlApi, data, { headers: this.headers() });
  }

  // Delete
  deleteSection = async(sec_id: number): Promise<Observable<any>> => {
    const urlApi = `${environment.const_url_server}${endpoints.deleteSection}/${sec_id}`;
    return this.http.delete(urlApi, { headers: this.headers() });
  }
}
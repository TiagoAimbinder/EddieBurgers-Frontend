import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from 'src/environments/endpoints';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitsSoldService {

  constructor(private http: HttpClient) { }

  private headers(): HttpHeaders {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('usu_token')}`
    });
    return headers; 
  }

  unitsSoldCreate = async (unitsSold: any) : Promise<Observable<any>> => {
    const urlApi = environment.const_url_server + endpoints.createsaleHistory; 
    return this.http.post(urlApi, unitsSold, { headers: this.headers() });
  }

  unitsSoldGetAll = async (usu_id: number, month?: number, year?: number) : Promise<Observable<any>> => {
    let urlApi = `${environment.const_url_server}${endpoints.getAllsaleHistory}?usu_id=${usu_id}`;
    
    if (month && year) {
        urlApi += `&month=${month}&year=${year}`;
    }
    return this.http.get(urlApi, { headers: this.headers() });
  }

unitsSoldGetTotals = async (usu_id: number, sal_local: number | null, month?: number, year?: number): Promise<Observable<any>> => {
    let urlApi = `${environment.const_url_server}${endpoints.getsaleHistoryTotal}?usu_id=${usu_id}`;

    if (sal_local !== null && sal_local !== undefined) {
        urlApi += `&sal_local=${sal_local}`;
    } else {
        urlApi += `&sal_local=null`; 
    }

    if (month && year) {
        urlApi += `&month=${month}&year=${year}`;
    }
    
    return this.http.get(urlApi, { headers: this.headers() });
  };
};




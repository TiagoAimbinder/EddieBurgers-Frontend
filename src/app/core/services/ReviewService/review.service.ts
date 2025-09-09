import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { endpoints } from 'src/environments/endpoints';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  createReview(reviewData: any): Observable<any> {
    const urlApi = `${environment.const_url_review_server}${endpoints.createReview}`;
    return this.http.post(urlApi, reviewData)

  }

  getAllMenu(): Observable<any> {
    const urlApi = `${environment.const_url_review_server}${endpoints.getAllMenuxReview}`;
    return this.http.get(urlApi);
  }

  updateMenu(id: number, men_name: string) {
    const urlApi = `${environment.const_url_review_server}${endpoints.updateMenu}/${id}`;
    return this.http.put(urlApi, { men_name });
  }

  deleteMenu(id: number) {
    const urlApi = `${environment.const_url_review_server}${endpoints.deleteMenu}/${id}`;
    return this.http.delete(urlApi);
  }

  createMenu(men_name: string) {
    const url = `${environment.const_url_review_server}${endpoints.createMenuxReview}`;
    return this.http.post(url, { men_name });
  }



} 

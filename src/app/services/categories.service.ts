import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categorie } from '../model/categorie';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { 

  }

  urlHote = "http://localhost:3333/categories/";

  getCategories(): Observable<Array<Categorie>> {
    return this.http.get<Array<Categorie>>(this.urlHote);
  }

  addCategorie(nouveau: Categorie) {
    return this.http.post<Array<Categorie>>(this.urlHote, nouveau);
  }
  
}

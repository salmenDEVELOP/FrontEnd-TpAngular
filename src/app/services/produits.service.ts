import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Produit } from '../model/produit';
import { Observable } from 'rxjs';
import { CritereRehcerche } from '../model/critereRecherche';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {


  constructor(private http: HttpClient) { 
  }

  urlHote = "http://localhost:3333/produits/";

  getProduits(): Observable<Array<Produit>> {
    return this.http.get<Array<Produit>>(this.urlHote);
  }

  deleteProduit(idP: number | undefined) {
    return this.http.get(this.urlHote +"delete/" + idP);
  }

  addProduit(nouveau: Produit) {
    return this.http.post<Array<Produit>>(this.urlHote, nouveau);
  }
  
  updateProduit(nouveau: Produit) {
    return this.http.put(this.urlHote, nouveau);
  }

  getProduitsFiltrés(critereRecherche : CritereRehcerche):Observable<Array<Produit>>{
    return this.http.post<Array<Produit>>(this.urlHote+"search", critereRecherche)
  }
}

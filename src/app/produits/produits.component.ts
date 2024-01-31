import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProduitsService } from '../services/produits.service';
import { CategoriesService } from '../services/categories.service';
import { Categorie } from '../model/categorie';
import { CritereRehcerche } from '../model/critereRecherche';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {

filtreCategorie: Categorie = new Categorie;
filtrePrix: number =0
critereRecherche : CritereRehcerche = new CritereRehcerche()

evaluerCritere() {
  this.critereRecherche.categorie=this.filtreCategorie;
  this.critereRecherche.prix=this.filtrePrix ;
  this.consulterProduitsFiltre(this.critereRecherche)
  }

  vider(){
    this.ngOnInit()
   // this.consulterProduitsFiltre(new CritereRehcerche);
   // console.log(this.filtreCategorie.libelle)
   // console.log(this.filtrePrix)
  } 
  
  constructor(private produitsService :ProduitsService , private categoriesService : CategoriesService)
      {
      }
  affficheFicheProduit : Boolean = false;
  ngOnInit(): void {
    console.log('initialisation du composant : récuperer la liste des produits');
    this.filtrePrix=0;
    this.critereRecherche.categorie=new Categorie();
    this.consulterProduits()
    this.consulterCategories();
    this.affficheFicheProduit=false;
    
  }

  consulterProduits() {
    this.produitsService.getProduits()
      .subscribe(
        {
          next: data => {
            console.log("Succès GET");
            this.produits = data;
          },
          error: err => {
            console.log("Erreur GET");
          }
        }
      )
  }

  consulterProduitsFiltre(critereRecherche : CritereRehcerche){
    this.produitsService.getProduitsFiltrés(critereRecherche)
    .subscribe(
      {
        next: data => {
          console.log("Succès GET");
          this.produits = data;
        },
        error: err => {
          console.log("Erreur GET");
        }
      }
    )
  }
  consulterCategories() {
    this.categoriesService.getCategories()
      .subscribe(
        {
          next: data => {
            console.log("Succès GET");
            this.categories = data;
          },
          error: err => {
            console.log("Erreur GET");
          }
        }
      )
  }
   produits: Array<Produit> = [];
   categories : Array<Categorie> = [];
 
   supprimerProduit(p: Produit) {//Afficher une boite de dialogue pour confirmer la suppression 
    let reponse: boolean = confirm("Voulez vous supprimer le produit :" + p.designation + " ?");
    if (reponse == true) {
      console.log("Suppression confirmée..."); //chercher l'indice du produit à supprimer 
      let index: number = this.produits.indexOf(p);
      console.log("indice du produit à supprimer: " + index);
      if (index !== -1) {
        // supprimer le produit r0éférencé 
        this.supprimer(p.id,index);
        
      }
    } else { console.log("Suppression annulée..."); }
  }

  supprimer(id :any, index :any){
    this.produitsService.deleteProduit(id)
      .subscribe({
        next: response => {
          console.log("Succès DELETE", response);
          // Mettre à jour le produit aussi dans le tableau "produits" (FrontEnd) si nécessaire
          this.produits.splice(index, 1);
          
        },
        error: err => {
          console.log("Erreur DELETE", err);
          // Gérer l'erreur si nécessaire
        }
      }
     );

  } 

  produitCourant = new Produit();

  validerFormulaire(form: NgForm) {
    console.log(form.value);
    //this.produits.push(this.produitCourant);
    if (form.value.id != undefined) {
      console.log("id non vide...");
      //flag pour distinguer entre le mode AJOUT et le mode EDIT
      let nouveau: boolean = true;
      let index = 0;
      do {
        let p = this.produits[index];
        console.log(
          p.code + ' : ' + p.designation + ': ' + p.prix);
        if (p.id == form.value.id) {
          //rendre le mode à EDIT
          nouveau = false;
          console.log('ancien');
          let reponse: boolean =
            confirm("Produit existant. Confirmez vous la mise à jour de :" + p.designation + " ?");
          if (reponse == true) {
            //mettre à jour dans le BackEnd
            this.mettreAJourProduit(form.value,this.produits[index]);
            this.produitCourant = new Produit()
            this.affficheFicheProduit=!this.affficheFicheProduit;
          }
          else {
            console.log("Mise à jour annulée");
            this.produitCourant = new Produit()
            this.affficheFicheProduit=!this.affficheFicheProduit;
          }
          //Arrêter la boucle
          return;
        }
        else {
          //continuer à boucler
          index++;
        }
      }
      while (nouveau && index < this.produits.length);
    }
    
  } 

 mettreAJourProduit(nouveauPr :Produit, ancienPr : Produit){
    this.produitsService.updateProduit(nouveauPr).subscribe(
      {
        next: updatedProduit => {
          console.log("Succès PUT");
          //mettre à jour le produit aussi dans le tableau "produits" (FrontEnd)
          ancienPr.code = nouveauPr.code;
          ancienPr.designation = nouveauPr.designation;
          ancienPr.categorie=nouveauPr.categorie;
          ancienPr.prix = nouveauPr.prix;
          console.log('Mise à jour du produit:'
            + ancienPr.designation);
        },
        error: err => {
          console.log("Erreur PUT");
        }
      }
    )
  } 
  
}




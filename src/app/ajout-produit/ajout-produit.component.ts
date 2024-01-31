import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';
import { Categorie } from '../model/categorie';


@Component({
  selector: 'app-ajout-produit',
  templateUrl: './ajout-produit.component.html',
  styleUrls: ['./ajout-produit.component.css']
})
export class AjoutProduitComponent implements OnInit {
  
  

 
  validerFormulaireCategorie(form: NgForm) {
    this.ajouterCategorie(form.value);
    this.nouvelleCategorie = new Categorie();
    }
  ajouterCategorie(categorie: Categorie) {
    this.categoriesService.addCategorie(categorie)
      .subscribe({
        next: response => {
          console.log("Succès POST", response);
          // Mettre à jour le produit aussi dans le tableau "produits" (FrontEnd) si nécessaire
          this.categories.push(categorie);
        },
        error: err => {
          console.log("Erreur POST", err);
          // Gérer l'erreur si nécessaire
        }
      });
    
  }
  
  constructor(private produitsService :ProduitsService , private categoriesService :CategoriesService)
  {
  }
  ngOnInit(): void {
    console.log('initialisation du composant : récuperer la liste des produits');
    this.consulterProduits();
    this.consulterCategories();
  }
  produits: Produit[] = new Array<Produit>();

  categories : Categorie[] = new Array<Categorie>();

  nouveauProduit : Produit = new Produit();
  nouvelleCategorie : Categorie = new Categorie();
  
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

  validerFormulaire(form: NgForm) {

        this.ajouterProduit(form.value);
        this.nouveauProduit = new Produit();
        
      
  }
  
  mettreAJourProduit(nouveauPr :Produit, ancienPr : Produit){
    this.produitsService.updateProduit(nouveauPr).subscribe(
      {
        next: updatedProduit => {
          console.log("Succès PUT");
          //mettre à jour le produit aussi dans le tableau "produits" (FrontEnd)
          ancienPr.code = nouveauPr.code;
          ancienPr.designation = nouveauPr.designation;
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
  ajouterProduit(produit: Produit) {
    this.produitsService.addProduit(produit)
      .subscribe({
        next: response => {
          console.log("Succès POST", response);
          // Mettre à jour le produit aussi dans le tableau "produits" (FrontEnd) si nécessaire
          this.produits.push(produit);
        },
        error: err => {
          console.log("Erreur POST", err);
          // Gérer l'erreur si nécessaire
        }
      });
  } 

}

import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe(
    //   'Cheeseburger',
    //   'leckere Rindfleischburger mit Käse',
    //   'https://image.brigitte.de/12444002/t/dg/v3/w960/r1/-/burger-vom-grill.jpg',
    //   [
    //     new Ingredient('Buns', 2),
    //     new Ingredient('Meat', 2),
    //     new Ingredient('Onions', 1),
    //   ]
    // ),
    // new Recipe(
    //   'Paniertes Schnitzel',
    //   'Paniertes Schnitzel mit Pommes und Salat',
    //   'https://www.ndr.de/ratgeber/kochen/schnitzel170_v-contentxl.jpg',
    //   [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
    // ),
  ];

  constructor(private shoppingListService:ShoppingListService){}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index:number){
    return this.recipes.slice()[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
      this.shoppingListService.addIngredients(ingredients)
  }


  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }


  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }


  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}

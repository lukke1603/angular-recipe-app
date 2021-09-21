import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { map, tap } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService{

  serverUrl = 'https://ng-recipe-app-23a9a-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ){}


  storeRecipes(){
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      `${this.serverUrl}recipes.json`,
      recipes
    ).subscribe(
      response => {
        console.log(response);
      }
    );
  }


  fetchRecipes(){
    return this.http.get<Recipe[]>(
      `${this.serverUrl}recipes.json`
    ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        })
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    )
  }


}

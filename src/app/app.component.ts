import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  title = 'recipe-app';
  loadedFeature:string = 'recipe'

  constructor(
    private authService: AuthService
  ){}


  ngOnInit(): void {
    this.authService.autoLogin();
  }


  onNavigate(feature: string){
    this.loadedFeature = feature;
  }
}

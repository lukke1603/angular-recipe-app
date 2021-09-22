import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

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
    private authService: AuthService,
    private loggingService: LoggingService
  ){}


  ngOnInit(): void {
    this.authService.autoLogin();
    this.loggingService.printLog('Hello From AppComponent');
  }


  onNavigate(feature: string){
    this.loadedFeature = feature;
  }
}

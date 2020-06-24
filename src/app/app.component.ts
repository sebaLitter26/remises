import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


//import { PopupService, UbicacionService, ApiService, NavService } from './services/index.services';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';
   // @ViewChildren('appDrawer') appDrawer: ElementRef;

    formGroup: FormGroup;
   
   
}

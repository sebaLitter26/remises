import {
    Component, NgModule, OnInit, OnDestroy, Input, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef,
    ChangeDetectorRef, TemplateRef, ViewChild, Output, EventEmitter, Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { trigger, style, animate, transition } from '@angular/animations';
//import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

//Para el 'programar viaje'
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

import { Router } from '@angular/router';


const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

//import { ApiService } from '../../services/index.services';
//import { ModificacionComponent } from '../modificacion/modificacion.component';

/********************************/
//import { Subscription } from 'rxjs';
//import { NgRedux, select } from '@angular-redux/store';
//import { IAppState } from '../../store';
//import { MODULOS } from '../../actions';
/********************************/

@Component({
    selector: 'app-popup-dialog',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    providers: [
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
      {provide: MAT_DATE_LOCALE, useValue: 'es_AR'},
    ], //Inyección de dependencias

    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate(500, style({ opacity: 0 }))
            ])
        ])
    ],
})

export class PopupDialogComponent implements OnInit, OnDestroy {

    constructor(
        //public dialogRef: MatDialogRef<PopupDialogComponent>,
        //private _formBuilder: FormBuilder,
        private router: Router,

        @Inject(MAT_DIALOG_DATA) public popup_datos: any,
    ) { }

    ngOnInit() {
        console.log('popup_datos', this.popup_datos);
    }

    ngOnDestroy() {
        console.log("DESTRUCCION");
        this.router.navigate([{outlets: {popupOutlet: null}}]);
    }
}

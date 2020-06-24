import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

//import { NavbarComponent } from '../shared/index.components';


import { of, Observable, Subject, throwError } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
/*
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import * as actions from '../../../store/actions';


import {
    ROL_DETALLE
} from '../../../store/actions';
*/

@Injectable()
export class MapaService {

    private mapa_subject = new Subject<any>();


    constructor(
        //private _api: ApiService,
        public snackBar: MatSnackBar,
        private router: Router,
        //private store: Store<AppState>     //ngrx
    ) {

    }






}

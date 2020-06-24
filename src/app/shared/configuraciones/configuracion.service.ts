import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

//import { NavbarComponent } from '../shared/index.components';


import { of, Observable, Subject, throwError, pipe } from 'rxjs';
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
export class ConfiguracionService {

    private parametros_subject$ = new Subject<any>();


    constructor(
        //private _api: ApiService,
        public snackBar: MatSnackBar,
        private router: Router,
        //private store: Store<AppState>     //ngrx
    ) {

    }


    clearParametro() {
        this.parametros_subject$.next();
    }

    getParametro(): Observable<any> {
        return this.parametros_subject$.asObservable();
    }




    permiso_seleccionado(permiso): any {
        //console.log('permiso_seleccionado', permiso);
        this.parametros_subject$.next(permiso);
        //this.store.dispatch({ type: ROL_DETALLE, permiso: permiso });
    }
    /*
    let coords = this.get_obj_propiedad(response.features[0], 'coordinates');
    direccion = this.get_obj_propiedad(response.features[0], 'properties');
     */

    get_obj_propiedad(b, quebusco) {
        for (let a in b) {
            if (a == quebusco) {
                return b[a];
            }
            if (typeof (b[a]) == 'object') {
                let ret = this.get_obj_propiedad(b[a], quebusco);
                if (ret !== false) {
                    return ret;
                }
            }
        }
        return false;
    }


    obtener_xy_localidad(value) {
        //return this._api.post('getLocalidadXY', { localidad: value });
    }



}

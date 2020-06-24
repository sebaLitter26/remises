import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import * as calleActions from '../actions';
import { of } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';
import { UbicacionService } from '../../services/ubicacion.service';

@Injectable()
export class CallesEffects {

    constructor(
        private actions$: Actions,
        public _ubi: UbicacionService
    ) { }

    @Effect()
    cargarCalles$ = this.actions$.ofType(calleActions.CARGAR_CALLES_EFFECTS)
        .pipe(
            switchMap((action) => {
                //console.log(' cargarCalles$  getCallejero', action);
                return this._ubi.getCallejeroDescripcion(action['direccion']).pipe(
                    map(calles => new calleActions.CargarCallesEffectsSuccess(calles)),
                    catchError(error => of(new calleActions.CargarCallesFail(error)))
                );
            })
        );
    /*

        @Effect()
        cargarNuevaCalle$ = this.actions$.ofType(calleActions.MODIFICAR_CALLE)
            .pipe(

                switchMap((action) => {
                    console.log(' cargarCalles$  getCallejero', action['calle']);
                    return this._ubi.getCallejeroDescripcion(action['calle']).pipe(
                        map(calles => new calleActions.CargarNuevaCalleSuccess(calles)),
                        catchError(error => of(new calleActions.CargarNuevaCalleFail(error)))
                    );
                })
            );

            */


}

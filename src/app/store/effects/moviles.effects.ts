import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import * as movilActions from '../actions';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UbicacionService } from '../../services/ubicacion.service';

@Injectable()
export class MovilesEffects {

    constructor(
        private actions$: Actions,
        public _ubi: UbicacionService
    ) { }

    @Effect()
    cargarMoviles$ = this.actions$.ofType(movilActions.CARGAR_MOVILES)
        .pipe(
            switchMap(() => {
                return this._ubi.getMoviles()
                    .pipe(
                        map(moviles => new movilActions.CargarMovilesSuccess(moviles)),
                        catchError(error => of(new movilActions.CargarMovilesFail(error)))
                    );
            })
        );


}

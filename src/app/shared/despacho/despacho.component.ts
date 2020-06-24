import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { GLOBAL } from '../../services/global';

import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

//import { MatSnackBar } from '@angular/material';

//import { Store } from '@ngrx/store';
//import { AppState } from '../../store/app.reducer';

@Component({
    selector: 'app-despacho',
    templateUrl: './despacho.component.html',
    styleUrls: ['./despacho.component.scss'],
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

export class DespachoComponent implements OnInit {

    public url_absoluta: string = '';
    public url_ruteo: string = '';

    public altura_frame: string = '';

    constructor(
        private router: ActivatedRoute,
        //private store: Store<AppState>,
        //public snackBar: MatSnackBar,
    ) {
        this.url_absoluta = window.location.protocol + '//' + window.location.hostname + '/' + GLOBAL.path_despacho;
    }


    ngOnInit() {
        let alto = (<HTMLScriptElement><any>document.getElementsByTagName("app-navbar")[0]);
        this.altura_frame = '950px' //(screen.height * 1.2) + 'px';
        console.log("altura_frame", this.altura_frame);
        this.router.params
            .subscribe(params => {
                let ruta = params['ruta'];
                this.cambiar_ruta(ruta);
                //this.store.dispatch(new usuarioActions.CargarUsuario(id));
            });
    }

    cambiar_ruta(modulo: string = null) {
        this.url_ruteo = this.url_absoluta + ((modulo) ? '/?' + modulo : '');
        //console.log('url_ruteo', this.url_ruteo);
    }
}

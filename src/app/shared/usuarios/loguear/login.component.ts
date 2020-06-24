import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UbicacionService } from '../../../services/ubicacion.service';

import { Direccion } from '../../../models/index.models';

import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer'

import {
    CARGAR_NUEVO_VIAJE
} from '../../../store/actions';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

    formGroup: FormGroup;
    //myControl = new FormControl();



    localidades = [];


    direcciones: Direccion[] = [];
    filteredOptions: Observable<Direccion[]>;

    dire: any = {};
    locality: string = 'Localidad';
    altura: number = 0;

    direccion: string = '';

    mostrarLupita: boolean;
    //selected:string = '';



    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        //private _dialog: PopupService,
        public _ubi: UbicacionService,
        private store: Store<AppState>     //ngrx
        //private menucito: MatMenu;
    ) { }

    ngOnInit() {


        this.formGroup = new FormGroup({
            usuario: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            pass: new FormControl('', [Validators.required, Validators.minLength(4)])
        });

        console.log("LOGIN llamó a validar_usuario");



    }


    loguearse() {
        let logueo = { codigo: this.formGroup.get('usuario').value, clave: this.formGroup.get('pass').value };
        this._ubi.validar_usuario(logueo);
       
        //console.log('Formulario ', logueo);
        //this.api
    }


    isString(str) {
        return typeof (str) == 'string' || str instanceof String;
    }

    irUsuario(id: string) {
        if (!id) {
            return;
        }
        this.router.navigate(['/mapa', id]);
    }



}

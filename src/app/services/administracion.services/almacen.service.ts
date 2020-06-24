/*********************/
//En la llamada a los módulos:
//[0]:Nombre de la tabla
//[1]:Columnas
//[2]:Carga
//[3]:Modificación
/********************/

//ngrx
import { Store, select } from '@ngrx/store';
import { AdministracionState } from '../../store/administracion.reducers';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Cliente } from '../../models/administracion.models/cliente';
import { AbmService } from './abm.service';


import {
    MODULOS,
    DEFINICION_PERMISOS,
    NOMBRETABLA,
} from '../../shared/administracion/actions';

//Traer las acciones que están ahora separadas (de lectura y modificación)

@Injectable()
export class AlmacenService {

    //public url_modulo = 'cliente';
    public estado: boolean = false;
    public devolucion: any;
    public dato: any;
    public nombreTabla: string = '';
    tablas_todas: string[] = ['division_territorial', 'empresa', 'servicio', 'cliente', 'ficha', 'facturacion', 'movil', 'cliente_servicio', 'callejero'];

    constructor(
        private _abm: AbmService,
        private store: Store<AdministracionState>,    //ngrx
        private router: Router,
    ) { }

    cargar_datos_locales(callback) {
        var tablas = ['division_territorial', 'empresa', 'servicio', 'cliente', "cliente_servicio", 'callejero'];
        var i = 0;
        tablas.forEach((tabla: string) => {
            this.devolucion = this.trae_grillas(tabla, (devolucion) => {
                i++;
                if (i == tablas.length) {
                    callback(true);
                }
            });
        });
    }

    trae_grillas(tabla: string, callback) {
        var denegar: boolean = false;
        this._abm.url_modulo = tabla;

        if (!tabla || tabla == "" || this.observar_datos(tabla)) {
            denegar = true;
            callback(false);
            return false;
        }
        //console.error(tabla);
        var modulo = MODULOS[tabla];
        this._abm.lectura().subscribe(
            response => {
                if (denegar != true) {
                    if (response.status == 'success') {
                        modulo[2].datos = response.datos;
                        modulo[1].columnas = response.campos;

                        if (response.tablas_formulario) {
                            modulo[4].relacionales = response.tablas_formulario;
                            //console.log('tablas relacionales', modulo[4]);
                            this.store.dispatch(modulo[4]);
                        }
                        this.store.dispatch(modulo[1]);
                        this.store.dispatch(modulo[2]);
                        callback(true);
                    } else {
                        console.log("Falla!");
                        callback(false);
                    }
                }
            },
            error => {
                console.log(<any>error);
                callback(false);
            }
        );
    }

    observar_datos(tabla: string) {
        let dato = null;
        //console.log(MODULOS[tabla][0].nombre);
        /*if (!tabla || tabla == "" ){
            dato = this.store.select(MODULOS[tabla][2].datos);
        }*/
        dato = MODULOS[tabla][2];
        //console.log("Datos ya cargados?", dato);
        if (dato && dato.length >= 0) {
            return true;
        }
        else {
            return false;
        }

    }

    cargar_grillas(tabla: string, callback = null) {


        if (this.tablas_todas.indexOf(tabla) > -1)
            this._abm.url_modulo = tabla;
        else {
            this.router.navigate(['administracion']);
            return;
        }

        this.devolucion = this.trae_grillas(this._abm.url_modulo, (devolucion) => {
            console.log("Pasé por Almacén, cargué", this._abm.url_modulo, "- Fui al servidor:", devolucion);
            this.store.dispatch({ type: DEFINICION_PERMISOS, permisos: true });
            this.store.dispatch({ type: NOMBRETABLA, nombre: this._abm.url_modulo });

            callback(true);
        });
    }
}

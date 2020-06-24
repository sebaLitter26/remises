import { Component } from '@angular/core';
//import { Router, ActivatedRoute, Params } from '@angular/router';
import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';


import { UbicacionService } from '../../../services/ubicacion.service';
import { Direccion } from '../../../models/index.models';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';

import {
    CARGAR_NUEVO_VIAJE,
} from '../../../store/actions';


interface objeto_devuelto {
    puntoPedido: any,
    calle: string,
    alturaCalle: number,
    callesCoincidentes: Direccion[],
    calleValida: boolean,
    datosCalle: Direccion,
    direccionValida: boolean,
    errorDeAltura: boolean,
    busquedaInfructuosa: boolean,
    busquedaManual: boolean,
}

@Component({
    selector: 'busqueda-callejero-presu',
    template: '',
})

export class BusquedaCallejeroModif {
    private nombreCalle: string;

    constructor(
        public _ubi: UbicacionService,
        private store: Store<AppState>,     //ngrx  (store)
    ) { }

    busquedaCallejero_calle(calle: any): any {

        return new Observable(observer => {
            var objeto: objeto_devuelto;
            objeto = {
                calle: "",
                callesCoincidentes: null,
                calleValida: false,
                datosCalle: null,
                //para getNumeral
                direccionValida: false,
                errorDeAltura: false,
                busquedaInfructuosa: false,

                busquedaManual: false,
                puntoPedido: {},
                alturaCalle: 0,
            }
            console.warn("Estoy en la función externa");
            if (typeof (calle) != 'object') {  //Cuando tipeo una calle en el input pero no la selecciono en el select, paso por acá.
                var callesCoincidentes: Direccion[] = [];
                calle = this._ubi.eliminar_tildes(calle);
                objeto.calle = calle;
                this._ubi.buscarCalleSincronica(calle).subscribe(response => {
                    console.log(response);
                    response.jsData.forEach(nombre => {
                        var objetoCalle = new Direccion({ name: nombre.nombre });
                        /*
                        objetoCalle.name = nombre.nombre;
                        console.warn(objetoCalle.name);
                        objetoCalle.city = "La Plata";
                        */
                        callesCoincidentes.push(objetoCalle)
                    });
                    objeto.callesCoincidentes = callesCoincidentes;
                    observer.next(objeto);

                });
            } else {  //Paso por aquí cuando seleccioné una calle del select.
                objeto.calleValida = true;
                objeto.calle = calle.name;
                objeto.datosCalle = calle;
                this.nombreCalle = calle.name;
                //Posicionamiento inicial de la calle. Si no la encuentra, que vaya 100 más (hasta que la encuentre...)
                //this.busquedaCallejero_numeral('1', true);
                observer.next(objeto);
                //return;
            }
        });

    }

    //DEVUELVO
    /*
    1 this.alturaCalle
    1  this.direccionValida
    1 this.errorDeAltura
    1 this.busquedaInfructuosa
    
    this.puntoPedido
    
    LO PODRÍA INVENTAR ALLÁ?
    this.busquedaManual
    
    focus a interseccion
    */
    busquedaCallejero_numeral(numeral: string, posicionamiento: boolean = false): any {
        return new Observable(observer => {
            var objeto: objeto_devuelto = {
                calle: "",
                callesCoincidentes: null,
                calleValida: false,
                datosCalle: null,
                //para getNumeral
                direccionValida: false,
                errorDeAltura: false,
                busquedaInfructuosa: false,
                busquedaManual: false,
                puntoPedido: {},
                alturaCalle: 0,
            };
            var altura = Number(numeral);
            var calle = this.nombreCalle;
            if (!calle || !altura)
                return;
        /**/objeto.alturaCalle = altura;
            this._ubi.buscarNumeral(calle, numeral).subscribe(response => {
                //console.warn("getNumeral", response.jsData);
                if (response.jsData[0]) {
                    this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: response.jsData[0] });
                    if (!posicionamiento && altura > 1) {
                        objeto.puntoPedido = {};
                        objeto.puntoPedido.lat = response.jsData[0].lat;
                        objeto.puntoPedido.lon = response.jsData[0].lon;
                        objeto.direccionValida = true
                        objeto.errorDeAltura = false;

                        observer.next(objeto);
                    }
                }
                else {
                    if (posicionamiento && altura < 9999) {
                        this.busquedaCallejero_numeral(String(altura + 100), true);
                        return;
                    }
                    //console.error("No se ha encontrado la altura!");
                    objeto.errorDeAltura = true;
                    objeto.direccionValida = false;
                    objeto.busquedaInfructuosa = true;
                    objeto.busquedaManual = true;

                    observer.next(objeto);
                }
            });
        });
    }

}

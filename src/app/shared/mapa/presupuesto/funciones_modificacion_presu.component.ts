import { Component, } from '@angular/core';
//import { Router, ActivatedRoute, Params } from '@angular/router';
import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';


import { UbicacionService } from '../../../services/ubicacion.service';

interface objeto_devuelto {
    puntoPedido: any;
    direccionValida: boolean;
    alturaPosicionada: number;
    observaciones: string;
    geoCoding: boolean;
    errorGeocoding: boolean;
    nombreCalle: string;
    interseccion: string;
    localidad: string;
}

@Component({
    selector: 'FnModificacion-presu',
    template: '',
})

export class FnModificacionPresu {
    constructor(
        public _ubi: UbicacionService,

    ) { }

    discernir(punto, calleValida, errorDeInterseccion, direccionValida, datosCalle, alturaCalle, busquedaManual, nombreCalle?: ""): Observable<any> {
        return new Observable((observer) => {
            var objeto: objeto_devuelto;
            objeto = {
                puntoPedido: null,
                direccionValida: false,
                alturaPosicionada: null,
                observaciones: '',
                geoCoding: false,
                errorGeocoding: false,
                nombreCalle: '',
                interseccion: '',
                localidad: ''
            }
            var puntoPedido: any;
            //Si encontró una calle pasaría por aquí
            //            console.log("Condición 1: ", calleValida, direccionValida, datosCalle, alturaCalle, busquedaManual);

            if (punto.lat && calleValida && !direccionValida && datosCalle && alturaCalle > 1 && busquedaManual) {

                objeto.puntoPedido = datosCalle;
                objeto.puntoPedido.lat = punto.lat;
                objeto.puntoPedido.lon = punto.lon;
                objeto.puntoPedido.altura = 1;
                objeto.direccionValida = true;
                objeto.nombreCalle = nombreCalle;

                observer.next(objeto);
                return;
            }

            //Encontré la calle pero no la intersección
            if (punto.lat && calleValida && !direccionValida && datosCalle && errorDeInterseccion && busquedaManual) {
                console.warn("Encontré la calle pero no la intersección");
                objeto.puntoPedido = datosCalle;
                objeto.puntoPedido.lat = punto.lat;
                objeto.puntoPedido.lon = punto.lon;
                objeto.puntoPedido.altura = 1;
                objeto.direccionValida = true;
                objeto.nombreCalle = nombreCalle;

                observer.next(objeto);
                return;
            }

            //Si no se ha encontrado la calle pero se ingresó un dato manualmente
            //            console.log("Condición 2: ", alturaCalle, busquedaManual, nombreCalle);

            if (nombreCalle.length > 2 && punto.lat && alturaCalle > 1 && busquedaManual) {

                objeto.puntoPedido = {};
                objeto.puntoPedido.calle = nombreCalle;
                objeto.puntoPedido.altura ? objeto.puntoPedido.altura = alturaCalle : objeto.puntoPedido.altura = 1;
                objeto.puntoPedido.lat = punto.lat;
                objeto.puntoPedido.lon = punto.lon;
                objeto.direccionValida = true;
                objeto.nombreCalle = nombreCalle;

                observer.next(objeto);
                return;
            }
            //console.log("Condición 3:",datosCalle, alturaCalle, busquedaManual, punto.inverseGeocoding);

            if ((!datosCalle && punto.lat && !alturaCalle) || (!busquedaManual && punto.inverseGeocoding)) {
                console.log("Ir a getCallejeroXY", punto.lat, punto.lon);

                this._ubi.reverseGeocoding(punto.lat, punto.lon).subscribe(response => {
                    objeto.geoCoding = true;

                    if (response.jsData.length > 0) {
                        var intersectante: string[] = [];
                        intersectante[0] = "";
                        var j: number = 0;
                        objeto.nombreCalle = response.jsData[0].nombre;
                        var datos = response.jsData[0];
                        objeto.alturaPosicionada = Math.round(datos.altura);

                        if (Math.abs(datos.altura - datos.desde_par) < 10 || Math.abs(datos.hasta_impa - datos.altura) < 10) {
                            //console.log("Hay intersección");
                            objeto.interseccion = response.jsData[1].nombre;
                        }

                        else {
                            for (var i = 1; i < response.jsData.length; i++) {
                                if (response.jsData[i].nombre != objeto.nombreCalle && response.jsData[i].nombre != intersectante[0]) {
                                    intersectante[j] = response.jsData[i].nombre;
                                    j++;
                                }
                                if (j > 1)
                                    break;
                            }
                        }
                        objeto.localidad = response.jsData[0].localidad;
                        objeto.puntoPedido = {};
                        objeto.puntoPedido.lat = punto.lat;
                        objeto.puntoPedido.lon = punto.lon;
                        if (intersectante[1] != '')
                            objeto.observaciones = "entre " + intersectante[0] + " y " + intersectante[1];
                        objeto.direccionValida = true;
                    }
                    else {
                        objeto.errorGeocoding = true;
                    }
                    observer.next(objeto);
                });
            }
            //  observer.next("No entré a ninguna condición");
        }).pipe(take(1));

    }
}

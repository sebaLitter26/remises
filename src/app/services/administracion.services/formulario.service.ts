import { Injectable } from '@angular/core';

import { Subscription, combineLatest, from } from 'rxjs';
import { take, switchMap, single, map } from 'rxjs/operators'

//ngrx
import { Store, select } from '@ngrx/store';
import { AdministracionState } from '../../store/administracion.reducers';


import { QuestionBase } from '../../models/administracion.models/index.models';

import { DropdownQuestion, TextboxQuestion, SliderQuestion, MapQuestion } from '../../shared/administracion.components/index.components';

import {
    CARGA_MAPA, MODULOS
} from '../../shared/administracion/actions';

@Injectable()
export class QuestionService {

    //@select() datos;
    //@select() nombre;
    public filtros: any;
    tabla: string = '';
    columna: any;
    modo: any;
    dato: any = null;

    constructor(
        private store: Store<AdministracionState>,     //ngrx
    ) { }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    getQuestions(columna, modo) {
        if (!columna)
            return;

        //var observable_datos = null;
        //console.log('tabla', columna);

        var questions: QuestionBase<any>[] = [];
        columna.forEach(element => {
            console.warn(element);
            questions.push(this.obtener_input(element));

        });

        var datos_combinados = combineLatest(
            this.store.select(state => state['administracion'].datos.nombre).pipe(
                switchMap(tabla => {
                    let tabla_datos = MODULOS[tabla][0].nombre;
                    let tabla_relaciones = MODULOS[tabla][4].nombre;
                    console.log(tabla, tabla_relaciones);
                    return combineLatest(
                        this.store.select(state => state['administracion'].datos[tabla_datos]),
                        this.store.select(state => state['administracion'].datos[tabla_relaciones])
                    );
                })

            ),

            this.store.select(state => state['administracion'].datos.idCampo)
        ).pipe(
            take(1)
        );

        datos_combinados.subscribe(
            ([datos_tabla, dato_modificar]) => {
                if (!dato_modificar)
                    return;

                //console.log('tabla_relacionales', datos_tabla);
                let tabla_primaria = datos_tabla[0];
                let tabla_relacionales = datos_tabla[1];


                var modif_dato = null;
                if (tabla_relacionales) {
                    let id = tabla_primaria;
                    //console.log('id cliente', id);

                    modif_dato = this.llenar_questions(id, tabla_relacionales);
                } else {
                    modif_dato = this.llenar_questions(dato_modificar, tabla_primaria);
                }

                questions.forEach((element, index, questions_array) => {
                    //console.log('holaa', element, modo.accion);
                    //if (element.destino != 'grilla') {
                    if (modo.accion != 'filtrar') {
                        //console.log('hola', questions_array[index].key, modif_dato[element.key]);
                        questions_array[index].value = (modif_dato) ? modif_dato[element.key] : null;
                        //console.log('questions', questions[index].value, element);
                    }
                    /*
                    if (element.field != 'map' || !this.isEmpty(modif_dato) || modo.accion != 'filtrar') {      //Explicación de este IF dada abajo (*)
                        questions.push(this.obtener_input(element));
                    }
                    */
                    //}
                });

                //console.log("QUESTIONS", modif_dato, questions);
            });




        //dato_observer.unsubscribe();
        console.warn("Estoy en formularioService " , questions);
        return questions;
        //return questions.sort((a, b) => a.order - b.order);
    }


    llenar_questions(id, datos_tabla) {
        //console.log('tabla', datos_tabla, id);

        var modif_dato = datos_tabla.find(dato => {
            return id == dato.id
        });
        //console.log('tabla', datos_tabla, id, modif_dato);
        if (modif_dato && modif_dato < 0)
            return;
        else
            return modif_dato;



    }


    /*
      (*) Explicación de la condición
      -Si el elemento es "mapa" y no hay datos, no entra al if -> es la condición que busco para el filtro; no dibujar el mapa.
      -Si hay dato -> estoy en el pop-up de modificación y dibujo el mapa.
    */

    obtener_input(filtro): QuestionBase<any> {
        let input: QuestionBase<any>;
        switch (filtro.tipo) {
            case 'dropdown':
                input = new DropdownQuestion({
                    key: filtro.field,
                    label: filtro.headerName,
                    options: this.datos_dropdown(filtro.tabla),
                    value: filtro.valor,
                    order: 1
                });
                break;
            case 'textbox':
                input = new TextboxQuestion({
                    key: filtro.field,
                    label: filtro.headerName,
                    value: filtro.valor,
                    maxlength: filtro.maxlength,
                    required: filtro.required ? filtro.required : false,
                    order: 1
                });
                break;
            case 'slider':
                input = new SliderQuestion({
                    key: filtro.field,
                    label: filtro.headerName,
                    value: filtro.valor,
                    //options:filtro.valor,
                    //required: true,
                    order: 1
                });
                break;
            case 'map':
                this.datos_mapa(filtro);
                input = new MapQuestion({
                    key: filtro.field,
                    label: filtro.headerName,
                    value: filtro.valor,
                    //options: this.datos_mapa(),
                    //required: true,
                    order: 1
                });
                break;
            default:
                console.log("error al cargar input del filtro ", filtro);
        }

        return input;

    }

    datos_mapa(datos) {
        let mapa = {
            //width: 50,
            //height: 40,
            permisos: true,
            marcadores: null,
            coordenadas: datos.valor,
        };
        this.store.dispatch({ type: CARGA_MAPA, mapa: mapa });
    }

    datos_dropdown(tabla: string) {
        let observable = MODULOS[tabla][0].nombre;
        var dropdown_dato = [];
        let observ = this.store.select(state => state['administracion'].datos[observable]).subscribe(datos => {
            if (Array.isArray(datos)) {
                var campo = this.harcodear_dropdown(tabla);

                datos.forEach((elem) => {
                    dropdown_dato.push({ key: elem.id, value: elem[campo] });
                });
            }
        });
        observ.unsubscribe();

        return dropdown_dato;
    }

    harcodear_dropdown(tabla: string) {

        let combo = {
            division_territorial: "nombre",
            empresa: "codigo",
            cliente: "apenom",
            ficha: "valor",
            servicio: "descripcion",
            movil: "dominio",
        }
        return combo[tabla];
    }

    /*
        getFiltros(datos) {
            /*
            Object.keys(event).forEach(k => (!event[k] && event[k] !== undefined) && delete event[k]);
            event['tabla'] = this.name;
            let busqueda = JSON.stringify(event);
            console.log(busqueda);

            this.nombre.subscribe(nombre => { datos.tabla = nombre; });


            this._api.post('filtrados', datos).subscribe(response => {
                if (response.status == 'success') {
                    this.sendMessage(response.datos);
                }
                else {
                    console.log("Falla!", response);
                }
            },
                error => {
                    console.log(<any>error);
                }
            );
        }

        */
}

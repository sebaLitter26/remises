import { Component, OnInit } from '@angular/core';

import { trigger, style, animate, transition } from '@angular/animations';

import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { Point, LineString, Polygon } from 'ol/geom';
import { Style, Fill, Stroke, Circle, Text, Icon } from 'ol/style';
import * as proj from 'ol/proj';
import * as extent from 'ol/extent';
import * as  coordinate from 'ol/coordinate';

import TileLayer from 'ol/layer/Tile';
import Vector from 'ol/layer/Vector';

import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';

import FontSymbol from 'ol-ext/style/FontSymbol';

import { PopupService } from '../../services/index.services';


import { Draw, Modify, Snap, Select } from 'ol/interaction';


import { of, Observable, Subject, Subscription, from } from 'rxjs';

import { take, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.reducer';
import {
    MODIFICAR_CALLE,
    ACTUALIZAR_VISTA_MAPA,
    MODIFICAR_VARIAS_CALLES
} from '../../store/actions';

import { MatSnackBar } from '@angular/material';
//import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Direccion, Mapa, Calle } from '../../models/index.models';

import { UbicacionService } from '../../services/ubicacion.service';
import { NavService } from '../../services/nav.service';

@Component({
    selector: 'app-mapa-zona',
    templateUrl: './mapa_editar_zona.component.html',
    styleUrls: ['./mapa_editar_zona.component.scss'],
    //providers: [], //Inyección de dependencias

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

export class MapaZonasComponent implements OnInit {
    map: any = null;
    flechita: Draw = null;
    SourceZonas = new VectorSource();
    SourceVector = new VectorSource();
    modoEdicion: boolean = false;

    container: any = null;
    content: any = null;
    closer: any = null;
    overlay: any;

    subject_parametros$ = new Subject<any>();
    info_zona: any = null;


    modificar_zona: any = null;
    select_zona: any = null;
    selectedFeatures: any[] = [];
    zona_feature: any = null;
    draw_polyline: any = null;
    draw_linestring: any = null;
    zona: any = null;
    campos_zona_iguales: Calle = null;

    descripcion: string = '';

    zonas: any;
    filtro_zonas: any;
    idzona: number;

    color = 'accent';
    dia_noche = false;
    mostrar_zona = true;
    mostrar_parada = true;


    constructor(
        private router: ActivatedRoute,
        private store: Store<AppState>,
        public snackBar: MatSnackBar,
        private _dialog: PopupService,
        public _ubi: UbicacionService,
        public _nav: NavService,
    ) {
        //this._ubi.checkeo_inicial_logueado();
    }

    ngOnInit() {
        //this.coords = { lat: -38.003038, lon: -57.57109 };
        //this.coords = { lat: 0, lon: 0 };

        if (!this.map && this._ubi.usuario_logueado) {
            this._ubi.getZonas().subscribe(response => {

                this.zonas = response;
                /*
                this.zonas.map(zona => {
                    return zona.tipo == 'zona';
                });
                */


                let hours = new Date().getHours();
                let isDayTime = hours > 6 && hours < 20;

                this.filtroDiurnoNocturno(isDayTime);
                this.zona = this.filtro_zonas[0];

                this.initOSM();


            });

            //if (this.map && this._ubi.usuario_logueado)
            //this.trazar_zona(zonas, this.SourceZonas);

            /*
            if (this._ubi.usuario_logueado) {
                this.store.select(state => state['zonajero'].zonajero.zonas).subscribe(zonas => {
                    //console.warn("Llamo a trazar zonajero", zonas);
                    if (this.map && this._ubi.usuario_logueado)
                        this.trazar_zona(zonas, this.SourceZonas);
                });
                this.store.select(state => state['zonajero'].zonajero.actualizarVista).subscribe(zonas => {
                    //console.error("Llamo a obtener zonas", zonas);
                    if (zonas && zonas.hasOwnProperty('idzonajero'))
                        this.SourceZonas.removeFeature(this.SourceZonas.getFeatureById(zonas.idzonajero));
                    this.obtener_zonas();
                });
            }
            */

        }
    }

    solicitar_zona(zona) {
        this.zona = zona;
        console.log('solicitar_zona', zona);
        this.trazar_zona(zona, this.SourceZonas);
    }

    filtroDiurnoNocturno(event) {
        var filtrado = [];
        this.dia_noche = event;
        if (event)
            filtrado = this.zonas.filter(zona => zona.nombre.slice(-1) != "N");
        else
            filtrado = this.zonas.filter(zona => zona.nombre.slice(-1) == "N");
        this.filtro_zonas = filtrado;
    }


    abrir_popup(feature_zona, evento) {
        //if (this.modoEdicion)
        //    return;
        //console.log("ABRIR EL POPUP DE EDITAR CALLE", feature_zona.getStyle(), evento);
        //let zona = feature_zona.getStyle()[0];
        //zona.getStroke().setColor('lightblue');
        this.info_zona = feature_zona.get('info_tramo');
        /*

        var zonas_selector = this.zonas.map(zona => {
            return { nombre: zona.nombre, idzona: +zona.idzona };
        });
        this.info_zona['zonas_selector'] = zonas_selector;

        */
        console.log('abrir_popup', this.info_zona);
        this.content.innerHTML = '';
        this.subject_parametros$.next(this.info_zona);
        //this.store.dispatch({ type: MODIFICAR_CALLE, zona: this.info_zona });


        var posicionPopup = (evento.coordinate) ? evento.coordinate : this.info_zona['coordinate'];
        this.overlay.setPosition(posicionPopup);
    }

    initOSM() {
        var hayFeature = false;

        //var crd = this.coords;
        var raster = new TileLayer({
            source: new OSM()
        });

        this.overlay = new Overlay({
            element: document.getElementById('popup'),

            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }

        });
        this.map = new Map({
            layers: [raster],
            target: 'map',
            //overlays: [this.overlay],
            view: new View({
                center: proj.fromLonLat([this._ubi.coords.lon, this._ubi.coords.lat]),
                zoom: 16
            })
        });

        this.map.addOverlay(this.overlay);



        var LayerNuevasZonas = new Vector({
            source: this.SourceVector

        });
        //this.map.addLayer(LayerNuevasZonas);

        var LayerZonas = new Vector({
            source: this.SourceZonas,
            //style: this.estilo_linea_layer
        });
        this.map.addLayer(LayerZonas);

        this.map.getViewport().addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
            this.overlay.setPosition(undefined);
            this.closer.blur();
            this.map.removeInteraction(this.flechita);
            this.map.removeInteraction(this.select_zona);
            this.map.removeInteraction(this.modificar_zona);
            this.map.removeInteraction(this.draw_polyline);
            this.map.removeInteraction(this.draw_linestring);

        });


        /*
        this.map.on('dblclick', (evt) => {
        });
        */

        this.map.on('moveend', (e) => {
            //this.obtener_zonas();
        });

        this.content = document.getElementById('popup-content');

        this.closer = document.getElementById('popup-closer');
        this.closer.addEventListener("click", (evt) => {

            this.SourceVector.clear();
            this.overlay.setPosition(undefined);
            this.closer.blur();
            return false;
        });

        this.map.on('singleclick', (evt) => {

            //hayFeature = false;
            if (this.modoEdicion)
                return;
            this.closer.click();
            evt.map.forEachFeatureAtPixel(evt.pixel, (zona: any) => {
                //hayFeature = true;


                this.zona_feature = zona;

                this.abrir_popup(zona, evt);
            }, { hitTolerance: 8 });

        });

        document.querySelector('.ol-control').remove();
        document.querySelector('.ol-control').remove();
        document.querySelector('.ol-control').remove();

        /*
                this.map.addInteraction(new Draw({
                    source: LayerZonas,
                    type: 'LineString'
                }));
                */
        /*
                this.map.on('pointermove', (e) => {
                    this.displayTooltip(e);
                });*/
    }


    getColor(zona) {
        if (!zona)
            return;
        //let color = ['lightyellow', 'lightblue', 'lightgreen', 'lightred', 'lightpurple'][i % 5];
        let estilo = { background: zona.color, color: 'darkorange' };
        if (this.zona.idzona == zona.idzona) {
            estilo['height'] = "80px";
            estilo['width'] = "150px";
            estilo['font-size'] = "30px";
            estilo['transition'] = "0.5s";
        }

        return estilo;
    }


    onUpload(parametros_modificados) {
        console.log('onupload', parametros_modificados);
        /*
        if (parametros_modificados['codigo']) {
            this.modificar_parametro(parametros_modificados);
            return;
        }

        let datos = {
            parametros: JSON.stringify(parametros_modificados)
        };


                this._api.post('setParametrosEmpresa', datos).subscribe(response => {
                    //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });

                    this.snackBar.open('Se modificaron los parametros correctamente', 'CERRAR', {
                        duration: 7000,
                    });


                },
                    error => {
                        console.log(<any>error);
                        this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                            duration: 7000,
                        });
                    }
                );
                */
    }


    /*
        displayTooltip(evt) {


            var feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature) {

                return feature;
            });


            console.log('displayTooltip', evt, feature);
            this.divTooltip.style.display = feature ? '' : 'none';
            if (feature) {
                this.ovrTooltip.setPosition(evt.coordinate);
                this.divTooltip.innerHTML = feature.get('info_tramo');
            }
        };
        */



    obtener_zonas() {

        if (!this._ubi.usuario_logueado && !this.map)
            return;
        var view = this.map.getView();
        if (view.getZoom() > 15) {

            let bounds = view.calculateExtent(this.map.getSize());
            let pos1 = [bounds[0], bounds[1]];
            let pos2 = [bounds[2], bounds[3]];
            let lonlat_top_rigth = proj.transform(pos1, 'EPSG:3857', 'EPSG:4326');
            let lonlat_bottom_left = proj.transform(pos2, 'EPSG:3857', 'EPSG:4326');


            let data = {
                top: lonlat_top_rigth[1],
                right: lonlat_top_rigth[0],
                bottom: lonlat_bottom_left[1],
                left: lonlat_bottom_left[0],
            };

            //this._ubi.tramos_zonajero(data);
        }
    }

    mouse_over(modo) {
        //console.log('mouse_over', modo);
        switch (modo) {
            case 'edicion':
                this.descripcion = 'Editar Tramo';
                break;
            case 'edicion_multiple':
                this.descripcion = 'Haga un poligono uniendo los dos extremos para editar la zona ';
                break;
            case 'nuevo':
                this.descripcion = 'Haga click en el mapa indicando el inicio de la zona y desplace dibujando la zona. Finalice el tramo con doble-click';
                break;
            default:
                this.descripcion = '';

        }
    }

    editar_tramo() {

        this.cambiar_modo_ecicion();
        //var zona = this.zona.get('info_tramo');
        //console.log('zona', zona);
        //let marcador_zona = this.SourceZonas.getFeatureById(this.zona.idzonajero);
        if (this.modoEdicion) {

            this.select_zona = new Select({
                wrapX: false
            });

            this.modificar_zona = new Modify({
                features: this.select_zona.getFeatures()
            });
            this.modificar_zona.on('modifyend', (e) => {
                console.log('drawend', e.feature);
                let zona_feature = e.features.getArray()[0];
                let zona = zona_feature.get('info_tramo');

                zona['zonas_puntos'] = [];
                var coords = zona_feature.getGeometry().getCoordinates()[0];
                if (coords && coords.length > 0) {
                    let coor: any;
                    coords.forEach(coor => {
                        coor = proj.transform(coor, 'EPSG:3857', 'EPSG:4326');
                        zona['zonas_puntos'].push({ lat: coor[1], lon: coor[0] });
                    });
                }


                if (zona && zona.zonas_puntos) {
                    zona.coordenadas = JSON.stringify(zona.zonas_puntos);
                    console.log('zonaa', zona);
                    this._ubi.actualizar_zona_ubi(zona).subscribe(datos => {

                        this.zonas.map((zona_array, pos, arr_zona) => {
                            if (zona_array.idzona == this.zona.idzona) {
                                zona_array.zonas.map((zon, i, arr) => {
                                    if (zon.descrip == zona.descrip) {
                                        console.log('zon', zon);
                                        console.log('zona', zona);
                                        arr[i] = zona;
                                        //this.SourceZonas.clear();
                                        this.map.removeInteraction(this.modificar_zona);
                                        this.map.removeInteraction(this.select_zona);
                                        this.trazar_zona(arr_zona[pos], this.SourceZonas);

                                    }
                                });

                            }

                        });

                    });

                }

            });


            this.map.addInteraction(this.modificar_zona);
            this.map.addInteraction(this.select_zona);
        }



    }

    nuevo_tramo(descrip: string) {
        if (this.modoEdicion) {
            this.cambiar_modo_ecicion();


            this.flechita = new Draw({
                source: this.SourceVector,
                type: 'Polygon',
                //stopClick: true,
            });
            this.map.addInteraction(this.flechita);

            this.flechita.on('drawend', (evt) => {
                //evt.feature.setStyle(this.estilo_linea());

                var zona_nueva = evt.feature;

                var polygon = zona_nueva.getGeometry();  //.getExtent();
                var bounds = polygon.getExtent();

                console.log('bounds', bounds);

                let pos1 = [bounds[0], bounds[1]];
                let pos2 = [bounds[2], bounds[3]];
                let lonlat_top_rigth = proj.transform(pos1, 'EPSG:3857', 'EPSG:4326');
                let lonlat_bottom_left = proj.transform(pos2, 'EPSG:3857', 'EPSG:4326');



                var coordinate = polygon.getCoordinates()[0];



                var data = {
                    color: "#ff0000",
                    descrip: descrip,
                    id: zona_nueva.id,
                    lat: "0",
                    lon: "0",
                    zonas_puntos: [],
                    coordinate: coordinate[0],
                    top: lonlat_top_rigth[1],
                    right: lonlat_top_rigth[0],
                    bottom: lonlat_bottom_left[1],
                    left: lonlat_bottom_left[0],
                };

                if (coordinate && coordinate.length > 0) {
                    coordinate.forEach(coor => {
                        let punto = proj.transform(coor, 'EPSG:3857', 'EPSG:4326');
                        //console.log('nuevo_tramo punto', punto, coor);
                        data['zonas_puntos'].push({ lat: punto[1], lon: punto[0] });
                    });

                    zona_nueva.set('info_tramo', data);
                    zona_nueva.setId(-1);

                    this.SourceZonas.addFeature(zona_nueva);

                    this.abrir_popup(zona_nueva, evt);

                }
                this.map.removeInteraction(this.flechita);

            });

        }

    }

    editar_muchos_tramos() {
        this.cambiar_modo_ecicion();
        if (this.modoEdicion) {
            /*
                        this.select_zona = new Select({
                            wrapX: false
                        });
            */

            this.modificar_zona = new Modify({
                features: new Collection()
            });



            this.draw_polyline = new Draw({
                source: this.SourceZonas,
                type: 'Polygon',
                //only draw when Ctrl is pressed.
                //condition: events.condition.platformModifierKeyOnly
            });


            this.draw_polyline.on('drawend', (e) => {

                // features that intersect the box are added to the collection of
                // selected features, and their names are displayed in the "info"
                // div
                var polygon = e.feature.getGeometry();  //.getExtent();
                var extent = polygon.getExtent();
                //console.log('extent', extent);
                this.selectedFeatures = [];
                this.SourceZonas.forEachFeatureIntersectingExtent(extent, (zona_feature) => {
                    let zona = zona_feature.get('info_tramo');
                    var coords = zona_feature.getGeometry().getCoordinates();
                    //console.log('polygon extend', coords, polygon.intersectsCoordinate(coords[0]));
                    if (zona && polygon.intersectsCoordinate(coords[0]) && polygon.intersectsCoordinate(coords[1]))
                        this.selectedFeatures.push(zona);
                });
                this.editar_varias_zonas(this.selectedFeatures);

            });
            this.map.addInteraction(this.modificar_zona);
            //this.map.addInteraction(this.select_zona);
            this.map.addInteraction(this.draw_polyline);
        }
        /*else {
            //this.map.removeInteraction(this.select_zona);
            this.map.removeInteraction(this.modificar_zona);
            this.map.removeInteraction(draw);
        }
        */
    }

    editar_varias_zonas(zonas: any[]) {
        //console.log('zonas', zonas)
        if (zonas.length < 1)
            return;
        let data = { datos: zonas };
        let parametros = { data: data, width: 800 }; //, height: 1200 };

        //let modificacion_datos = { campos_zona: campos_zona };
        this.store.dispatch({ type: MODIFICAR_VARIAS_CALLES, zonas: zonas });

        this._dialog.abrir(parametros, 'editar-muchas-zonas').subscribe(datos => {
            console.log("Cerró POPUP");
            this.map.removeInteraction(this.modificar_zona);
            this.map.removeInteraction(this.draw_polyline);
        });
    }




    cambiar_modo_ecicion() {


        if (this.modoEdicion) {

            this.map.removeInteraction(this.select_zona);
            this.map.removeInteraction(this.modificar_zona);
            this.map.removeInteraction(this.draw_polyline);
            this.map.removeInteraction(this.draw_linestring);
            this.map.removeInteraction(this.flechita);

        }
        //this.modoEdicion = !this.modoEdicion;
    }

    borrar_zona(zona) {


        let zona_a_borrar = { ids: '', idzona: zona.idzona };
        let sep = '';
        zona.zonas.forEach(zon => {
            zona_a_borrar['ids'] += sep + zon.id;
            sep = ',';
        });


        this._ubi.borrar_zona_ubi(zona_a_borrar).subscribe(response => {
            /*
            this.zonas = this.zonas.map(zon => {
                if (zon.idzona != zona_a_borrar.idzona)
                    return zon;
            });
            this.filtro_zonas = this.filtro_zonas.map(zon => {

                if (zon.idzona != zona_a_borrar.idzona)
                    return zon;
            });
            */



            let index: number = this.zonas.findIndex(z => z.idzona === zona_a_borrar.idzona);
            if (index > -1) {
                this.zonas.splice(index, 1);
            }



            index = this.filtro_zonas.findIndex(z => z.idzona === zona_a_borrar.idzona);
            if (index > -1) {
                this.filtro_zonas.splice(index, 1);
            }
            this.solicitar_zona(this.filtro_zonas[index]);



            this.snackBar.open('Se Borro la Zona ' + zona.nombre + ' correctamente', 'CERRAR', {
                duration: 7000,
            });


            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
            //this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
            //this.borradoCorrecto = true;
            //this.edicionCorrecta = true;
            //this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: { idzonajero: this.zona.idzonajero } });
        },
            error => {
                console.log(<any>error);
            }
        );

        /*
                this._dialog.abrir({
                    width: '400px',
                    height: '300px',
                    data: {
                        pregunta: "¿Desea Borrar la zona " + this.zona.nombre + " ?",
                        //titulo: 'Observaciones',
                        //altura: '923',
                        fecha: new Date(),
                        //localidad: 'Hola'
                    }
                }).subscribe(datos => {
                    if (datos) {
                        console.log("cerro dialog", datos);
                        this._ubi.borrar_zona_ubi(this.zona).subscribe(response => {
                            console.log(response);
                            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
                            //this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
                            //this.borradoCorrecto = true;
                            //this.edicionCorrecta = true;
                            //this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: { idzonajero: this.zona.idzonajero } });
                        },
                            error => {
                                console.log(<any>error);
                            }
                        );

                    } else {
                        // User clicked 'Cancel' or clicked outside the dialog
                    }
                });

                */
    }

    estilo_linea(zona?: any) {

        var texto: string = (zona && zona.nombre) ? zona.tipo + ' ' + zona.nombre : '';
        //var rotacion: number = (zona && zona.rotation) ? +zona.rotation : 0;
        var ancho = (zona && zona.tipozona) ? zona.tipozona : 6;

        return [
            // linestring
            new Style({
                stroke: new Stroke({
                    color: zona.color,
                    width: ancho + 2
                })
            }),
            new Style({
                text: new Text({
                    text: texto,//(this.map.getView().getZoom() > (limitetexto)) ? zona.nombre : '',
                    //offsetY: 25 * Math.sin((parseInt(movil.rumbo)+90) * (0.0174533)),
                    //offsetX: 25 * Math.cos((parseInt(movil.rumbo)+90) * (0.0174533)),
                    //offsetY: 0, //((this.map.getView().getZoom() > limitezoom) ? -22 : -10),
                    //rotation: rotacion,
                    rotateWithView: true,
                    font: 'Bold 12px Arial',
                    fill: new Fill({
                        color: '#000000'
                    }),
                    stroke: new Stroke(
                        {
                            color: '#FFFFFF',
                            width: 1
                        })
                })
            })
        ];
    }

    estilo_linea_layer(feature_zona: any, resolution) {

        var zona = feature_zona.get('info_tramo');


        if (!zona)
            return;
        //let altura_desde: String = (zona.desde_par && resolution < 2) ? zona.desde_par : '';
        //let altura_hasta: String = (zona.hasta_impa && resolution < 2) ? zona.hasta_impa : '';
        /*  if (zona)
              alturas = (+zona.sentido > 0) ? ' (' + zona.desde_impa + ' - ' + zona.hasta_par + ' )';
              */

        var rotacion: number = (zona.rotation) ? +zona.rotation : 0;
        var ancho = (zona.tipozona) ? zona.tipozona + 1 : 6;

        var color = 'yellow';
        /*
        if (zona && zona.sentido) {
            switch (+zona.sentido) {
                case 0: color = '#0000FF'; break;
                case 1: color = '#00FF00'; break;
                case 2: color = '#FF0000'; break;
                default: color = 'black';
            }
        }
        */
        var style = [
            // linestring
            new Style({
                stroke: new Stroke({
                    color: color,
                    width: ancho - resolution
                })
            })



        ];

        if (resolution < 2.5) {
            style.push(new Style({
                text: new Text({
                    text: zona.nombre,
                    rotation: rotacion,
                    rotateWithView: true,
                    font: 'Bold 12px Arial',
                    fill: new Fill({
                        color: '#000000'
                    }),
                    stroke: new Stroke(
                        {
                            color: '#FFFFFF',
                            width: 2
                        })
                })
            }));
        }

        var geometry = feature_zona.getGeometry();

        geometry.forEachSegment((start, end) => {
            var centro = (zona.offset < 0) ? [start[0] + end[0], start[1] + end[1]] : [end[0] + start[0], end[1] + start[1]];
            centro = [centro[0] / 2, centro[1] / 2];
            //console.log(start, end, centro);
            if (resolution < 2) {

                if (+zona.sentido == 0) {
                    /*
                    style.push(new Style({
                        geometry: new Point(centro),
                        image: new Icon({
                            src: 'assets/shortarrow.png',
                            anchor: [0.75, 2.5],
                            scale: 0.8,
                            color: '#DC143C',
                            rotateWithView: true,
                            //rotation: rotacion
                            rotation: rotacion
                        })
                    }));
                    */
                    style.push(new Style({
                        geometry: new Point(centro),
                        image: new Icon({
                            src: 'assets/doblemano.png',
                            anchor: [30, -10],
                            anchorXUnits: 'pixel',
                            anchorYUnits: 'pixel',
                            scale: 1,
                            color: '#DC143C',
                            rotateWithView: true,
                            //rotation: rotacion
                            rotation: rotacion - Math.PI
                        })
                    }));
                } else {
                    style.push(new Style({
                        geometry: new Point(centro),
                        image: new Icon({
                            src: 'assets/shortarrow.png',
                            anchor: [0, -10],
                            anchorXUnits: 'pixel',
                            anchorYUnits: 'pixel',
                            scale: 1,
                            color: '#DC143C',
                            rotateWithView: true,
                            //rotation: rotacion
                            rotation: ((zona.sentido == 2 && zona.offset > 0) || (zona.sentido == 1 && zona.offset < 0)) ? rotacion - Math.PI : rotacion
                        })
                    }));
                }
            }

            if (resolution < 0.7) {
                style.push(new Style({
                    geometry: new Point(start),
                    text: new Text({
                        text: zona.desde_par,//(this.map.getView().getZoom() > (limitetexto)) ? zona.nombre : '',
                        //offsetY: 25 * Math.sin((parseInt(movil.rumbo)+90) * (0.0174533)),
                        //offsetX: 25 * Math.cos((parseInt(movil.rumbo)+90) * (0.0174533)),
                        //offsetY: 0, //((this.map.getView().getZoom() > limitezoom) ? -22 : -10),
                        rotation: rotacion,
                        rotateWithView: true,
                        offsetX: 40 * zona.offset,
                        //offsetY: 25,
                        font: 'Bold 12px Arial',
                        fill: new Fill({
                            color: 'black'
                        }),
                        stroke: new Stroke(
                            {
                                color: '#FFFFFF',
                                width: 1
                            })
                    })
                }));
                style.push(new Style({
                    geometry: new Point(end),
                    text: new Text({
                        text: zona.hasta_impa,//(this.map.getView().getZoom() > (limitetexto)) ? zona.nombre : '',
                        //offsetY: 25 * Math.sin((parseInt(movil.rumbo)+90) * (0.0174533)),
                        //offsetX: 25 * Math.cos((parseInt(movil.rumbo)+90) * (0.0174533)),
                        //offsetY: 0, //((this.map.getView().getZoom() > limitezoom) ? -22 : -10),
                        rotation: rotacion,
                        rotateWithView: true,
                        //offsetY: 0,
                        offsetX: -40 * zona.offset,
                        font: 'Bold 12px Arial',
                        fill: new Fill({
                            color: 'black'
                        }),
                        stroke: new Stroke(
                            {
                                color: '#FFFFFF',
                                width: 1
                            })
                    })
                }));
            }
        });

        return style;
    }

    /*
        dibujar_zona(zona_puntos) {
            let style = []; //this.estilo_linea(zona);
            let contorno_zona = null;

            contorno_zona = new Feature({
                geometry: new LineString(zona_puntos['coordenadas']),
                name: 'Line'
            });


            //contorno_zona.setStyle(style);
            contorno_zona.setId(zona.idzonajero);
            contorno_zona.set('info_zona', zona);
            return contorno_zona;
        }

        */

    setCenter(lat, lon) {
        var view = this.map.getView();
        view.setCenter(proj.fromLonLat([+lon, +lat]));
        //view.setZoom(14);
    }

    trazar_zona(zonas, Source) {
        Source.clear();
        console.log('trazar_zona', zonas);
        zonas['zonas'].forEach((zona) => {

            let style = this.estilo_linea(zona);
            switch (zona.descrip) {
                case 'puntero':
                    this.setCenter(zona.lat, zona.lon);
                    break;
                case 'zona':
                    if (this.mostrar_zona && zona['zonas_puntos']) {
                        var polyline = this.dibujar_zona(zona['zonas_puntos']);
                        Source.addFeature(polyline);
                        polyline.setStyle(style);
                        polyline.set('info_tramo', zona);
                        polyline.setId(zona.id);
                    }

                    break;
                case 'parada':
                    if (this.mostrar_parada && zona['zonas_puntos']) {
                        var polyline = this.dibujar_zona(zona['zonas_puntos']);
                        polyline.setStyle(style);
                        polyline.set('info_tramo', zona);
                        polyline.setId(zona.id);

                        Source.addFeature(polyline);
                    }

                    break;
            }

            //TENGO QUE DARLE UN ID FALSO
            //evt.feature.setId(-1);





            /*
            if (zona.idzonajero >= 0) {
                let marcador_zona = Source.getFeatureById(zona.idzonajero);
                let coordinates = [
                    proj.fromLonLat([parseFloat(zona.desde_x), parseFloat(zona.desde_y)]),
                    proj.fromLonLat([parseFloat(zona.hasta_x), parseFloat(zona.hasta_y)])
                ];

                zona['coordenadas'] = coordinates;

                var dx = coordinates[1][0] - coordinates[0][0];  //longitud
                var dy = coordinates[1][1] - coordinates[0][1];     //latitud

                zona['rotation'] = -Math.atan2(dy, dx);
                zona['offset'] = 1;

                //if ((dx < 0 && dy > 0) || (dx < 0 && dy < 0)) {
                if (dx < 0) {
                    zona['rotation'] -= Math.PI;
                    zona['offset'] = -1;
                }


                /*
                                if (dx < 0 && dy > 0)
                                    zona['rotation'] -= Math.PI;
                                if (dx < 0 && dy < 0)
                                    zona['rotation'] -= Math.PI;

                var line = this.dibujar_zona(zona);

                if (!marcador_zona) {
                    Source.addFeature(line);
                } else {
                    marcador_zona.setStyle(line.getStyle());
                    marcador_zona.set('info_tramo', zona);

                    //console.log("Marcador zona", marcador_zona.getGeometry());
                }
                */
            //}

        });
        //this.obtener_zonas();
        var view = this.map.getView();
        //view.setZoom(view.getZoom()+1 );
    }

    dibujar_zona(zona_puntos) {
        if (!zona_puntos)
            return;
        var bordes: any[] = [];
        zona_puntos.forEach((punto) => {
            bordes.push(proj.transform([+punto['lon'], +punto['lat']], 'EPSG:4326', 'EPSG:3857'))

        });

        var poligono = new Polygon([bordes]);
        var featurething = new Feature({
            name: "Thing",
            geometry: poligono
        });
        return featurething;
    }

}

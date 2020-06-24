import { Component, OnInit, HostListener } from '@angular/core';

import { trigger, style, animate, transition } from '@angular/animations';

import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import Collection from 'ol/Collection';
import Feature from 'ol/Feature';
import { Point, LineString } from 'ol/geom';
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


import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.reducer';
import {
    MODIFICAR_CALLE,
    ACTUALIZAR_VISTA_MAPA,
    MODIFICAR_VARIAS_CALLES
} from '../../store/actions';

export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37,
    ESCAPE = 27,
  }

import { MatSnackBar } from '@angular/material';
//import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Direccion, Mapa, Calle } from '../../models/index.models';

import { UbicacionService } from '../../services/ubicacion.service';
import { NavService } from '../../services/nav.service';

@Component({
    selector: 'app-mapa-callejero',
    templateUrl: './mapa_editar_callejero.component.html',
    styleUrls: ['./mapa_editar_callejero.component.scss'],
    host: {
        '(document:keypress)': 'handleKeyboardEvent($event)'
      },
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

export class MapaCallejeroComponent implements OnInit {
    map: any = null;
    flechita: Draw = null;
    SourceCallejero = new VectorSource();
    SourceVector = new VectorSource();
    modoEdicion: boolean = false;

    container: any = null;
    content: any = null;
    closer: any = null;
    overlay: any;

    info_calle: Calle = null;


    modificar_calles: any = null;
    select_calles: any = null;
    selectedFeatures: any[] = [];
    calle_feature: any = null;
    draw_polyline: any = null;
    draw_linestring: any = null;
    calle: Calle = null;
    campos_calle_iguales: Calle = null;

    descripcion: string = '';


    constructor(
        private router: ActivatedRoute,
        private store: Store<AppState>,
        public snackBar: MatSnackBar,
        private _dialog: PopupService,
        public _ubi: UbicacionService,
        public _nav: NavService,
    ) {
    }

    @HostListener('window:keyup', ['$event'])
        keyEvent(event: KeyboardEvent) {
            console.log('key pressed', event);
            if (event.code === "Escape") {
                this.cambiar_modo_ecicion();
                this.modoEdicion = !this.modoEdicion;
            }
        }

    ngOnInit() {
        //this.coords = { lat: -38.003038, lon: -57.57109 };
        //this.coords = { lat: 0, lon: 0 };
        if (!this.map) {
            this._ubi.cargar_localidades().subscribe(response => {
                if (response == true)
                    this.initOSM();
            });
            if (this._ubi.usuario_logueado) {
                this.store.select(state => state['callejero'].callejero.calles).subscribe(calles => {
                    //console.warn("Llamo a trazar callejero", calles);
                    if (this.map && this._ubi.usuario_logueado)
                        this.trazar_callejero(calles, this.SourceCallejero);
                });
                this.store.select(state => state['callejero'].callejero.actualizarVista).subscribe(calles => {
                    //console.error("Llamo a obtener calles", calles);
                    if (calles && calles.hasOwnProperty('idcallejero'))
                        this.SourceCallejero.removeFeature(this.SourceCallejero.getFeatureById(calles.idcallejero));
                    this.obtener_calles();
                });
            }

        }
    }

    


    abrir_popup(feature_calle, evento) {
        //if (this.modoEdicion)
        //    return;
        //console.log("ABRIR EL POPUP DE EDITAR CALLE", feature_calle.getStyle(), evento);
        //let calle = feature_calle.getStyle()[0];
        //calle.getStroke().setColor('lightblue');
        this.info_calle = feature_calle.get('info_tramo');
        this.content.innerHTML = '';
        this.store.dispatch({ type: MODIFICAR_CALLE, calle: this.info_calle });


        var posicionPopup = (evento.coordinate) ? evento.coordinate : this.info_calle['coordinate'];
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



        var LayerNuevasFlechas = new Vector({
            source: this.SourceVector

        });
        this.map.addLayer(LayerNuevasFlechas);

        var LayerFlechas = new Vector({
            source: this.SourceCallejero,
            style: this.estilo_linea_layer
        });
        this.map.addLayer(LayerFlechas);

        this.map.getViewport().addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
            this.overlay.setPosition(undefined);
            this.closer.blur();
            this.map.removeInteraction(this.flechita);
            this.map.removeInteraction(this.select_calles);
            this.map.removeInteraction(this.modificar_calles);
            this.map.removeInteraction(this.draw_polyline);
            this.map.removeInteraction(this.draw_linestring);

        });


        /*
        this.map.on('dblclick', (evt) => {
        });
        */

        this.map.on('moveend', (e) => {
            this.obtener_calles();
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
            evt.map.forEachFeatureAtPixel(evt.pixel, (calle: any) => {
                //hayFeature = true;


                this.calle_feature = calle;

                this.abrir_popup(calle, evt);
            }, { hitTolerance: 8 });

        });

        document.querySelector('.ol-control').remove();
        document.querySelector('.ol-control').remove();
        document.querySelector('.ol-control').remove();

        /*
                this.map.addInteraction(new Draw({
                    source: LayerFlechas,
                    type: 'LineString'
                }));
                */
        /*
                this.map.on('pointermove', (e) => {
                    this.displayTooltip(e);
                });*/
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



    obtener_calles() {

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

            this._ubi.tramos_callejero(data);
        }
    }

    mouse_over(modo) {
        //console.log('mouse_over', modo);
        switch (modo) {
            case 'edicion':
                this.descripcion = 'Editar Tramo';
                break;
            case 'edicion_multiple':
                this.descripcion = 'Haga un poligono uniendo los dos extremos para editar las calles que lo contienen';
                break;
            case 'nuevo':
                this.descripcion = 'Haga click en el mapa indicando el inicio de la calle y desplace dibujando la calle. Finalice el tramo con doble-click';
                break;
            default:
                this.descripcion = '';

        }
    }

    editar_tramo() {

        this.cambiar_modo_ecicion();
        //var calle = this.calle.get('info_tramo');
        //console.log('calle', calle);
        //let marcador_calle = this.SourceCallejero.getFeatureById(this.calle.idcallejero);
        if (this.modoEdicion) {

            this.select_calles = new Select({
                wrapX: false
            });

            this.modificar_calles = new Modify({
                features: this.select_calles.getFeatures()
            });
            this.modificar_calles.on('modifyend', (e) => {
                let calle = e.features.getArray()[0];
                //let calle_modifi = calle.get('info_tramo');
                let calle_modificada = {};
                calle_modificada['idcallejero'] = calle.getId();
                let coordenadas = calle.getGeometry().getCoordinates();

                var puntoFinal = proj.transform(coordenadas[coordenadas.length - 1], 'EPSG:3857', 'EPSG:4326');
                var puntoInicial = proj.transform(coordenadas[0], 'EPSG:3857', 'EPSG:4326');
                calle_modificada['desde_x'] = puntoInicial[0];
                calle_modificada['desde_y'] = puntoInicial[1];
                calle_modificada['hasta_x'] = puntoFinal[0];
                calle_modificada['hasta_y'] = puntoFinal[1];



                this._ubi.actualizar_calle_ubi(calle_modificada).subscribe(datos => {
                    if (datos) {
                        console.log("actualizo tramo", datos);
                    }
                });

                //calle_modificada['coordenadas'] = coordenadas;
                console.log("feature id is", calle_modificada, coordenadas);
            });

            //var modify = new Modify({ features: [this.calle] });
            this.map.addInteraction(this.modificar_calles);
            this.map.addInteraction(this.select_calles);
        }
        /*else {
            this.map.removeInteraction(this.select_calles);
            this.map.removeInteraction(this.modificar_calles);
        }

        /*this.map.addInteraction(new Draw({
            source: this.SourceCallejero,
            type: 'LineString'
        }));
*/


    }

    nuevo_tramo() {
        if (this.modoEdicion) {
            this.cambiar_modo_ecicion();
            this.flechita = new Draw({
                source: this.SourceVector,
                type: 'LineString',
                stopClick: true,
            });
            this.map.addInteraction(this.flechita);

            this.flechita.on('drawend', (evt) => {
                evt.feature.setStyle(this.estilo_linea());

                //CUANDO CREO UNA NUEVA FEATURE DESDE EL DRAW TENGO QUE SACARLE LOS PUNTOS (LAT,LON)
                var calle: any;

                evt.feature.getGeometry().forEachSegment((start, end) => {
                    //console.log(end, start);
                    var puntoFinal = proj.transform(end, 'EPSG:3857', 'EPSG:4326');
                    var puntoInicial = proj.transform(start, 'EPSG:3857', 'EPSG:4326');
                    calle = {
                        desde_x: puntoInicial[0],
                        desde_y: puntoInicial[1],
                        hasta_x: puntoFinal[0],
                        hasta_y: puntoFinal[1],
                        coordinate: start,
                        idcallejero: -1,
                        abrir_posi_end: end
                    };
                });
                evt.feature.set('info_tramo', calle);
                //TENGO QUE DARLE UN ID FALSO
                //evt.feature.setId(-1);
                //this.cambiar_modo_ecicion();
                this.map.removeInteraction(this.flechita);
                this.map.removeInteraction(this.select_calles);
                this.abrir_popup(evt.feature, evt);



            });




        }
    }

    editar_muchos_tramos() {
        this.cambiar_modo_ecicion();
        if (this.modoEdicion) {
            /*
                        this.select_calles = new Select({
                            wrapX: false
                        });
            */

            this.modificar_calles = new Modify({
                features: new Collection()
            });



            this.draw_polyline = new Draw({
                source: this.SourceCallejero,
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
                this.SourceCallejero.forEachFeatureIntersectingExtent(extent, (calle_feature) => {
                    let calle = calle_feature.get('info_tramo');
                    var coords = calle_feature.getGeometry().getCoordinates();
                    //console.log('polygon extend', coords, polygon.intersectsCoordinate(coords[0]));
                    if (calle && polygon.intersectsCoordinate(coords[0]) && polygon.intersectsCoordinate(coords[1]))
                        this.selectedFeatures.push(calle);
                });
                this.editar_varias_calles(this.selectedFeatures);

            });
            this.map.addInteraction(this.modificar_calles);
            //this.map.addInteraction(this.select_calles);
            this.map.addInteraction(this.draw_polyline);
        }
        /*else {
            //this.map.removeInteraction(this.select_calles);
            this.map.removeInteraction(this.modificar_calles);
            this.map.removeInteraction(draw);
        }
        */
    }

    editar_varias_calles(calles: Calle[]) {
        //console.log('calles', calles)
        if (calles.length < 1)
            return;
        let data = { datos: calles };
        let parametros = { data: data, width: 800 }; //, height: 1200 };

        //let modificacion_datos = { campos_calle: campos_calle };
        this.store.dispatch({ type: MODIFICAR_VARIAS_CALLES, calles: calles });

        this._dialog.abrir(parametros, 'editar-muchas-calles').subscribe(datos => {
            console.log("Cerró POPUP");
            this.map.removeInteraction(this.modificar_calles);
            this.map.removeInteraction(this.draw_polyline);
        });
    }




    cambiar_modo_ecicion() {


        if (this.modoEdicion) {

            this.map.removeInteraction(this.select_calles);
            this.map.removeInteraction(this.modificar_calles);
            this.map.removeInteraction(this.draw_polyline);
            this.map.removeInteraction(this.draw_linestring);
            this.map.removeInteraction(this.flechita);

        }
        //this.modoEdicion = !this.modoEdicion;
    }

    borrar_tramo() {
        //console.log('calle borrar', this.calle);
        if (!this.calle)
            return;


        this._dialog.abrir({
            width: '400px',
            height: '300px',
            data: {
                pregunta: "¿Desea Borrar el tramo seleccionado?",
                titulo: this.calle.nombre,
                altura: this.calle.altura,
                //fecha: new Date(),
                localidad: this.calle.localidad
            }
        }).subscribe(datos => {
            if (datos) {
                console.log("cerro dialog", datos);
                this._ubi.borrar_calle_ubi(this.calle).subscribe(response => {
                    console.log(response);
                    //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
                    //this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
                    //this.borradoCorrecto = true;
                    //this.edicionCorrecta = true;
                    this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: { idcallejero: this.calle.idcallejero } });
                },
                    error => {
                        console.log(<any>error);
                    }
                );

            } else {
                // User clicked 'Cancel' or clicked outside the dialog
            }
        });
    }

    estilo_linea(calle?: any) {
        if (calle)
            var alturas: String = '(' + calle.desde_par + ' - ' + calle.hasta_impa + ' )';
        /*  if (calle)
              alturas = (+calle.sentido > 0) ? ' (' + calle.desde_impa + ' - ' + calle.hasta_par + ' )';
              */
        var texto: string = (calle && calle.nombre) ? calle.nombre + alturas : '';
        var rotacion: number = (calle && calle.rotation) ? +calle.rotation : 0;
        var ancho = (calle && calle.tipocalle) ? calle.tipocalle : 6;

        var color = 'yellow';
        /*
        if (calle && calle.sentido) {
            switch (+calle.sentido) {
                case 0: color = '#0000FF'; break;
                case 1: color = '#00FF00'; break;
                case 2: color = '#FF0000'; break;
                default: color = 'black';
            }
        }
        */

        return [
            // linestring
            new Style({
                stroke: new Stroke({
                    color: color,
                    width: ancho + 1
                })
            }),
            new Style({
                text: new Text({
                    text: texto,//(this.map.getView().getZoom() > (limitetexto)) ? calle.nombre : '',
                    //offsetY: 25 * Math.sin((parseInt(movil.rumbo)+90) * (0.0174533)),
                    //offsetX: 25 * Math.cos((parseInt(movil.rumbo)+90) * (0.0174533)),
                    //offsetY: 0, //((this.map.getView().getZoom() > limitezoom) ? -22 : -10),
                    rotation: rotacion,
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

    estilo_linea_layer(feature_calle: any, resolution) {

        var calle = feature_calle.get('info_tramo');


        if (!calle)
            return;
        //let altura_desde: String = (calle.desde_par && resolution < 2) ? calle.desde_par : '';
        //let altura_hasta: String = (calle.hasta_impa && resolution < 2) ? calle.hasta_impa : '';
        /*  if (calle)
              alturas = (+calle.sentido > 0) ? ' (' + calle.desde_impa + ' - ' + calle.hasta_par + ' )';
              */

        var rotacion: number = (calle.rotation) ? +calle.rotation : 0;
        var ancho = (calle.tipocalle) ? calle.tipocalle + 1 : 6;

        var color = 'yellow';
        /*
        if (calle && calle.sentido) {
            switch (+calle.sentido) {
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
                    text: calle.nombre,
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

        var geometry = feature_calle.getGeometry();

        geometry.forEachSegment((start, end) => {
            var centro = (calle.offset < 0) ? [start[0] + end[0], start[1] + end[1]] : [end[0] + start[0], end[1] + start[1]];
            centro = [centro[0] / 2, centro[1] / 2];
            //console.log(start, end, centro);
            if (resolution < 2) {

                if (+calle.sentido == 0) {
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
                            rotation: ((calle.sentido == 2 && calle.offset > 0) || (calle.sentido == 1 && calle.offset < 0)) ? rotacion - Math.PI : rotacion
                        })
                    }));
                }
            }

            if (resolution < 0.7) {
                style.push(new Style({
                    geometry: new Point(start),
                    text: new Text({
                        text: calle.desde_par,//(this.map.getView().getZoom() > (limitetexto)) ? calle.nombre : '',
                        //offsetY: 25 * Math.sin((parseInt(movil.rumbo)+90) * (0.0174533)),
                        //offsetX: 25 * Math.cos((parseInt(movil.rumbo)+90) * (0.0174533)),
                        //offsetY: 0, //((this.map.getView().getZoom() > limitezoom) ? -22 : -10),
                        rotation: rotacion,
                        rotateWithView: true,
                        offsetX: 40 * calle.offset,
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
                        text: calle.hasta_impa,//(this.map.getView().getZoom() > (limitetexto)) ? calle.nombre : '',
                        //offsetY: 25 * Math.sin((parseInt(movil.rumbo)+90) * (0.0174533)),
                        //offsetX: 25 * Math.cos((parseInt(movil.rumbo)+90) * (0.0174533)),
                        //offsetY: 0, //((this.map.getView().getZoom() > limitezoom) ? -22 : -10),
                        rotation: rotacion,
                        rotateWithView: true,
                        //offsetY: 0,
                        offsetX: -40 * calle.offset,
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


    dibujar_linea(calle) {
        let style = []; //this.estilo_linea(calle);
        let linea_calle = null;

        linea_calle = new Feature({
            geometry: new LineString(calle['coordenadas']),
            name: 'Line'
        });


        //linea_calle.setStyle(style);
        linea_calle.setId(calle.idcallejero);
        linea_calle.set('info_tramo', calle);
        return linea_calle;
    }

    trazar_callejero(calles, Source) {
        //Source.clear();
        calles.forEach((calle) => {
            if (calle.idcallejero >= 0) {
                let marcador_calle = Source.getFeatureById(calle.idcallejero);
                let coordinates = [
                    proj.fromLonLat([parseFloat(calle.desde_x), parseFloat(calle.desde_y)]),
                    proj.fromLonLat([parseFloat(calle.hasta_x), parseFloat(calle.hasta_y)])
                ];

                calle['coordenadas'] = coordinates;

                var dx = coordinates[1][0] - coordinates[0][0];  //longitud
                var dy = coordinates[1][1] - coordinates[0][1];     //latitud

                calle['rotation'] = -Math.atan2(dy, dx);
                calle['offset'] = 1;

                //if ((dx < 0 && dy > 0) || (dx < 0 && dy < 0)) {
                if (dx < 0) {
                    calle['rotation'] -= Math.PI;
                    calle['offset'] = -1;
                }


                /*
                                if (dx < 0 && dy > 0)
                                    calle['rotation'] -= Math.PI;
                                if (dx < 0 && dy < 0)
                                    calle['rotation'] -= Math.PI;
                */
                var line = this.dibujar_linea(calle);

                if (!marcador_calle) {
                    Source.addFeature(line);
                } else {
                    marcador_calle.setStyle(line.getStyle());
                    marcador_calle.set('info_tramo', calle);

                    //console.log("Marcador calle", marcador_calle.getGeometry());
                }
            }
        });
        //this.obtener_calles();
        var view = this.map.getView();
        //view.setZoom(view.getZoom()+1 );
    }

}

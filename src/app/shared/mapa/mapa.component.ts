import {
    Component, OnInit, Input, Output, ViewContainerRef, EventEmitter, ComponentFactory,
    ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, TemplateRef
} from '@angular/core';

import { trigger, style, animate, transition } from '@angular/animations';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import Vector from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import { Point, LineString } from 'ol/geom';
import { Style, Fill, Stroke, Circle, Text, Icon } from 'ol/style';
import * as proj from 'ol/proj';
//import { proj } from 'ol/proj'
import * as extent from 'ol/extent';
//import * as ol from 'ol';
import FontSymbol from 'ol-ext/style/FontSymbol';

import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '../../store/app.reducer';
import {
    CARGAR_NUEVO_VIAJE, CLICK_MAPA
} from '../../store/actions';

import { MatSnackBar } from '@angular/material';
//import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Direccion, Mapa } from '../../models/index.models';

import { UbicacionService } from '../../services/ubicacion.service';
import { NavService } from '../../services/nav.service';

@Component({
    selector: 'app-mapa',
    templateUrl: './mapa.component.html',
    styleUrls: ['./mapa.component.scss'],
    providers: [], //Inyección de dependencias

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

export class MapaComponent implements OnInit {

    latitude: number = 18.5204;
    longitude: number = 73.8567;

    zoom: number = 14;

    map: any = null;
    SourceViajes = new VectorSource();
    SourceMoviles = new VectorSource();
    SourceCallejero = new VectorSource();

    //divTooltip: any;
    divTooltip = document.getElementById('tooltip');
    ovrTooltip: any;

    container = document.getElementById('popup');
    content = document.getElementById('popup-content');
    closer = document.getElementById('popup-closer');

    coords: { lat: number, lon: number };

    pedidos: object[] = [];

    observer_moviles: Observable<any>;

    bandera_locacion_mapa_apagada = false;

    switch_accion: string = 'nuevo_viaje';
    modoEdicion: boolean = false;
    descripcion: string = '';


    constructor(
        private router: ActivatedRoute,
        private store: Store<AppState>,
        public snackBar: MatSnackBar,
        public _ubi: UbicacionService,
        public _nav: NavService,
    ) {
        this._ubi.checkeo_inicial_logueado();
        console.log('INICIO MAPA');
    }

    ngOnInit() {
        //this.coords = { lat: -38.003038, lon: -57.57109 };
        this.coords = { lat: 0, lon: 0 };

        if (!this.map) {
            this.initOSM();
        }

        //this.posicionarse_mapa();
        /*        this._ubi.obtener_coordinadas_actuales().subscribe((coords) => {
                    console.log('coordenadas', coords);
                    this.marcador_inicial([+coords.lon, +coords.lat]);
                });
        */
        this.store.select(state => state.viaje.sidenav).subscribe(sidenav => {
            console.log("Sidenav", sidenav);
            console.warn("Proj", proj);
            //this.initOSM();
        })

        this.store.select(state => state.viaje.localidades).subscribe(localidades => {
            console.log("Localidades", localidades);
            this._ubi.obtener_xy_localidad(localidades).subscribe(respuesta => {
                var coordenadas = { lon: +respuesta.jsData[0].lon, lat: respuesta.jsData[0].lat };
                //console.log(coordenadas);
                if (coordenadas) {
                    let marcador = {};
                    marcador['coordenadas'] = [+ coordenadas.lon, +coordenadas.lat];
                    marcador['id_marcador'] = 'nuevo_viaje';
                    marcador['nombre'] = 'Pasajero';

                    this.SourceViajes.clear();
                    this.addMarcador(marcador);
                }
            })
        });

        this.store.select(state => state.viaje.coordenadas).subscribe((coordenadas) => {
            console.log('Coordenadas', coordenadas);
            if (coordenadas) {
                let marcador = {};
                marcador['coordenadas'] = [+coordenadas.lon, +coordenadas.lat];
                marcador['id_marcador'] = 'nuevo_viaje';
                marcador['nombre'] = 'Pasajero';


                this.SourceViajes.clear();
                this.addMarcador(marcador);
            }
        });

        this.store.select(state => state.viaje.direccion).subscribe(direccion => {
            console.log('Dirección', direccion);
            //Si la acción es el click del mapa, lo que se cargan son coordenadas.
            //Desde modificación sólo cargo a 'direccion'
            if (direccion && this._ubi.usuario_logueado) {

                let marcador = {};
                marcador['coordenadas'] = [+ direccion.lon, +direccion.lat];
                marcador['id_marcador'] = 'nuevo_viaje';
                marcador['nombre'] = 'Pasajero';

                this.SourceViajes.clear();
                this.addMarcador(marcador);

            }
        });

        //this.observer_moviles = this._ubi.obtener_moviles();
        this.store.select(state => state.movil).subscribe((moviles) => {
            this.SourceMoviles.clear();
            if (moviles.moviles.length > 0) {
                moviles.moviles.forEach((movil: any) => {

                    if ((+movil.est_banderas & 8) == 8 && (+movil.est_banderas & 1) == 1 && (+movil.est_banderas & 16) == 0 && +movil.seg_fecha_ser < 60) {
                        this.add_marcador_movil(movil, this.SourceMoviles);
                    }
                });
            }
        });

        this.store.select(state => state.viaje).subscribe((viaje) => {
            this.pedidos = viaje.viajes;
            //console.log('viajes',this.pedidos);
        });
        /*
                this.store.select(state => state.calle.calles).subscribe(calles => {
                    this.trazar_callejero(calles, this.SourceCallejero);
                });
                */
    }

    marcador_inicial(coords) {
        let marcador = {};
        marcador['coordenadas'] = coords;
        marcador['id_marcador'] = 'nuevo_viaje';

        this.addMarcador(marcador);
        //this.pantomarkers(this.SourceViajes, this.map);

    }

    initOSM() {
        var crd = this.coords;
        var layer = new TileLayer({
            source: new OSM()
        });

        console.warn(layer);

        this.map = new Map({
            layers: [layer],
            target: 'map',
            view: new View({
                center: proj.fromLonLat([crd.lon, crd.lat]),
                zoom: this.zoom
            })
        });



        //LAYERS
        var LayerMoviles = new Vector({
            source: this.SourceMoviles
        });
        this.map.addLayer(LayerMoviles);


        var LayerViajes = new Vector({
            source: this.SourceViajes
        });
        this.map.addLayer(LayerViajes);

        var LayerFlechas = new Vector({
            source: this.SourceCallejero
        });
        this.map.addLayer(LayerFlechas);





        this.divTooltip = document.getElementById('tooltip');

        this.ovrTooltip = new Overlay({
            element: this.divTooltip,
            offset: [6, 2],
            positioning: 'bottom-left'
        });
        this.map.addOverlay(this.ovrTooltip);

        this.map.on('pointermove', (e) => {
            if (!this._ubi.usuario_logueado)
                return;
            this.displayTooltip(e);
        });

        this.map.on('moveend', (e) => {
            if (!this._ubi.usuario_logueado)
                return;
            var view = this.map.getView().calculateExtent(this.map.getSize());
            let pos1 = [view[0], view[1]];
            let pos2 = [view[2], view[3]];
            let lonlat_top_rigth = proj.transform(pos1, 'EPSG:3857', 'EPSG:4326');
            let lonlat_bottom_left = proj.transform(pos2, 'EPSG:3857', 'EPSG:4326');
            console.log('drag', lonlat_top_rigth, lonlat_bottom_left);

            let data = {
                lon: (lonlat_top_rigth[0] - lonlat_bottom_left[0]) / 2 + lonlat_bottom_left[0],
                lat: (lonlat_top_rigth[1] - lonlat_bottom_left[1]) / 2 + lonlat_bottom_left[1]
            };
            //this._ubi.tramos_callejero(data);
        });



        //this.map.on('pointermove', displayTooltip);
        /*
            this.map.on('click', function(e) {
              var movil;
              this.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
                var m = getMovil(feature.getId());
                if (m && m.idmovil && !movil) {
                  movil = m;
                }
              });
              if (movil) {
                clickMovil(movil);
              } else {
                mapClick(e);
              }
            );
        */

        //getMoviles([getMovilesParadas,getViajesPendientes,getViajesAsignados]);
        //getZonas();

        this.map.on('singleclick', (e) => {
            if (this._nav.expanded) {
                this._nav.closeNav();
                return;
            }
            this.bandera_locacion_mapa_apagada = true;



            this.mapClick(e);
        });

        this.map.on('dblclick', (e) => {
            let zoom = this.map.getView().getZoom() + 1;
            this.map.getView().setZoom(zoom);

        });

        document.querySelector('.ol-overlaycontainer-stopevent').remove();
        setTimeout(() => {
            this.map.updateSize();
        }, 300);
    }

    setCenter() {
        var view = this.map.getView();
        view.setCenter(proj.fromLonLat([this.longitude, this.latitude]));
        view.setZoom(8);
    }

    mapClick(e) {
        console.log('mapClick', e);
        if (!this._ubi.usuario_logueado)
            return;



        let marcador_nuevo_viaje = this.SourceViajes.getFeatureById('nuevo_viaje');
        if (marcador_nuevo_viaje) {
            marcador_nuevo_viaje.getGeometry().setCoordinates(e.coordinate);
            var direccion: Direccion = new Direccion();
            let coords_OL = marcador_nuevo_viaje.getGeometry().getCoordinates();
            let lonlat = proj.transform(coords_OL, 'EPSG:3857', 'EPSG:4326');
            //console.log(lonlat);
            direccion.lat = +lonlat[1];
            direccion.lon = +lonlat[0];


            ///console.log(direccion);
            //this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: direccion });
            direccion.inverseGeocoding = true;
            this.store.dispatch({ type: CLICK_MAPA, coordenadas: direccion });


            /*
            this.map.getView().animate({
                center: proj.fromLonLat(lonlat),
                duration: 2000
            });*/

            //this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: direccion });
            //let direccion = this._ubi.obtener_direccion(coords);
        }
    }

    mostrar_moviles() {
        //this._ubi.obtener_moviles()
        this.SourceMoviles.clear();
        setTimeout(() => { this.mostrar_moviles() }, 10000);
        if (this._ubi.moviles) {
            this._ubi.moviles.forEach((movil: any) => {
                if ((+movil.est_banderas & 8) == 8 && (+movil.est_banderas & 1) == 1 && (+movil.est_banderas & 16) == 0 && +movil.seg_fecha_ser < 60)
                    this.add_marcador_movil(movil, this.SourceMoviles);
            });
        }
    }


    mouse_over(modo) {
        //console.log('mouse_over', modo);
        switch (modo) {
            case 'nuevo_viaje':
                this.descripcion = 'Cargar un nuevo viaje';
                break;
            case 'presupuestar':
                this.descripcion = 'Pedir presupuesto del viaje';
                break;

            default:
                this.descripcion = '';

        }
    }



    dibujar_linea(calle) {
        let style = [
            // linestring
            new Style({
                stroke: new Stroke({
                    color: '#ffcc33',
                    width: calle.tipo + 1
                })
            }),
            new Style({
                text: new Text({
                    text: calle.nombre,//(this.map.getView().getZoom() > (limitetexto)) ? calle.nombre : '',
                    //offsetY: 25 * Math.sin((parseInt(movil.rumbo)+90) * (0.0174533)),
                    //offsetX: 25 * Math.cos((parseInt(movil.rumbo)+90) * (0.0174533)),
                    //offsetY: 0, //((this.map.getView().getZoom() > limitezoom) ? -22 : -10),
                    rotation: calle.rotation,
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
            }),

        ];
        console.log('calle ', calle);
        let linea_calle = new Feature({
            geometry: new LineString(calle['coordenadas']),
            name: 'Line'
        });
        linea_calle.setStyle(style);
        linea_calle.setId(calle.idcallejero)
        linea_calle.set('info_tramo', calle);
        return linea_calle;

    }

    trazar_callejero(calles, Source) {
        //Source.clear();

        calles.forEach((calle) => {
            let marcador_calle = Source.getFeatureById(calle.idcallejero);

            let coordinates = [
                proj.fromLonLat([parseFloat(calle.desde_x), parseFloat(calle.desde_y)]),
                proj.fromLonLat([parseFloat(calle.hasta_x), parseFloat(calle.hasta_y)])
            ];




            calle['coordenadas'] = coordinates;
            calle['rotation'] = Math.tan(calle.hasta_y / calle.hasta_x);
            if (calle.desde_x < calle.hasta_x)
                calle['rotation'] *= -1;

            if (!marcador_calle) {
                //proj.fromLonLat([parseFloat(punto.lon), parseFloat(punto.lat)])
                let line = this.dibujar_linea(calle);

                //console.log('line', line);
                Source.addFeature(line);
            } else {
                marcador_calle.set('info_tramo', calle);
            }
        });

    }
    /*
        ubicarEnMapa(place) {
        if (buscado) {
          return;
        }
        if (!place || (!place.geometry && !place.idpasajero)) {
          return;
        }
        buscado = true;
        var marker_position;
        var marker_title;
        var observacion = '';
        limpiarMarkerTmp();
        if (place.idpasajero != undefined) {
          // 		marker_position={lat: parseFloat(place.lat), lng: parseFloat(place.lon)};
          marker_position = [parseFloat(place.lon), parseFloat(place.lat)];
          marker_title = place.domicilio;
          observacion = place.observacionesdomicilio;

        } else {
          googlepos = place.geometry.location;
          marker_position = [parseFloat(googlepos.lng()), parseFloat(googlepos.lat())];
          if (place.address_components == undefined) {
            marker_title = $("#txtDomicilio").val().replace(localidades[curLocalidad] + ",", "").trim();
          } else {
            marker_title = place.formatted_address;
          }
        }
        var marker = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat(marker_position))
        });

        var iconStyle = new ol.style.Style({
          image: new ol.style.FontSymbol(
            {
              form: 'none',
              gradient: false,
              glyph: 'fa-street-view',
              fontSize: 1,
              radius: 10,
              rotation: 0,
              rotateWithView: true,
              offsetY: 0,
            })
        });
        marker.setStyle(iconStyle);
        marker.set('tooltip', marker_title);

        SourceMarkerTmp.addFeature(marker);

        // 	map.setCenter(marker_position);
        // 	map.setZoom(16);
        map.getView().setCenter(ol.proj.fromLonLat(marker_position));
        map.getView().setZoom(17);
        //setTimeout(function(){marker_tmp.setAnimation(null)},1400);
        $("#txtDomicilio").val(marker_title);
        $("#txtPlace").val($.mgst.object2json(place));
        $("#txtObservacion").prop("disabled", "");
        $("#txtObservacion").val(observacion)
        $("#txtObservacion").focus();
        setTimeout(function() {
          $("#txtCantidad").spinner("option", "disabled", false);
          $("#btnConfirmar").button("enable");
          $("#btnCambiarGPS").button("enable");
        }, 500);
        }
        */

    infoViaje(event) {
        console.log('infoViaje ev', event);
        //let message = event.nombre;
        this.SourceViajes.clear();
        let marcador = {};
        marcador['coordenadas'] = [+event.lon, +event.lat];
        this.addMarcador(marcador);

        this.pantomarkers(this.SourceViajes, this.map);

        //this._ubi.obtener_viajes_usuario();
        if (!event.idviaje || !event.idmovil)
            return;
        this._ubi.obtener_info_viaje(event.idviaje, event.idmovil).subscribe(response => {
            console.log('infoViaje', response);
            let datos = response.hostname;

            this.viewLogMap(response, this.SourceViajes, this.map);

            let mensaje = 'Destino: ' + datos.centromapa + ' ( ' + datos.localidad + ' )' + ' Estado: ' + event.enum_estado;
            this.snackBar.open(mensaje, 'CERRAR', {
                //duration: 2000,
            });
        });

    }




    mostrar_mensaje(mensaje: string) {

        this.snackBar.open(mensaje, 'CERRAR', {
            duration: 4000,
        });
    }

    cancelarViaje(event) {
        console.log('cancelarViaje', event);
        if (+event.estado > 5)
            return;
        //this.limpiarMapa();
        this._ubi.cancelar_viaje(event.idviaje).subscribe(response => {
            console.log('infoViaje', response);
            let mensaje = response.descripcion;
            if (response.codigo == 0) {
                mensaje = 'Se anulo el viaje a ' + response.hostname.centromapa;
                this.pedidos = this.pedidos.filter((obj: any) => obj.id !== event.id);
            }
            this.mostrar_mensaje(mensaje);

        });

    }

    crear_marcador_movil(movil = null) {
        var color_chasis = '#FFBC05';

        var color_vidrio = 'blue';

        color_vidrio = (movil.est_banderas && (+movil.est_banderas & 4) == 0 && (+movil.estado & 2) == 0) ? 'lightgreen' : 'red';

        var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 569.068 569.068" style="enable-background:new 0 0 569.068 569.068;" xml:space="preserve">\
<g>\
<pat style="fill:'+ color_chasis + ';" d="M324.282,366.931l74.624-29.874c6.47-2.586,10.72-8.851,10.729-15.824v-22.584l-85.353,34.141\
V366.931z"/>\
<path style="fill:'+ color_chasis + ';" d="M187.716,366.931V332.79l-85.353-34.141v22.584c0.009,6.973,4.259,13.238,10.729,15.824\
L187.716,366.931z"/>\
</g>\
<path style="fill:'+ color_chasis + ';" d="M193.051,484.104l29.327,12.564c21.475,9.158,45.766,9.158,67.241,0l29.327-12.521\
c33.732-14.348,54.464-48.711,51.425-85.242l-11.949-142.933l12.274-146.68c2.868-34.688-15.714-67.625-46.893-83.1l-6.734-3.354\
c-38.46-19.145-83.68-19.145-122.141,0l-6.734,3.354c-31.18,15.475-49.761,48.412-46.893,83.1l12.274,146.68l-11.949,142.967\
C138.621,435.445,159.345,469.765,193.051,484.104z"/>\
<path style="fill:'+ color_chasis + ';" d="M142.223,391.599c48.028,63.341,129.489,91.499,206.376,71.33\
c-8.237,9.116-18.351,16.345-29.652,21.176l-29.327,12.564c-21.475,9.158-45.766,9.158-67.241,0l-29.327-12.521\
c-33.732-14.348-54.464-48.711-51.425-85.242L142.223,391.599z"/>\
<path style="fill:'+ color_vidrio + ';" d="M322.096,365.071l2.185-1.425c5.275-3.499,8.177-9.628,7.545-15.927l-7.545-74.778H187.716\
l-7.511,74.778c-0.64,6.291,2.253,12.419,7.511,15.927l2.151,1.425C229.924,391.675,282.032,391.675,322.096,365.071z"/>\
<path style="fill:'+ color_vidrio + ';" d="M320.808,365.856c-39.911,25.785-91.311,25.478-130.906-0.785l-2.185-1.425\
c-5.275-3.499-8.177-9.628-7.545-15.927l5.744-57.187C218.674,333.046,267.428,360.265,320.808,365.856z"/>\
<path style="fill:'+ color_vidrio + ';" d="M324.282,153.548H187.716l-6.555-39.331c-1.186-7.118,2.228-14.22,8.535-17.728l16.55-9.193\
c30.932-17.19,68.556-17.19,99.488,0l16.55,9.193c6.308,3.508,9.722,10.609,8.535,17.728L324.282,153.548z"/>\
<path style="fill:'+ color_vidrio + ';" d="M189.705,96.49l8.339-4.635c33.544,29.592,73.668,50.743,117.036,61.693H187.716l-6.555-39.331\
C179.975,107.091,183.397,99.998,189.705,96.49z"/>\
<g>\
<rect x="285" y="418.126" transform="matrix(-0.5547 0.8321 -0.8321 -0.5547 845.9393 400.5753)" style="fill:#555160;" width="61.551" height="17.071"/>\
<rect x="187.704" y="395.897" transform="matrix(-0.8321 0.5547 -0.5547 -0.8321 596.1896 672.8424)" style="fill:#555160;" width="17.071" height="61.551"/>\
</g>\
<path d="M332.006,264.397H180.035l-8.279,82.46c-0.964,9.449,3.397,18.658,11.326,23.899l2.151,1.425\
c42.881,28.568,98.737,28.568,141.618,0l2.159-1.434c7.929-5.241,12.282-14.45,11.318-23.899L332.006,264.397z M319.536,356.518\
l-2.159,1.434c-37.171,24.761-85.584,24.761-122.755,0l-2.151-1.425c-2.629-1.75-4.08-4.814-3.764-7.955l6.734-67.105H316.6\
l6.734,67.113C323.633,351.722,322.173,354.777,319.536,356.518z"/>\
<path d="M180.487,162.084h151.024l7.742-46.458c1.775-10.678-3.346-21.33-12.803-26.605l-16.55-9.193\
c-33.476-18.735-74.291-18.735-107.767,0l-16.567,9.193c-9.449,5.275-14.57,15.918-12.803,26.596L180.487,162.084z M193.853,103.941\
l16.55-9.193c28.329-15.85,62.863-15.85,91.191,0l16.55,9.193c3.15,1.767,4.848,5.318,4.268,8.877l-5.36,32.195H194.946\
l-5.369-32.204C188.98,109.241,190.695,105.691,193.853,103.941z"/>\
<rect x="187.704" y="395.897" transform="matrix(-0.8321 0.5547 -0.5547 -0.8321 596.1896 672.8424)" width="17.071" height="61.551"/>\
<rect x="285.077" y="418.302" transform="matrix(-0.5549 0.8319 -0.8319 -0.5549 846.2162 400.9294)" width="61.556" height="17.07"/>\
<path d="M414.423,291.582c-2.347-1.588-5.335-1.912-7.963-0.854l-35.379,14.152l-4.123-48.907l12.223-145.954\
c3.312-38.213-17.165-74.548-51.57-91.499l-6.743-3.354c-40.884-20.22-88.853-20.22-129.737,0l-6.734,3.354\
c-34.423,16.943-54.916,53.278-51.605,91.499l12.248,145.954l-4.097,48.942l-35.379-14.152c-4.37-1.767-9.346,0.341-11.113,4.711\
c-0.41,1.007-0.623,2.083-0.623,3.175v22.584c-0.034,10.481,6.35,19.913,16.098,23.779l26.741,10.695l-3.576,42.489\
c-3.363,40.193,19.461,78.004,56.589,93.752l29.327,12.521c23.626,10.038,50.324,10.038,73.95,0l29.327-12.521\
c37.146-15.739,59.986-53.551,56.623-93.752l-3.559-42.489l26.741-10.695c9.739-3.867,16.115-13.298,16.081-23.779v-22.584\
C418.17,295.815,416.762,293.169,414.423,291.582z M136.504,337.254l-20.237-8.1c-3.252-1.28-5.377-4.43-5.369-7.921v-9.978\
l25.606,10.242V337.254z M315.593,476.252l-29.327,12.513c-19.341,8.22-41.191,8.22-60.533,0l-29.327-12.513\
c-30.343-12.88-48.993-43.786-46.244-76.639l11.949-143.641l-12.299-147.414c-2.689-31.231,14.049-60.908,42.173-74.752l6.743-3.354\
c36.087-17.856,78.448-17.856,114.536,0l6.734,3.354c28.124,13.844,44.87,43.522,42.182,74.752l-12.291,147.414l12.018,143.684\
C364.62,432.508,345.944,463.398,315.593,476.252z M401.099,321.233c0.009,3.491-2.117,6.64-5.369,7.921l-20.237,8.1v-15.756\
l25.606-10.242V321.233z"/>\
</svg>';


        var icono = [
            new Style({
                image: new Icon(({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    rotation: (+movil.rumbo - 180) * (0.0174533),
                    rotateWithView: true,
                    scale: 0.1,
                    opacity: 0.75,
                    src: 'data:image/svg+xml,' + escape(svg)
                }))
            })

        ];

        return icono;
    }


    add_marcador_movil(movil, queSource) {
        var posicion = [+movil.lon, +movil.lat];
        var marker = new Feature({
            geometry: new Point(proj.fromLonLat(posicion))
        });
        var icon = this.crear_marcador_movil(movil);
        marker.setStyle(icon);
        marker.setId(movil.idmovil);
        marker.set('tooltip', movil.interno);
        marker.set('dragging', false);
        queSource.addFeature(marker);
    }




    addMarcador(mark) {
        //console.log('addMarcador', mark);
        let marker = new Feature({
            geometry: new Point(proj.fromLonLat(mark.coordenadas))
        });

        var iconPersona = [
            new Style({
                image: new Icon(({
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,

                    src: 'assets/travel.svg'
                }))
            })
        ];




        marker.setStyle(iconPersona);
        marker.setId(mark.id_marcador);
        marker.set('tooltip', mark.nombre);
        marker.set('dragging', true);

        //console.log(marker);


        /*
                marker.on('pointermove', (e) => {
                    //dragPan.setActive(false);

                    marker.getGeometry().setCoordinates(e.coordinate);
                    console.info('start dragging');
                });
                */



        this.SourceViajes.addFeature(marker);
        //console.log(mark.coordenadas);
        if (!isNaN(mark.coordenadas[0])) {
            this.map.getView().animate({
                center: proj.fromLonLat(mark.coordenadas),
                //zoom: this.zoom,
                duration: 300
            });
        }
    }


    displayTooltip(evt) {


        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature) {

            return feature;
        });


        //console.log('displayTooltip', evt, feature);
        this.divTooltip.style.display = feature ? '' : 'none';
        if (feature) {
            this.ovrTooltip.setPosition(evt.coordinate);
            this.divTooltip.innerHTML = feature.get('tooltip');
        }
    };


    viewLogMap(ev, queSource, queMap) {

        var data = ev.jsData;

        var puntos = [];
        var punto_inicial = data[0];
        var punto_final = data[data.length - 1];
        console.log('viewLogMap', punto_inicial, punto_final);

        var iconAsignado = this.crear_marcador_movil(punto_inicial);
        var iconIniciado = iconAsignado;
        var iconFinalizado = this.crear_marcador_movil(punto_final);


        var posicion = [+punto_inicial.lon, +punto_inicial.lat];
        var marker = new Feature({
            geometry: new Point(proj.fromLonLat(posicion))
        });

        marker.setStyle(iconAsignado);
        marker.set('tooltip', 'Se Asigno viaje');
        queSource.addFeature(marker);

        var iniciado = false;
        data.forEach((punto) => {

            puntos.push(proj.fromLonLat([+punto.lon, +punto.lat]));
            if ((punto.est_banderas & 4) == 4 && !iniciado) {
                iniciado = true;
                posicion = [+punto.lon, +punto.lat];
                marker = new Feature({
                    geometry: new Point(proj.fromLonLat(posicion))
                });
                marker.setStyle(iconIniciado);
                marker.set('tooltip', 'Se Inicio el Viaje');
                queSource.addFeature(marker);
            }
        });

        //punto_final = data[data.length - 1];
        if ((punto_final.est_banderas & 4) == 0) {
            posicion = [+punto_final.lon, +punto_final.lat];
            marker = new Feature({
                geometry: new Point(proj.fromLonLat(posicion))
            });
            marker.setStyle(iconFinalizado);
            marker.set('tooltip', 'Se Finalizo el Viaje');
            queSource.addFeature(marker);
        }
        var polyline_puntos = new LineString(puntos);
        var polyline = new Feature({
            geometry: polyline_puntos
        })
        var polyline_style = new Style({
            stroke: new Stroke({
                color: [40, 40, 40, 0.5],
                width: 6
            })
        });
        polyline.setStyle(polyline_style);
        queSource.addFeature(polyline);
        this.pantomarkers(queSource, queMap);

    }


    pantomarkers(queSource, queMap) {
    /*	cualsource = SourceZonas;
    	if (SourceViajes.getFeatures().length>0){
    	    cualsource = SourceViajes;
    	}
    */	if (queSource.getFeatures().length > 0) {
            var qBounds = extent.createEmpty();
            let features = queSource.getFeatures();
            features.forEach((feature) => {
                extent.extend(qBounds, feature.getGeometry().getExtent());
            });

            queMap.getView().fit(qBounds);
            if (queMap.getView().getZoom() > 17) {
                queMap.getView().setZoom(17);
            }
        }
    }
    /*
    limpiarMapa(condom) {
        // 	if (PolyLine!=undefined) PolyLine.setMap(null);
        // 	if (markerAsignado!=undefined) markerAsignado.setMap(null);
        // 	if (markerInicio!=undefined) markerInicio.setMap(null);
        // 	if (markerFin!=undefined) markerFin.setMap(null);
        // 	if (condom && markerDomicilio!=undefined) markerDomicilio.setMap(null);
        if (markerBounds != undefined) markerBounds = extent.createEmpty();
    }
    */


}

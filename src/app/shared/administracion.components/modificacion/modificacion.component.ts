import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialogRef } from '@angular/material';

import { Mapa } from '../../../models/administracion.models/index.models';
import { AbmService } from '../../../services/administracion.services/index.services'
import { take, switchMap, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DynamicFormComponent } from '../formularios/formulario.component';

/********************************/
//ngrx
import { Store, select } from '@ngrx/store';
import { AdministracionState } from '../../../store/administracion.reducers';
import { MODULOS, NOMBRETABLA } from '../../administracion/actions';
import * as administracionActions from '../../../store/actions/administracion.actions';

//import 'rxjs/add/observable/interval';
/********************************/
import { Observable } from 'rxjs';

import { ModificacionAdministracionEffects } from '../../../store/effects/modificacionAdministracion.effects';


@Component({
    selector: 'administracion-modificacion',
    templateUrl: './modificacion.component.html',
    styleUrls: ['./modificacion.component.scss'],
    //providers: [AbmService]  //Inyección de dependencias
})

export class ModificacionAdministracionComponent implements OnInit {
    @ViewChild('modulo_form') camposComponent: DynamicFormComponent;

    private dato: any;
    private dato_mapa: Mapa;
    private faltaGuardar: boolean = true;
    private nombreTabla: string;
    nombre_tablas_rel: any[];
    private error_validacion: boolean = false;
    alert_mensaje: string = '';
    private step = 0;
    private idCampo= 0;
    public datos_form: any = { accion: "abm", tabla: "" };

    //datos_adicionales: boolean = false;
    //private dato_observer$: any;
    //private questions: any[];

    constructor(
        //private _route: ActivatedRoute,
        public dialogRef: MatDialogRef<ModificacionAdministracionComponent>,

        private _router: Router,
        private _SrvService: AbmService,
        private store: Store<AdministracionState>     //Redux
    ) { }

    ngOnInit() {
      console.log("Estoy en ModificacionComponent OnInit");
        this.store.select('mapa').subscribe(mapa => {
            this.dato_mapa = mapa;
        });

        //SUSCRIPCIÓN CON EL SWITCHMAP: A partir de varios observables emite una única respuesta.
        let observable_del_switchmap$ = this.store.select(state => state['administracion'].datos).pipe(take(1)).subscribe((datos) => {
            this.nombreTabla = datos.nombre;
            this.idCampo=datos.idCampo;
            let observable_datos = MODULOS[this.nombreTabla][0].nombre;
            datos[observable_datos].forEach(campo=>{
              if(campo.id==this.idCampo){
                this.dato = campo;
                //this.guardar(campo);
              }
            });
        });

        var tabla_relacional: string= '';
        tabla_relacional = 'columnas_relacionales_' + MODULOS[this.nombreTabla][0].nombre;

        this.store.select(state => state['administracion'].columnas_relacionales[tabla_relacional]).pipe(take(1)).subscribe(nombre_tablas_rel => {
            this.nombre_tablas_rel = Object.values(nombre_tablas_rel);
            this.datos_form = [];
            this.nombre_tablas_rel.forEach((x_tabla: string) => {
                this.datos_form.push({ "accion": "abm", "tabla": x_tabla });
                if (x_tabla != this.nombreTabla) {
                    let modulo = MODULOS[x_tabla][2];
                    //SEGÚN LAS RELACIONES ACÁ SE CARGARÁN DISTINTOS DATOS
                    {
                        modulo.datos = { id_cliente: this.dato.id };
                    }
                    console.log('MODIFICACION MODULO', modulo);
                    this.store.dispatch(modulo);
                }
            });
        });
        this.servicios(0);
    }

    servicios(i) {
        this.step = i;
        this._SrvService.url_modulo = this.nombre_tablas_rel[i];
        setTimeout(() => this.camposComponent.showCampos(this._SrvService.url_modulo), 1);
        console.log("TABLA ACTUAL:", this._SrvService.url_modulo);
        this.store.dispatch({ type: NOMBRETABLA, nombre: this._SrvService.url_modulo });
    }

    guardar(campos_modif) {
        if(this.faltaGuardar==true){
          console.log("Estoy en GUARDAR de modificacion.component");
          this.faltaGuardar=false;
          this.store.dispatch(new administracionActions.CambiarGrillaEffects(campos_modif));
          //this.dialogRef.close(false);

          this.store.select(state => state['administracion'].datos.error).subscribe(errores=>{
            if(errores){
              this.faltaGuardar=true;
              console.log("Respuesta", errores);
              this.error_validacion = true;
              this.alert_mensaje = '';
              console.warn(errores['message']);
              for (var i in errores['message']) {
                this.alert_mensaje += errores['message'][i] + '<br>';
              }
            }
          });

        //NombreTabla debería enviárselo como parámetro de alguna manera, ya que ahora puede ser que entre a guardar para la tabla principal o para una de las relacionales.
        //this.dialogRef.close(campos_modif);

        //Agrego a "this.modelo" los campos que han sido modificados.
/*
        let model = Object.keys(campos_modif);
        model.forEach((element) => {
            if (campos_modif[element])
                this.dato[element] = campos_modif[element];
        });
*/
/*
        if (this.dato.map) {
            this.dato.lat = this.dato_mapa.coordenadas.lat;
            this.dato.lon = this.dato_mapa.coordenadas.lng;
            //this.dato.map = this.dato_mapa.coordenadas;
            delete this.dato['map'];
        }
        delete this.dato['accion'];
*/
        //Ver por qué esto...
/*
        if (this._SrvService.url_modulo == 'cliente_servicio') {
            delete this.dato['id'];
        }
*/
      }
    }
}

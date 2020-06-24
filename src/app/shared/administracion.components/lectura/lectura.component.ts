import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { AbmService, QuestionService, AlmacenService } from '../../../services/administracion.services/index.services';

//ngrx
import { Store, select } from '@ngrx/store';
import { AdministracionState } from '../../../store/administracion.reducers';

import { Subject, Observable } from 'rxjs';

import { DynamicFormComponent } from '../formularios/formulario.component';

/*******TRAER LAS ACCIONES********/
import {
    NOMBRETABLA,
    //CARGA_COLUMNAS,
    DEFINICION_PERMISOS,
    MODULOS,
    ACTUALIZAR_GRILLA
} from '../../administracion/actions';

@Component({
    selector: 'lectura',
    templateUrl: './lectura.component.html',
    styleUrls: ['./lectura.component.scss'],
    providers: [QuestionService, AlmacenService] // Inyección de dependencias (inyecto la función AbmService)
})

export class LecturaComponent implements AfterViewInit {
    @ViewChild(DynamicFormComponent) camposComponent: DynamicFormComponent;

    public estado: boolean = false;
    private columnDefs = [];
    public datos_form: any = { accion: 'filtrar', tabla: "" };

    constructor(
        private _SrvService: AbmService,
        //private store: Store<AdministracionState>,
        private _router: ActivatedRoute,
        private storeService: AlmacenService,
    ) { }

    ngAfterViewInit() {
        this.storeService.cargar_datos_locales((devolucion) => {
            const modulo = this._router.params.subscribe(params => {
                this._SrvService.url_modulo = params.modulo;
                this.datos_form.tabla = this._SrvService.url_modulo;
                console.log('Componente lectura-', this.datos_form);
                this.storeService.cargar_grillas(this._SrvService.url_modulo, (estado: boolean) => {
                    this.estado = estado;
                    setTimeout(() => {
                        if (this.camposComponent)
                            this.camposComponent.showCampos(this._SrvService.url_modulo)
                    }, 1);
                });
            });
        });
    }
}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { trigger, style, animate, transition } from '@angular/animations';

import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from "ag-grid-community";

//import { Subscription, combineLatest } from 'rxjs';
import { take, map } from 'rxjs/operators';

//ngrx
import { Store, select } from '@ngrx/store';
import { AdministracionState } from '../../../store/administracion.reducers';
import { MODULOS, DATOS_FACTURACION_ADICIONALES, MODIFICARCAMPO } from '../../administracion/actions';

import { ApiService, PopupService } from '../../../services/index.services';

@Component({
    selector: 'app-grilla',
    templateUrl: './grilla.component.html',
    styleUrls: ['./grilla.component.scss'],
    //providers: [PopupService], //Inyección de dependencias
    /*
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
    */
})

export class GrillaComponent implements OnInit {
    @Input() datos_form: any;
    @ViewChild('agGrid') agGrid: AgGridNg2;

    //private mensaje_de_grilla= {};
    gridOptions: GridOptions;

    rowData = {};
    columnDefs = {};

    private pinnedTopRowData;
    defaultColDef;

    private rowModelType: string = "infinite";
    private rowSelection: string = "multiple";
    public paginationPageSize: number = 1;
    public cacheOverflowSize: number = 2;
    public maxConcurrentDatasourceRequests: number = 2;
    public infiniteInitialRowCount: number = 1;
    maxBlocksInCache;
    private observador;
    private nombreTabla: string = "";

    //private observador_colum;
    //private objeto: Object;
    //private questions: any[];

    constructor(
        //public dialogRef: MatDialogRef<GrillaComponent>,
        //private resolver: ComponentFactoryResolver,
        //private _filtro,
        private _dialog: PopupService,
        private _api: ApiService,
        private store: Store<AdministracionState>,         //ngrx
        //@Inject(MAT_DIALOG_DATA) public popup_abierto: any,
    ) { }

    ngOnInit() {
        this.store.select(state => state['administracion'].datos.nombre).subscribe(nombre => {
            //console.log('nombre tabla', nombre, this.datos_form.tabla);
            this.nombreTabla = this.datos_form.tabla;
            this.elige_observable(this.datos_form.tabla);
        });
        this.agGrid.gridOptions = { suppressPropertyNamesCheck: true };             //Esto es para que no aparezca una serie de warnings en la consola.
    }

    ngOnDestroy() {
        //this.subscriptionDatos.unsubscribe();
        //this.subscriptionNombre.unsubscribe();
    }


    elige_observable(nombre_tabla: string) {
        this.observador = MODULOS[nombre_tabla][0].nombre;
        if (!this.observador) {
            console.warn("No se ha leído ninguna tabla en grilla", this.observador);
            return;
        }

        let dato_observer$ = this.store.select(state => state['administracion'].datos[this.observador]).pipe(take(1));
        dato_observer$.subscribe(dato => {
            console.log('Grilla de:', this.observador, '\nDato_observer:', dato);
            this.filtrar_grilla(dato);
            this.onGridReady();
        });
    }

    onBtExport() {
        var params = {
            /*
         skipHeader: true,
         columnGroups: true,
         skipFooters: true,
         skipGroups: true,
         //skipPinnedTop: false,
         //skipPinnedBottom: true,
         allColumns: true,
         onlySelected: true,
         suppressQuotes: true,
               */
            fileName: this.nombreTabla + Date(),
            columnSeparator: ','
        };

        this.agGrid.api.exportDataAsCsv(params);
    }


    removeEmptyStrings = (obj) => {
        let newObj = {};
        Object.keys(obj).forEach((prop) => {
            if (obj[prop] !== '') { newObj[prop] = obj[prop]; }
        });
        return newObj;
    };

    filtrar_grilla(event) {
        //Object.keys(event).forEach(k => (!event[k] && event[k] !== undefined) && delete event[k]);

        if (!event || event.accion != "filtrar")
            return;

        event.tabla = this.nombreTabla;
        delete event['accion'];

        let busqueda = this.removeEmptyStrings(event);
        console.log("Criterios para el filtrado: ", busqueda);

        this._api.post('filtrados', busqueda).subscribe(response => {
            console.log("Estado de la carga de la tabla :", response);
            if (response.status == 'success') {
                this.rowData = response.datos;

                this.store.dispatch({ type: DATOS_FACTURACION_ADICIONALES, datos: response.total });

                //response.total
                //{hacer el dispatch para una nueva variable del store.}
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


    onGridReady(params = null) {
        //this.observador_colum = 'columnas_' + this.observador;
        this.columnDefs = this.store.select(state => state['administracion'].columnas['columnas_' + this.observador]);
        this.rowData = this.store.select(state => state['administracion'].datos[this.observador]);
    }


    click_row(datos) {
        let data = { nombre_tabla: this.nombreTabla, datos: ((datos.id) ? datos : null) };
        let parametros = { data: data, width: 2400 }; //, height: 1200 };

        let modificacion_datos = { nombre_tabla: this.nombreTabla, id: ((datos.id) ? datos.id : null) };
        this.store.dispatch({ type: MODIFICARCAMPO, campo: modificacion_datos });

        this._dialog.abrir(parametros, 'administracion-modificacion').subscribe(datos => {
            console.log("Cerró POPUP");
        });
    }
}

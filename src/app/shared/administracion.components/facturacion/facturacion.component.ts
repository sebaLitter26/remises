
import {
    Component, NgModule, OnInit, Input, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef,
    ChangeDetectorRef, TemplateRef, ViewChild, Output, EventEmitter, Inject
} from '@angular/core';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { trigger, style, animate, transition } from '@angular/animations';
//import { BrowserModule } from '@angular/platform-browser';
import { AgGridNg2 } from 'ag-grid-angular';
import { Subscription } from 'rxjs';

import { ModificacionAdministracionComponent } from '../index.components';

//ngrx
import { Store, select } from '@ngrx/store';
import { AdministracionState } from '../../../store/administracion.reducers';

/**************REDUX******************/
//import { NgRedux, select } from '@angular-redux/store';
//import { IAppState } from '../../store';
import { MODULOS, DATOS_FACTURACION_ADICIONALES } from '../../administracion/actions';
/********************************/

@Component({
    selector: 'app-facturacion',
    templateUrl: './facturacion.component.html',
    styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {

    datos: any;

    constructor(
        private store: Store<AdministracionState>,
    ) { }

    ngOnInit() {
        console.log("HOLAAA");
        let observable_datos = 'datos_facturacion_adicionales';
        /*
            let dato_observer$ = this.store.select(observable_datos);
              dato_observer$.subscribe(dato => {
                 this.datos=dato;
                 console.log("Suscripción");
                 this.main(this.datos);
              });*/

        /*  this.store.select(datos_facturacion_adicionales).subscribe(datos=>{


        });*/
    }

    main(datos: any) {
        console.log(datos);
    }
}

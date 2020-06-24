import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { MaterialModule } from '../material.module';
//import { PopupModule } from './popup/popup.module';
import { AgGridModule } from 'ag-grid-angular';



// Componentes

import {
    LecturaComponent,
    ModificacionAdministracionComponent,
    GrillaComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,

    //MapaComponent,
    //PopupAdministracionComponent,

    FacturacionComponent

} from './administracion.components/index.components';

import { AdministracionComponent } from './administracion/administracion.component';

import {
    //NavbarComponent,
    //MenuListItemComponent,
    //MapaComponent,
    //MapaCallejeroComponent,
    //ModificacionComponent,
    //PresupuestoComponent,
    //DespachoComponent,
    SafePipe,
    //FnModificacion,
    //EditarCalleComponent,
    //EditarMuchasCallesComponent,
    //EditarZonaComponent,
    //BusquedaCallejero,
    DomiciliosFrecuentes,
    //PopupDialogComponent,
    //RolesComponent,
    //PedidosEmergenteComponent,
    //AppComponent
} from './index.components';



//servicios

import {
    //AbmService,
    UserService,
    AlmacenService,
    QuestionService,
    QuestionControlService,
} from '../services/administracion.services/index.services';

import { ApiService, UbicacionService, EstilosService, PopupService, NavService } from '../services/index.services';




//import { UsuariosModule } from '../usuarios/usuarios.module';



//import { AdministracionModule } from './administracion/administracion.module'

//servicios

//import { MainNavComponent } from './main-nav﻿/main-nav﻿.component';
import { LayoutModule } from '@angular/cdk/layout';
//import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        //FormsModule,
        ReactiveFormsModule,
        LayoutModule,
        //BrowserAnimationsModule,
        //UsuariosModule,
        //AgGridModule.withComponents([]),  //Grilla
        //PopupModule,

        //FlexLayoutModule,
    ],
    declarations: [
        //NavbarComponent,
        //MenuListItemComponent,
        //MapaComponent,
        //MapaCallejeroComponent,
        //ModificacionComponent,
        //PresupuestoComponent,
        //DespachoComponent,
        //SafePipe,
       // FnModificacion,
        //BusquedaCallejero,
        //DomiciliosFrecuentes,
        //PedidosEmergenteComponent,
        //PopupDialogComponent,
        //EditarCalleComponent,
        //EditarMuchasCallesComponent,
        //EditarZonaComponent,
        //RolesComponent,
        //AdministracionComponent,
        //AppComponent,

        //Administracion Componentes
        /*
        LecturaComponent,
        ModificacionAdministracionComponent,
        GrillaComponent,
        DynamicFormComponent,
        DynamicFormQuestionComponent,
        //MapaComponent,
        //PopupAdministracionComponent,
        FacturacionComponent
        */
       DynamicFormComponent,
        DynamicFormQuestionComponent,
    ],

    providers: [
        ApiService,
        //UbicacionService,
        EstilosService,
        PopupService,
        NavService,


        //Administracion services
        //AbmService,
        
        //UserService,
        //AlmacenService,
        QuestionService,
        QuestionControlService,
        
    ],

    exports: [
        //MaterialModule,
        //NavbarComponent,
        //AppComponent,
        //MenuListItemComponent,
        //MapaComponent,
        //MapaCallejeroComponent,
        //ModificacionComponent,
        //PresupuestoComponent,
        //DespachoComponent,
        //SafePipe,
        //FnModificacion,
        //BusquedaCallejero,
        //DomiciliosFrecuentes,

        //EditarCalleComponent,
        //EditarMuchasCallesComponent,
        //EditarZonaComponent,
        //RolesComponent,
        //AdministracionComponent,

        //Administracion Componentes
        /*
        LecturaComponent,
        ModificacionAdministracionComponent,
        GrillaComponent,
        
        //MapaComponent,
        //PopupAdministracionComponent,
        FacturacionComponent,
        */
       DynamicFormComponent,
        DynamicFormQuestionComponent,
    ],
    entryComponents: [
        //PopupDialogComponent,
    ]
})
export class SharedModule { }

import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';     //Esto debería servir para el pop-up
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//ngrx
import { StoreModule } from '@ngrx/store';

//import { routing, appRoutingProviders } from './app.routing';
//import { ApiService } from '../../services/administracion.services/index.services';

import { AgGridModule } from 'ag-grid-angular';
import { ADMINISTRACION_ROUTES } from './administracion.routing';
import { MaterialModule } from '../../material.module';
import { LayoutModule } from '@angular/cdk/layout';

//MODULOS PERSONALIZADOS
//import { LecturaModule } from '../administracion.components/lectura/lectura.module';
import { SharedModule } from '../../shared/shared.module';

//Componentes
import { AdministracionComponent } from './administracion.component';

import {
    LecturaComponent,
    ModificacionAdministracionComponent,
    GrillaComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,

    //MapaComponent,
    //PopupAdministracionComponent,

    FacturacionComponent

} from '../administracion.components/index.components';

//servicios
import {
    //AbmService,
    UserService,
    AlmacenService,
    QuestionService,
    QuestionControlService,
} from '../../services/administracion.services/index.services';

import { AdministracionReducers } from '../../store/administracion.reducers';

@NgModule({
    declarations: [
        AdministracionComponent,
        LecturaComponent,
        ModificacionAdministracionComponent,
        GrillaComponent,
        FacturacionComponent
    ],
    imports: [
        RouterModule.forChild(ADMINISTRACION_ROUTES),
        //LecturaModule,
        AgGridModule.withComponents([]),  //Grilla
        SharedModule,
       
        //BrowserAnimationsModule, //aplica para el pop-up
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        LayoutModule,
        StoreModule.forFeature('administracion', AdministracionReducers),
        /*
                StoreDevtoolsModule.instrument({
                    name: 'DEVTOOLS de Store de Administracion',
                    maxAge: 25, // Retains last 25 states
                    logOnly: environment.production, // Restrict extension to log-only mode
                }),
                */
    ],
    providers: [
        //{ provide: APP_BASE_HREF, useValue: 'administracion' }
        UserService,
        AlmacenService,
        //QuestionService,
        //QuestionControlService,
    ],
    bootstrap: [],
    schemas: [NO_ERRORS_SCHEMA],
    exports:[
    ],

    entryComponents: [
        //PopupAdministracionComponent,
        //ModificacionAdministracionComponent
    ]
})

export class AdministracionModule {

}


import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { appReducers } from '../../store/app.reducer';
import { effectsArr } from '../../store/effects';



import { ConfiguracionComponent } from './configuracion.component';
import { ConfiguracionDetalleComponent } from './configuracion-detalle/configuracion-detalle.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MaterialModule } from '../../material.module';

// Rutas
import { CONFIGURACION_ROUTES } from './configuracion-routing.module';

import { DynamicFormBuilderModule } from '../../services/dynamic-form-builder/dynamic-form-builder.module';

// Modulos personalizados
//import { SharedModule } from '../shared.module';
//import { UsuariosModule } from './usuarios/usuarios.module';

import { ConfiguracionService } from './configuracion.service';

//import { AdministracionModule } from './shared/administracion/administracion.module';
//Componentes

@NgModule({
    imports: [
        RouterModule.forChild(CONFIGURACION_ROUTES),
        DynamicFormBuilderModule,
        //ModificacionAdministracionComponent,
        //HttpClientModule,
        //BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(appReducers),
        EffectsModule.forRoot(effectsArr),

        //SharedModule,
        MaterialModule,
        //UsuariosModule,
    ],
    declarations: [
        ConfiguracionComponent,
        ConfiguracionDetalleComponent
        //PopupDialogComponent,
        //ModificacionAdministracionComponent,
    ],
    exports: [
        //NavbarComponent,
        //MaterialModule,
        //AdministracionModule,
        //RouterModule
        //MapaComponent,
        //PopupDialogComponent
    ],
    entryComponents: [
        ConfiguracionComponent,
        ConfiguracionDetalleComponent
        //ModificacionAdministracionComponent
    ],
    //schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ConfiguracionService], // <-- descomentar esto
})
export class ConfiguracionModule { }

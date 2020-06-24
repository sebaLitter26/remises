
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


import { appReducers } from '../../store/app.reducer';
import { effectsArr } from '../../store/effects';

import { MaterialModule } from '../../material.module';

// Rutas
import { DESPACHO_ROUTES } from './despacho-routing.module';

// Modulos personalizados
//import { SharedModule } from '../shared.module';
//import { UsuariosModule } from './usuarios/usuarios.module';


import { SafePipe } from './safe.pipe';

import { DespachoService } from './despacho.service';

import { DespachoComponent } from './despacho.component';

import { DomiciliosFrecuentes } from '../domiciliosFrecuentes/domiciliosFrecuentes.component';



//import { AdministracionModule } from './shared/administracion/administracion.module';
//Componentes

@NgModule({
    imports: [
        RouterModule.forChild( DESPACHO_ROUTES ),
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
        DespachoComponent,
        DomiciliosFrecuentes,
        SafePipe,
        //PopupDialogComponent,
        //ModificacionAdministracionComponent,
    ],
    exports: [
        //NavbarComponent,
        MaterialModule,
        //AdministracionModule,
        //RouterModule
        //MapaComponent,
        //PopupDialogComponent
    ],
    entryComponents: [
        DespachoComponent,
        //ModificacionAdministracionComponent
    ],
    //schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [DespachoService],
})
export class DespachoModule { }

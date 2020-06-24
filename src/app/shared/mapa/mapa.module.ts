
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


import { MaterialModule } from '../../material.module';

//import { ModificacionModule } from '../modificacion/modificacion.module';

// Rutas
import { MAPA_ROUTES } from './mapa-routing.module';

import { MapaComponent } from './mapa.component';
import { ModificacionComponent } from './modificacion/modificacion.component';
import { BusquedaCallejeroModif } from './modificacion/busqueda_callejero_modif.component';
import { FnModificacionModif } from './modificacion/funciones_modificacion_modif.component';



import { PresupuestoComponent } from './presupuesto/presupuesto.component';
import { BusquedaCallejeroPresu } from './presupuesto/busqueda_callejero_presu.component';
import { FnModificacionPresu } from './presupuesto/funciones_modificacion_presu.component';

// Modulos personalizados
//import { SharedModule } from '../shared.module';
//import { UsuariosModule } from './usuarios/usuarios.module';

import { MapaService } from './mapa.service';

//import { AdministracionModule } from './shared/administracion/administracion.module';
//Componentes

@NgModule({
    imports: [
        RouterModule.forChild(MAPA_ROUTES),
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
        //ModificacionModule
        //UsuariosModule,
    ],
    declarations: [
        MapaComponent,
        ModificacionComponent,
        BusquedaCallejeroModif,
        FnModificacionModif,
        PresupuestoComponent,
        BusquedaCallejeroPresu,
        FnModificacionPresu,

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
        MapaComponent,
        //RolDetalleComponent
        //ModificacionAdministracionComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [MapaService, { provide: APP_BASE_HREF, useValue: 'pedidos' }],
})
export class MapaModule { }

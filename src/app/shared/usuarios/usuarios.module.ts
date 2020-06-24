import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, CanLoad } from '@angular/router';

import { MaterialModule } from '../../material.module';

import { ListaComponent } from './lista/lista.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { LoginComponent } from './loguear/login.component';

// Rutas
import { USUARIO_ROUTES } from './usuario-routing.module';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(USUARIO_ROUTES),

    ],
    declarations: [
        LoginComponent,
        UsuarioComponent,
        ListaComponent


    ],
    providers: [],
    exports: [
       // ListaComponent,
        //LoginComponent,
       // UsuarioComponent
    ]
})
export class UsuarioModule { }

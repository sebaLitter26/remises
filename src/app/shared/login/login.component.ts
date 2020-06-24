import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material';
import { Observable, Subject, Subscription, pipe } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, take, startWith } from 'rxjs/operators';





import { UbicacionService, NavService } from '../../services/index.services';

import { LoginService } from './login.service';
/**
 * @title Table with a sticky columns
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    title = 'app';
    @ViewChildren('appDrawer') appDrawer: ElementRef;

    formGroup: FormGroup;


    constructor(
        public _nav: NavService,
        private _formBuilder: FormBuilder,
        public router: Router,
        public _ubi: UbicacionService,
    ) {
        this._ubi.checkeo_inicial_logueado();
        console.log("Constructor de loginComponent");
    }


    ngOnInit() {
        //this.trigger.openMenu();
        //this._nav.openNav();
        console.log("Abro el navbar");
        this.formGroup = new FormGroup({
            usuario: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            pass: new FormControl('', [Validators.required, Validators.minLength(4)])
        });
    }

    ngAfterViewInit() {
        console.warn("After init SideNav", this.appDrawer);
        this._nav.appDrawer = this.appDrawer;




    }

    loguearse() {
        let logueo = { 
            codigo: this.formGroup.get('usuario').value, 
            clave: this.formGroup.get('pass').value , 
            autorizada: localStorage.getItem("maquina_autorizada") ,
        };
        this._ubi.validar_usuario(logueo);
    }

    isString(str) {
        return typeof (str) == 'string' || str instanceof String;
    }


    editar_perfil() {
        let id = this._ubi.usuario.idusuario;

        console.log('id user', id);

        this.router.navigate(['usuario']);
    }



    isLoged() {
        let body_login = document.getElementsByTagName("mat-sidenav-content")[0] as HTMLElement;
        body_login.style.height = (this._ubi.usuario_logueado) ? '10%' : '-webkit-fill-available';

    }



}

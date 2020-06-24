import { Component, Input, Output, OnInit, ViewChild, EventEmitter} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { QuestionBase } from '../../../models/administracion.models/index.models';
import { QuestionControlService, QuestionService, AbmService } from '../../../services/administracion.services/index.services';

import { MODULOS } from '../../administracion/actions';

//ngrx
import { Store, select } from '@ngrx/store';
import { AdministracionState } from '../../../store/administracion.reducers';
import * as administracionActions from '../../../store/actions/administracion.actions';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './formulario.component.html',
    styleUrls: ['./formulario.component.scss'],
    providers: [QuestionControlService, QuestionService]
})

export class DynamicFormComponent implements OnInit {
    @Input() datos_form: any;
    @Output() submit = new EventEmitter<any>();

    //@Output() filtros = new EventEmitter();
    form: FormGroup;
    //payLoad: '';
    questions: QuestionBase<any>[] = [];
    dato: any;

    columnas_adaptadas: number = 4;
    private observador_colum: string;
    nombreTabla: string;

    constructor(
        private _qcs: QuestionControlService,
        private _filter: QuestionService,
        private _SrvService: AbmService,
        //private store: NgRedux<IAppState>,
        private store: Store<AdministracionState>,
    ) { }

    ngOnInit() {
        this.nombreTabla = this.datos_form.tabla;
        this.showCampos(this.nombreTabla);
    }

    /*
    showCampos(nombre_tabla): void {
        this.elige_observable(nombre_tabla);
        let nombre_tabla_obser = this.nombre.subscribe(nombre => {
            console.log("tabla-output", nombre_tabla);
            if (nombre == nombre_tabla)
                this.elige_observable(nombre_tabla);
        });
        nombre_tabla_obser.unsubscribe();
        //alert(event.nombre_tabla);
    }
    */


    showCampos(nombre_tabla: string) {
        let observador = MODULOS[nombre_tabla][0].nombre;
        if (!observador) {
            console.warn("No se ha leído ninguna tabla en grilla", observador);
            return;
        }
        this.nombreTabla = nombre_tabla;
        this.observador_colum = 'columnas_' + observador;
        this.datos_form['tabla'] = nombre_tabla;
        //console.log('columnas', this.observador_colum);
        this.store.select(state => state['administracion'].columnas[this.observador_colum]).pipe(take(1)).subscribe(columnas => {
            this.questions = this._filter.getQuestions(columnas, this.datos_form);
            this.form = this._qcs.toFormGroup(this.questions);
            let ancho = (<HTMLScriptElement[]><any>document.getElementsByTagName("mat-grid-list"));
            this.columnas_adaptadas = Math.floor(ancho[ancho.length - 1].offsetWidth / 220);
        });
    }

    objectForId(obj) {
        let newObj = obj;
        Object.keys(obj).forEach((prop) => {
            if (obj[prop] && typeof (obj[prop]) == 'object' && obj[prop] !== '' && ('key' in obj[prop])) {
                newObj[prop] = obj[prop].key;
            }
            if (!obj[prop]) {
                newObj[prop] = '';
            }
        });
        return newObj;
    };

    onSubmit() {

        //console.log(this.form);
        var datos_formulario = this.objectForId(this.form.value);

        console.log(datos_formulario);
        this._SrvService.setURL(this.nombreTabla);

        if (this.datos_form.accion == 'filtrar') {
            datos_formulario['tabla'] = this.nombreTabla;
            this.store.dispatch(new administracionActions.FiltrarGrillaEffects(datos_formulario));
        }
        else if (this.datos_form.accion == 'abm') {
            this.store.select(state => state['administracion'].datos).pipe(take(1)).subscribe((datos) => {
                datos_formulario['id'] = datos.idCampo;
                this.submit.emit(datos_formulario);
            });
        }
    }
}

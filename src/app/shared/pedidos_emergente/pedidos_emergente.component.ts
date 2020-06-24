import {
    Component, NgModule, OnInit, AfterViewInit, Input, ComponentFactory, ComponentRef, ComponentFactoryResolver, ViewContainerRef,
    ChangeDetectorRef, TemplateRef, ViewChild, Output, EventEmitter, Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatStepper } from '@angular/material';
import { trigger, style, animate, transition } from '@angular/animations';
//import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

//Para el 'programar viaje'
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports

import { UbicacionService } from '../../services/ubicacion.service';
import { QuestionControlService, QuestionService } from '../../services/administracion.services/index.services';

import { QuestionBase } from '../../models/administracion.models/index.models';


const moment = _moment;
export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

//import { ApiService } from '../../services/index.services';
//import { ModificacionComponent } from '../modificacion/modificacion.component';

/********************************/
import { timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

//import { NgRedux, select } from '@angular-redux/store';
//import { IAppState } from '../../store';
//import { MODULOS } from '../../actions';
/********************************/

@Component({
    selector: 'pedidos-emergente-dialog',
    templateUrl: './pedidos_emergente.component.html',
    styleUrls: ['./pedidos_emergente.component.scss'],
    providers: [
        QuestionControlService, QuestionService,
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: 'es_AR' },
    ], //Inyección de dependencias

})

export class PedidosEmergenteComponent implements OnInit, AfterViewInit {
    //@select() buffer;

    //@ViewChild("componentContainer", { read: ViewContainerRef }) container: ViewContainerRef;

    //componentRef: ComponentRef<any>;
    diaSeleccionado: any;
    diasCoincidentes: boolean = false;
    datos_modif: any = false;
    horaMinima: string = '';
    tiempoAntesMal: boolean = false;
    horaIncorrecta: boolean = false;
    datosIncorrectos: boolean = false;
    private cache: any;
    public estado: boolean = false;
    dia = new FormControl(new Date());
    questions: QuestionBase<any>[] = [];
    form: FormGroup;

    formGroup = this._formBuilder.group({
        tipo_viaje: [''],
        fechaeventual: [''],
        horaeventual: ['', Validators.required],
        tiempoAntes: ['10', Validators.required],
        cantidad: [''],
        observacion: [''],
    }, { validator: this.dateLessThan('horaeventual') }
    );


    constructor(
        public dialogRef: MatDialogRef<PedidosEmergenteComponent>,
        //private resolver: ComponentFactoryResolver,
        //private store: NgRedux<IAppState>,     //Redux
        //private storeService: AlmacenService,
        //stepper: MatStepper,
        private _formBuilder: FormBuilder,
        public _ubi: UbicacionService,
        private _qcs: QuestionControlService,
        private _filter: QuestionService,


        @Inject(MAT_DIALOG_DATA) public popup_datos: any,
    ) {           //this.datosIncorrectos=true;
    }

    ngOnInit() {
        //this.createComponent();.
        console.log('popup_datos', this.popup_datos);

        //this.elige_observable(this.popup_datos.nombre_tabla);
        if (this.popup_datos.titulo == "Programar viaje") {
            this.formGroup.reset({
                horaeventual: this.popup_datos.horaMinima,
                fechaeventual: this.popup_datos.minDate,
                tiempoAntes: 10,
            });
            this.horaMinima = this.popup_datos.horaMinima;
        }
        if (this.popup_datos.titulo == "Observaciones") {
            this.formGroup.reset({
                observacion: this.popup_datos.observacion
            });
        }
    }

    ngAfterViewInit() {
        if (this.popup_datos.datosAdministrativos)
            this.getFormularioDinamico();

        //this.stepper.selectedIndex = 1;

    }
    getFormularioDinamico() {
        //Hacer un método que me traiga del usuario los campos que tengo que mostrar.

        this._ubi.camposAdministrativos.forEach(element => {
            console.log(element);
            var elemento = {
                headerName: element.label + ((element.obligatorio == 1) ? '*' : ''),
                field: element.key,
                modo: element.modo,
                tipo: "textbox",
                maxlength: element.length,
                required: (element.obligatorio == 1) ? true : false,
                valor: (element.valor) ? element.valor : null,
            };
            this.questions.push(this._filter.obtener_input(elemento));
            this.form = this._qcs.toFormGroup(this.questions);
        });
    }

    checkCurrentLession() {
        if (this.form) {
            return (this.form && this.form.status == "VALID") ? false : true;
        } else {
            return false;
        }
        /*
        if(this.popup_datos.titulo == "Observaciones" )
          return (this.form && this.form.status=="VALID") ? false : true ;
        else{
          if(this.datosIncorrectos)
            return true
          else
            return false;
        }
        */
    }

    ngOnDestroy() {
        //this.destruir_popup();
        //this.componentRef.destroy();
        //this.confirmSelection();
    }

    destruir_popup() {
        console.log("Se cierra el pop-up");

        //this.dialogRef.close(false);
        this.dialogRef.close(false);
    }

    dateLessThan(from: string) {
        return (group: FormGroup) => {
            if (this.popup_datos.titulo == "Programar viaje") {
                let f = group.controls[from];
                let f2 = group.controls['tiempoAntes'];
                console.log(f, f2)
                if (f.value < this.horaMinima)
                    this.horaIncorrecta = true;
                else
                    this.horaIncorrecta = false;
                if (f2.value < 5 || f2.value > 60)
                    this.tiempoAntesMal = true;
                else
                    this.tiempoAntesMal = false;
                if (this.tiempoAntesMal || this.horaIncorrecta)
                    this.datosIncorrectos = true;
                else
                    this.datosIncorrectos = false;
            }
        }
    }

    diaSelect(event) {
        this.diaSeleccionado = event.value;
        console.log(this.diaSeleccionado.toDate().toDateString());
        //console.log(event ,this.diaSeleccionado.toDateString() );
        let date_selected = this.diaSeleccionado.toDate().toDateString();
        let date_minimo = this.popup_datos.minDate.toDateString();
        if (date_minimo == date_selected) {
            this.horaMinima = this.popup_datos.horaMinima;
            this.diasCoincidentes = true;
        }
        else {
            this.horaMinima = '00:00';
            this.diasCoincidentes = false;
        }
    }

    confirmSelection() {
        if (this.popup_datos.carga) {
            let formulario = this.formGroup.getRawValue();

            if (this.popup_datos.datosAdministrativos)
                Object.assign(formulario, this.form.value);

            if (!this.datosIncorrectos) {
                this.popup_datos = formulario;
                this.popup_datos.coincidencia = this.diasCoincidentes;
            }
        }
        //console.log('confirm', this.popup_datos);
        if (!this.datosIncorrectos) {
            this.dialogRef.close(this.popup_datos);
        }
    }

    elige_observable(nombre_tabla: string) {
        setTimeout(() => {
            this.destruir_popup();
        }, 3000);
    }
}

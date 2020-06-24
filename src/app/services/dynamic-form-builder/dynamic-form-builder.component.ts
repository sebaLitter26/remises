import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'dynamic-form-builder',
    styles: [`.color-line{ background-color: rgb(0, 191, 255,0.2); padding:9px; border-radius: 5px; margin: 10px 0px 10px 0px;}`],
    template: `
    <form *ngIf="fields && fields.length>0" (ngSubmit)="onSubmit.emit(this.form.value);" [formGroup]="form" class="form-horizontal">

      <div  *ngFor="let field of fields; let odd = odd" [ngClass]="{ 'color-line': odd}" >

          <field-builder [field]="field"  [form]="form" (click)="modif_estructura(field)"></field-builder>
      </div>
      <div class="form-row"></div>
      <div class="form-group row">
        <div class="col-md-3"></div>
        <div class="col-md-9">

          <button type="submit"  class="btn btn-primary">Guardar  {{fields[0].nombre}}</button>

        </div>
      </div>
    </form>
  `,
})

//[disabled]="!form.valid"
export class DynamicFormBuilderComponent implements OnInit {
    @Output() onSubmit = new EventEmitter();
    @Input() parametros: Observable<any[]>;
    form: FormGroup;
    fields: any = {};
    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        //console.log('parametros', this.parametros);
        this.parametros.subscribe((params: any) => {

            this.fields = params;
            //console.log('fields', this.fields);

            this.cambio_formulario(params);

        });

    }


    modif_estructura(field) {
        //console.log('modif_estructura', !this.form.controls['placeholder']);
        if (field && !this.form.controls['placeholder'])
            this.onSubmit.emit(field);
    }


    cambio_formulario(campos) {
        if (!campos)
            return;
        let fieldsCtrls = {};

        //console.log('campos', campos);

        for (let f of campos) {
            var dato = {};
            dato[f.codigo] = (f.valor) ? f.valor : 10;
            //dato[f.codigo] = (f.valor && f.valor.length == 0) ? f.valor : '';



            if (f.tipo != 'checkbox' && f.tipo != 'dropdown_multiple') {
                fieldsCtrls[f.codigo] = new FormControl(f.valor || '', Validators.required);

                //console.log('tipo', f.codigo, f.tipo, (f.tipo != 'checkbox' && f.tipo != 'dropdown_multiple'));

            } else if (f.opciones && f.opciones.length > 0) {
                let opts = {};

                /*
                                for (let opt of f.opciones) {
                                    opts[opt.key] = new FormControl(opt.valor || []);
                                }
                                */

                let controls = f.opciones.map(c => new FormControl(c || []));

                //console.log('control', controls);


                /*
                                if (f.valor) {
                                    const result = f.opciones.filter(key => key.key == f.valor);
                                    console.log('result', result);
                                    controls[0].patchValue(result.key); // Set the first checkbox to true (checked)
                                }


                                                                this.form = this.formBuilder.group({
                                                                    orders: new FormArray(controls)
                                                                });
                                                                */

                //fieldsCtrls[f.codigo] = this.formBuilder.array(opts);

                fieldsCtrls[f.codigo] = this.formBuilder.array(controls);
                if (f.valor)
                    fieldsCtrls[f.codigo].patchValue(f.valor);


                //const controls = f.opciones.map(c => new FormControl(false));
                //controls[0].setValue(true); // Set the first checkbox to true (checked)

                //opts = new FormArray(controls);

                //console.log('dato multiple', f.codigo, controls, fieldsCtrls[f.codigo]);


                /*
                    group[control.key] = control.required ? [control.value || '', Validators.required] : [control.value || ''];
                });
                */

                //fieldsCtrls[f.codigo] = new FormGroup(opts);
                //fieldsCtrls[f.codigo].patchValue(dato);
                //console.log('fieldsCtrls', fieldsCtrls[f.codigo]);
            }

            //this.form.setValue({ name: 'Mahesh', age: 20, city: '', country: '' });

        }

        this.form = this.formBuilder.group(fieldsCtrls);
        //console.log('dato', this.form, fieldsCtrls);

        //this.form.setValue(dato);
        //console.log('form', this.form);



        //this.form.controls[this.field.codigo].patchValue(dato);

        //console.log(campos, this.form, fieldsCtrls);



    }


}

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { QuestionBase } from '../../../models/administracion.models/index.models';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-question',
    templateUrl: './formulario-question.component.html',
    styleUrls: ['./formulario.component.scss'],
})
export class DynamicFormQuestionComponent implements OnInit {
    @Input() question: QuestionBase<any>;
    @Input() form: FormGroup;

    objeto: { key: number, value: string };
    myControl = new FormControl();
    filteredOptions: Observable<string[]>;
    maxlength: number;

    constructor() { }

    get isValid() {
        if(this.form.controls[this.question.key].touched)
          return this.form.controls[this.question.key].valid;
        else return true;
    }

    ngOnInit() {
        this.maxlength = this.question.maxlength;
        if (this.question.controlType == 'dropdown') {
            if (this.question.value) {
              this.carga_inicial_dropbox(this.question.value);
            }
          //  console.log(this.form.get('id_provincia'));
            this.filteredOptions = this.myControl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => this._filter(value))
                );
        }
    }

    private carga_inicial_dropbox(valor: number) {
        this.objeto = this.question.options.find(x => x.key == valor);
        this.myControl.setValue(this.objeto);
    }

    private _filter(nombre: any): string[] {
        this.form.controls[this.question.key].setValue(nombre.key);
        if (this.myControl.dirty && nombre == '') {
            this.objeto = null;
        }
        if (this.isString(nombre)) {
            const filterValue = nombre.toLowerCase();
            this.objeto = nombre;
            return this.question.options.filter(option => option.value.toLowerCase().includes(filterValue));
        } else {
            this.objeto = nombre.key;
        }
    }

    toggleFunction(event){
        //console.log("Apreté el TOGGLE!", event.checked);
        this.form.controls[this.question.key].setValue(event.checked);
//console.log(this.form.controls);
        this.question['value']=event.checked;
        //console.log(this.question);
        //console.log(this.form);
    }

    isString(str) {
        //console.log(str);
        return typeof (str) == 'string' || str instanceof String;
    }

    displayFn(option: any): string {
        return option ? option.value : option;
    }
}

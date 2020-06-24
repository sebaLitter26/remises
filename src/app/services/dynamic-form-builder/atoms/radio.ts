import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'radio',
    template: `
      <div [formGroup]="form">

        <div [formGroupName]="field.codigo" >
            <div class="form-check" *ngFor="let opt of field.opciones">
                <label class="form-check-label" (click)="field.valor = opt.key">
                  <input class="form-check-input" type="radio" [checked]="opt.key==field.valor"   name="{{field.codigo}}" [value]="opt.key" >
                    {{opt.valor}}

                 </label>
            </div>
        </div>

      </div>
    `
})
export class RadioComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;



    // [checked]="opt.key==field.valor "


}

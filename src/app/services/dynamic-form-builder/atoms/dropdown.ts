import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'dropdown',
    template: `
      <div [formGroup]="form">

        <select class="form-control" [formControlName]="field.codigo"  >
          <option *ngFor="let opt of field.opciones" [selected]="field.valor && field.valor==opt.key" [value]="opt.key">{{opt.valor}}</option>
        </select>
      </div>
    `
})
export class DropDownComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;

}

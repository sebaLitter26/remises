import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

// text,email,tel,textarea,password,
@Component({
    selector: 'textbox',
    template: `
      <div [formGroup]="form">

            <input  [attr.type]="field.type" class="form-control" value="field.valor"  [id]="field.codigo" [name]="field.codigo" [formControlName]="field.codigo" placeholder="{{field.placeholder}}">

      </div>
    `
})
export class TextBoxComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    get isValid() { return this.form.controls[this.field.codigo].valid; }
    get isDirty() { return this.form.controls[this.field.codigo].dirty; }


}

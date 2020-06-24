
import { QuestionBase } from '../../../../models/administracion.models/index.models';

export class MapQuestion extends QuestionBase<string> {
    controlType = 'map';
    options: { key: string, value: string }[] = [];

    constructor(
        options: {} = {}
    ) {
        super(options);
        this.options = options['options'] || [];

    }



}

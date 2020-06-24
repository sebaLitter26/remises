export class Modificacion {
    public id: number;
    public tipo: string;
    public nombre_tabla: string;

    constructor(init?: Partial<Modificacion>) {
        Object.assign(this, init);
    }
}

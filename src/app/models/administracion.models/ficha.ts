export class Ficha{
	public id: number;
	public valor: number;
	public id_provincia: number;

	constructor(init?:Partial<Ficha>) {
					Object.assign(this, init);
	}
}

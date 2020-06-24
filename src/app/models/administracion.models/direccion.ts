export class Direccion{
	public lat: number = undefined;
	public lng: number = undefined;
	public lon: number = undefined;
	public calle: string = "";
	public altura: number = 0;
	public localidad: string = "";
	public departamento: string = "";
	public provincia: string = "";
	public observaciones: string = "";
	public id_domicilio: string = '';

	constructor(init?:Partial<Direccion>) {
					Object.assign(this, init);
	}
}

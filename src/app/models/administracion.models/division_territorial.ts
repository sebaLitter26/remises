export class DivisionTerritorial{
	public id: number;
	public tipo: string;
	public nombre: string;

	constructor(init?:Partial<DivisionTerritorial>) {
					Object.assign(this, init);
	}
}

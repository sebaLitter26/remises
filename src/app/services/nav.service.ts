import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NavService {
    public items: any[] = [];
    public appDrawer: any;
    public estadoItem: any[] = [];
    expanded: boolean = false;

    constructor() {
        this.items = [];
        this.estadoItem = [];
    }

    public closeNav() {
        this.appDrawer.first.close();
        this.expanded = false;
    }

    public openNav() {
        this.appDrawer.first.open();
        this.expanded = true;
    }

    public verEstado(): boolean {
        //console.log("Alguien me llama!");
        return true;
    }

    public selectItem(seleccion: any) {
        var itemUtilizado: boolean = false;
        seleccion.expanded = false;

        if (this.items.length != 0) {
            this.items.forEach(item => {
                item.expanded = false;

                if (item.displayName == seleccion.displayName) {
                    itemUtilizado = true;
                    item.expanded = true
                }
                //console.log(item);
            })
            if (!itemUtilizado) {
                this.estadoItem['seleccion.displayName'] = true;
                this.items.push(seleccion);
            }
        }
        else this.items.push(seleccion);
        //console.log(this.items);
        //console.log(this.estadoItem);
    }
}

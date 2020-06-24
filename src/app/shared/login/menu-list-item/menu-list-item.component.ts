import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavItem } from '../../../models/index.models';
import { Router } from '@angular/router';
//import { NavService } from '../nav.service';
import { UbicacionService, NavService } from '../../../services/index.services';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { ActivatedRoute } from '@angular/router';


import {
    REDIMENSION_SIDENAV
} from '../../../store/actions';

import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';

@Component({
    selector: 'app-menu-list-item',
    templateUrl: './menu-list-item.component.html',
    styleUrls: ['./menu-list-item.component.scss'],
    animations: [
        trigger('indicatorRotate', [
            state('collapsed', style({ transform: 'rotate(0deg)' })),
            state('expanded', style({ transform: 'rotate(180deg)' })),
            transition('expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
            ),
        ])
    ]
})

export class MenuListItemComponent {
    //expanded: boolean;

    @HostBinding('attr.aria-expanded') ariaExpanded = this._nav.expanded;
    @Input() item: NavItem;
    @Input() depth: number;

    static modulo: string = '';

    constructor(
        public _nav: NavService,
        public router: Router,
        public _ubi: UbicacionService,
        private store: Store<AppState>,
        public routerActivada: ActivatedRoute
    ) {

        console.log('item', this.item);
        if (this.depth === undefined) {
            this.depth = 0;
        }
    }

    onItemSelected(item: NavItem) {


        this._nav.expanded = item.expanded;
        if (item.modulo != undefined) {
            MenuListItemComponent.modulo = item.modulo;
            //console.log(MenuListItemComponent.modulo);
        }/*
        else {
          MenuListItemComponent.modulo = item.route;
        }*/
        this._nav.selectItem(item);
        if (!item.children || !item.children.length) {

            switch (MenuListItemComponent.modulo) {
                case 'pedidos':
                    this.router.navigate(['pedidos']);
                    break;

                case 'desptaxis':
                    let url = window.location.protocol + '//' + window.location.hostname + '/' + MenuListItemComponent.modulo;
                    window.open(url, '_blank');
                    break;
                case 'administracion':
                    console.warn("Ruteo de ADMINISTRACION");
                    console.log(this.routerActivada);
                    this.router.navigate([MenuListItemComponent.modulo, item.route]);
                    //this.router.navigate([{outlets: {administracion: ['cliente']}}]);
                    break;
                case 'callejero':
                    this.router.navigate(['callejero']);
                    break;
                default:
                    this.router.navigate([MenuListItemComponent.modulo, item.route]);
            }

            //this.router.navigate([MenuListItemComponent.modulo, item.route]);



            /*
                        switch (this.route) {
                            case 'pedidos':
                                this.router.navigate(['pedidos']);
                                break;
                            case 'administracion':
                                console.log(item);
                                this.router.navigate(['administracion']);
                                break;
                            case 'desptaxis':
                                let url = window.location.protocol + '//' + window.location.hostname + '/' + item.route;
                                window.open(url, '_blank');
                                break;
                            default:
                                this.router.navigate(['despacho', item.route]);
                        }
                        */
            this._nav.closeNav();
            this.store.dispatch({ type: REDIMENSION_SIDENAV, sidenav: true });

        }
        if (item.children && item.children.length) {
            this._nav.items.forEach(elemento => {
                if (item.displayName != elemento.displayName)
                    elemento.expanded = false;
                else {
                    if (elemento.hasOwnProperty('expanded')) {
                        //this.expanded=item.expanded;
                        this._nav.expanded = !this._nav.expanded;
                    }
                    elemento.expanded = this._nav.expanded;
                }
            });
        }
    }
}

export interface NavItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    modulo: string;
    route?: string;
    children?: NavItem[];
    expanded: boolean;
}

import { JSONSchema7 } from 'json-schema';
import __CarpenterFetchAdapter from '../js/adapters/CarpenterFetchAdapter.js';
export interface ICarpenterSettings {
    adapter: typeof __CarpenterFetchAdapter;
}
export interface ICarpenterSpecs {
    components: Record<string, ICarpenterComponent>;
}
export interface ICarpenterComponent {
    id: string;
    name: string;
    description?: string;
    schema: JSONSchema7;
    values: any;
    $component: Element;
}
export interface ICarpenterUpdateObject {
    component: ICarpenterComponent;
    path: string[];
    value: any;
}
export interface ICarpenterUpdateResult {
    component: ICarpenterComponent;
    path: string[];
    value: any;
    html?: string;
}
export interface ICarpenterCustomEvent extends CustomEvent {
    detail: ICarpenterComponent;
}
export interface ICarpenterAdapter {
    applyUpdate(ICarpenterUpdateObject: any): void;
}
export interface ICarpenterWidget {
    id: string;
    tag: string;
}

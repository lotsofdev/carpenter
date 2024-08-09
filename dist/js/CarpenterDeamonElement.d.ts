import __LitElement from '@lotsof/litElement';
import '../../src/css/CarpenterDaemonElement.css';
import { ICarpenterComponent } from '../shared/Carpenter.types.js';
export default class CarpenterDaemonElement extends __LitElement {
    private _domElementsToComponentObjectMap;
    private _componentObjectToDomElements;
    private _$actions;
    constructor();
    private firstUpdated;
    mount(): Promise<void>;
    getComponentDomElement(component: ICarpenterComponent): Element;
    getComponentFromDomElement($elm: Element): ICarpenterComponent;
    private _loadSpecs;
    private _loadSpecsScript;
    private _setActionsSizeAndPosition;
    private _initComponentListeners;
    protected _emit(name: string, value: ICarpenterComponent): void;
    protected render(): any;
}

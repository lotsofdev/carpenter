import __LitElement from '@lotsof/lit-element';
import '../../src/css/CarpenterDaemonElement.css';
import { TCarpenterComponent } from '../shared/Carpenter.types.js';
export default class CarpenterDaemonElement extends __LitElement {
    private _domElementsToComponentObjectMap;
    private _componentObjectToDomElements;
    private _$actions;
    constructor();
    protected firstUpdated(): void;
    mount(): Promise<void>;
    getComponentDomElement(component: TCarpenterComponent): Element;
    getComponentFromDomElement($elm: Element): TCarpenterComponent;
    private _loadSpecs;
    private _loadSpecsScript;
    private _setActionsSizeAndPosition;
    private _initComponentListeners;
    protected _emit(name: string, value: TCarpenterComponent): void;
    protected render(): any;
}

import __LitElement from '@lotsof/lit-element';
import '@lotsof/json-schema-form';
import __CarpenterFetchAdapter from '../components/fetchAdapter/fetchAdapter.js';
import '../../src/css/CarpenterElement.css';
import { TCarpenterComponent, TCarpenterWidget } from '../shared/Carpenter.types.js';
export default class CarpenterElement extends __LitElement {
    static widgets: Record<string, TCarpenterWidget>;
    static registerWidget(widget: TCarpenterWidget): void;
    accessor src: string;
    accessor adapter: __CarpenterFetchAdapter | null;
    accessor widgets: Record<string, TCarpenterWidget>;
    accessor _currentComponent: TCarpenterComponent | null;
    accessor _currentComponentId: string;
    private _registeredWidgets;
    private _specs;
    private _$iframe?;
    constructor();
    /**
     * @name      isDaemon
     * @type      Boolean
     * @get
     *
     * Return true if the component runs into the iframe (in deamon mode)
     *
     * @since     1.0.0
     */
    get isDaemon(): boolean;
    get $iframeDocument(): Document | null | undefined;
    mount(): Promise<void>;
    private _initListeners;
    registerComponent(component: TCarpenterComponent): void;
    private _initEnvironment;
    private _injectCarpenterDeamon;
    private _findInSchema;
    private _applyUpdate;
    render(): import("lit-html").TemplateResult<1> | undefined;
}

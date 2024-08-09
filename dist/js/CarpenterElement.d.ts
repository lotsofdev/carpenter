import __LitElement from '@lotsof/litElement';
import '../components/wysiwygWidget/wysiwygWidget.js';
import __CarpenterFetchAdapter from '../components/fetchAdapter/fetchAdapter.js';
import '../../src/css/CarpenterElement.css';
import { ICarpenterComponent, ICarpenterWidget } from '../shared/Carpenter.types.js';
export default class CarpenterElement extends __LitElement {
    static widgets: Record<string, ICarpenterWidget>;
    static registerWidget(widget: ICarpenterWidget): void;
    accessor src: string;
    accessor adapter: __CarpenterFetchAdapter | null;
    accessor widgets: Record<string, ICarpenterWidget>;
    accessor _currentComponent: ICarpenterComponent | null;
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
    registerComponent(component: ICarpenterComponent): void;
    private _initEnvironment;
    private _injectCarpenterDeamon;
    private _findInSchema;
    private _validateValues;
    private _renderComponentValueErrors;
    private _renderComponentValueEditWidget;
    private _applyUpdate;
    private _createComponentDefaultValuesFromSchema;
    private _renderComponentValuesPreview;
    protected render(): import("lit-html").TemplateResult<1> | undefined;
}

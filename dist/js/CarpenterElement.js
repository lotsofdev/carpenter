var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CarpenterElement_src_accessor_storage, _CarpenterElement_adapter_accessor_storage, _CarpenterElement_widgets_accessor_storage, _CarpenterElement__currentComponent_accessor_storage, _CarpenterElement__currentComponentId_accessor_storage;
import __LitElement from '@lotsof/lit-element';
import '@lotsof/json-schema-form';
// @todo    check why is a problem importing this functions
// @ts-ignore
import { __isInIframe } from '@lotsof/sugar/is';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../../src/css/CarpenterElement.css';
class CarpenterElement extends __LitElement {
    static registerWidget(widget) {
        this.widgets[widget.id] = widget;
    }
    get src() { return __classPrivateFieldGet(this, _CarpenterElement_src_accessor_storage, "f"); }
    set src(value) { __classPrivateFieldSet(this, _CarpenterElement_src_accessor_storage, value, "f"); }
    get adapter() { return __classPrivateFieldGet(this, _CarpenterElement_adapter_accessor_storage, "f"); }
    set adapter(value) { __classPrivateFieldSet(this, _CarpenterElement_adapter_accessor_storage, value, "f"); }
    get widgets() { return __classPrivateFieldGet(this, _CarpenterElement_widgets_accessor_storage, "f"); }
    set widgets(value) { __classPrivateFieldSet(this, _CarpenterElement_widgets_accessor_storage, value, "f"); }
    get _currentComponent() { return __classPrivateFieldGet(this, _CarpenterElement__currentComponent_accessor_storage, "f"); }
    set _currentComponent(value) { __classPrivateFieldSet(this, _CarpenterElement__currentComponent_accessor_storage, value, "f"); }
    get _currentComponentId() { return __classPrivateFieldGet(this, _CarpenterElement__currentComponentId_accessor_storage, "f"); }
    set _currentComponentId(value) { __classPrivateFieldSet(this, _CarpenterElement__currentComponentId_accessor_storage, value, "f"); }
    constructor() {
        super('s-carpenter');
        _CarpenterElement_src_accessor_storage.set(this, '');
        _CarpenterElement_adapter_accessor_storage.set(this, null);
        _CarpenterElement_widgets_accessor_storage.set(this, {});
        _CarpenterElement__currentComponent_accessor_storage.set(this, null);
        _CarpenterElement__currentComponentId_accessor_storage.set(this, '');
        this._registeredWidgets = {};
        this._specs = {
            components: {},
        };
    }
    /**
     * @name      isDaemon
     * @type      Boolean
     * @get
     *
     * Return true if the component runs into the iframe (in deamon mode)
     *
     * @since     1.0.0
     */
    get isDaemon() {
        return __isInIframe();
    }
    get $iframeDocument() {
        var _a;
        return (_a = this._$iframe) === null || _a === void 0 ? void 0 : _a.contentDocument;
    }
    mount() {
        return __awaiter(this, void 0, void 0, function* () {
            // handle the widgets
            this._registeredWidgets = Object.assign(Object.assign({ wysiwyg: {
                    id: 'wysiwyg',
                    tag: 's-carpenter-wysiwyg-widget',
                } }, this.widgets), CarpenterElement.widgets);
            // if not in an iframe, init the environment
            // by creating an iframe and load the carpenter deamon
            // inside it
            if (this.isDaemon) {
                return;
            }
            // load the environment by
            // creating the iframe etc...
            yield this._initEnvironment();
            // init the listeners like escape key, etc...
            this._initListeners(document);
            this._initListeners(this.$iframeDocument);
        });
    }
    _initListeners(context) {
        // escape key
        context.addEventListener('keyup', (e) => {
            switch (true) {
                case e.key === 'Escape':
                    this._currentComponent = null;
                    break;
            }
        });
    }
    registerComponent(component) {
        this.log(`Registering the component (${component.name})[#${component.id}]`);
        this._specs.components[component.id] = component;
    }
    _initEnvironment() {
        var _a, _b, _c, _d, _e, _f, _g;
        this.log(`Init the carpenter environment...`);
        // move the component into the body
        document.body.appendChild(this);
        // create the iframe
        const $iframe = document.createElement('iframe');
        $iframe.classList.add(this.cls('_iframe'));
        this._$iframe = $iframe;
        // append the iframe to the body
        document.body.appendChild($iframe);
        // copy the document into the iframe
        (_a = $iframe === null || $iframe === void 0 ? void 0 : $iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document.open();
        (_b = $iframe === null || $iframe === void 0 ? void 0 : $iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.document.write(document.documentElement.outerHTML);
        (_c = $iframe === null || $iframe === void 0 ? void 0 : $iframe.contentWindow) === null || _c === void 0 ? void 0 : _c.document.close();
        (_e = (_d = this.$iframeDocument) === null || _d === void 0 ? void 0 : _d.querySelector(`.${this.cls('_iframe')}`)) === null || _e === void 0 ? void 0 : _e.remove();
        (_g = (_f = this.$iframeDocument) === null || _f === void 0 ? void 0 : _f.querySelector(this.tagName)) === null || _g === void 0 ? void 0 : _g.remove();
        // empty page
        document
            .querySelectorAll(`body > *:not(${this.tagName}):not(script):not(iframe)`)
            .forEach(($el) => {
            $el.remove();
        });
        // inject the carpenter deamon
        this._injectCarpenterDeamon();
    }
    _injectCarpenterDeamon() {
        var _a, _b, _c, _d;
        const $deamon = (_b = (_a = this._$iframe) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.createElement('s-carpenterd');
        $deamon.setAttribute('id', 's-carpenterd');
        $deamon.setAttribute('verbose', 'true');
        $deamon.addEventListener('carpenter.component', (e) => {
            this.registerComponent(e.detail);
        });
        $deamon.addEventListener('carpenter.edit', (e) => {
            this._currentComponent = e.detail;
            this.requestUpdate();
        });
        (_d = (_c = this._$iframe) === null || _c === void 0 ? void 0 : _c.contentDocument) === null || _d === void 0 ? void 0 : _d.body.appendChild($deamon);
    }
    _findInSchema(schema, path) {
        const foundSchema = path.reduce((acc, key) => {
            var _a, _b, _c;
            if ((_a = acc === null || acc === void 0 ? void 0 : acc.properties) === null || _a === void 0 ? void 0 : _a[key]) {
                return acc.properties[key];
            }
            if ((_c = (_b = acc === null || acc === void 0 ? void 0 : acc.items) === null || _b === void 0 ? void 0 : _b.properties) === null || _c === void 0 ? void 0 : _c[key]) {
                return acc.items.properties[key];
            }
            if ((acc === null || acc === void 0 ? void 0 : acc[key]) !== undefined) {
                return acc[key];
            }
            return null;
        }, schema);
        return foundSchema;
    }
    _applyUpdate(update) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.adapter) {
                this.log(`No adapter defined to handle update of ${update.path.join('.')}...`, update.value);
                return;
            }
            // make the update throug the specified adapter
            const response = yield this.adapter.applyUpdate(update);
            // if the component has been totally updated
            // we need to refresh his reference
            if (!update.component.$component.parentElement) {
                update.component.$component = (_a = this.$iframeDocument) === null || _a === void 0 ? void 0 : _a.querySelector(`#${update.component.id}`);
            }
            // update the component
            this.requestUpdate();
        });
    }
    render() {
        if (this._currentComponent) {
            return html `
        <div class=${this.cls('_component')}>
          <header class=${this.cls('_header')}>
            <h2 class=${this.cls('_header-title')}>
              ${this._currentComponent.name}
            </h2>
            ${this._currentComponent.description
                ? html `
                  <p class=${this.cls('_header-description')}>
                    ${this._currentComponent.description}
                  </p>
                `
                : ''}
          </header>

          <s-json-schema-form
            @sJsonSchemaForm.update=${(e) => {
                console.log('UP', e);
                this._applyUpdate(Object.assign(Object.assign({}, e.detail.update), { component: this._currentComponent }));
            }}
            id="s-carpenter-json-schema-form"
            name="s-carpenter-json-schema-form"
            .verbose=${this.verbose}
            .schema=${this._currentComponent.schema}
            .values=${this._currentComponent.values}
          ></s-json-schema-form>
        </div>
      `;
        }
    }
}
_CarpenterElement_src_accessor_storage = new WeakMap(), _CarpenterElement_adapter_accessor_storage = new WeakMap(), _CarpenterElement_widgets_accessor_storage = new WeakMap(), _CarpenterElement__currentComponent_accessor_storage = new WeakMap(), _CarpenterElement__currentComponentId_accessor_storage = new WeakMap();
CarpenterElement.widgets = {};
export default CarpenterElement;
__decorate([
    property({ type: String })
], CarpenterElement.prototype, "src", null);
__decorate([
    property()
], CarpenterElement.prototype, "adapter", null);
__decorate([
    property({ type: Object })
], CarpenterElement.prototype, "widgets", null);
__decorate([
    state()
], CarpenterElement.prototype, "_currentComponent", null);
__decorate([
    state()
], CarpenterElement.prototype, "_currentComponentId", null);
CarpenterElement.define('s-carpenter', CarpenterElement);
//# sourceMappingURL=CarpenterElement.js.map
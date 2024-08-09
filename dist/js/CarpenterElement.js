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
import __LitElement from '@lotsof/litElement';
import { Draft2019 } from 'json-schema-library';
import '../components/wysiwygWidget/wysiwygWidget.js';
// @todo    check why is a problem importing this functions
// @ts-ignore
import { __isInIframe } from '@lotsof/sugar/is';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { literal, html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { __deepMap, __get, __set } from '@lotsof/sugar/object';
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
        super({
            name: 's-carpenter',
        });
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
    _validateValues(schema, value) {
        const jsonSchema = new Draft2019(schema), errors = jsonSchema.validate(value);
        return errors;
    }
    _renderComponentValueErrors(errors) {
        return html `
      <ul class=${this.cls('_values-errors')}>
        ${errors.map((error) => html `
            <li class=${this.cls('_values-error')}>
              ${error.message
            .replace('in `#`', '')
            .replace('at `#`', '')
            .trim()}
            </li>
          `)}
      </ul>
    `;
    }
    _renderComponentValueEditWidget(value, path) {
        // get the schema for current path
        var _a, _b;
        // remove the numerical indexes in the path.
        // this is due to the fact that the schema is not
        // aware of the array indexes
        const pathWithoutIndexes = path.filter((p) => isNaN(parseInt(p)));
        // get the schema for the current path
        const schema = this._findInSchema((_a = this._currentComponent) === null || _a === void 0 ? void 0 : _a.schema, pathWithoutIndexes);
        // handle default value
        if (value === null && schema.default !== undefined) {
            __set((_b = this._currentComponent) === null || _b === void 0 ? void 0 : _b.values, path, schema.default);
            value = schema.default;
        }
        // validate the value
        let renderedErrors = '';
        const errors = this._validateValues(schema, value);
        if (errors.length) {
            renderedErrors = this._renderComponentValueErrors(errors);
        }
        if (schema) {
            switch (true) {
                case schema.enum !== undefined:
                    return html `<select
              class=${`${this.cls('_values-select')} form-select`}
              @change=${(e) => {
                        var _a;
                        __set((_a = this._currentComponent) === null || _a === void 0 ? void 0 : _a.values, path, e.target.value);
                        this._applyUpdate({
                            component: this._currentComponent,
                            value: e.target.value,
                            path,
                        });
                    }}
            >
              ${schema.enum.map((v) => {
                        return html `<option value=${v} ?selected=${v === value}>
                  ${v}
                </option>`;
                    })}
            </select>
            ${renderedErrors} `;
                    break;
                case schema.type === 'string':
                    return html `<input
              type="text"
              .value=${value !== null && value !== void 0 ? value : ''}
              class=${this.cls('_values-input')}
              @input=${(e) => {
                        var _a;
                        __set((_a = this._currentComponent) === null || _a === void 0 ? void 0 : _a.values, path, e.target.value);
                    }}
              @change=${(e) => {
                        this._applyUpdate({
                            component: this._currentComponent,
                            value: e.target.value,
                            path,
                        });
                    }}
            />
            ${renderedErrors} `;
                    break;
                case schema.type === 'boolean':
                    return html `<input
            type="checkbox"
            .checked=${value}
            class=${`${this.cls('_values-checkbox')} form-checkbox`}
            @change=${(e) => {
                        var _a;
                        __set((_a = this._currentComponent) === null || _a === void 0 ? void 0 : _a.values, path, e.target.checked);
                        this._applyUpdate({
                            component: this._currentComponent,
                            value: e.target.checked,
                            path,
                        });
                    }}
          />`;
                    break;
                case schema.type === 'number':
                    return html `<input
            type="number"
            .value=${value}
            min=${schema.minimum}
            max=${schema.maximum}
            class=${`${this.cls('_values-input')} form-input form-number`}
            @input=${(e) => {
                        var _a;
                        __set((_a = this._currentComponent) === null || _a === void 0 ? void 0 : _a.values, path, parseFloat(e.target.value));
                    }}
            @change=${(e) => {
                        this._applyUpdate({
                            component: this._currentComponent,
                            value: e.target.value,
                            path,
                        });
                    }}
          />`;
                    break;
            }
        }
        return typeof value === 'number'
            ? html `<span class="-number">${value}</span>`
            : value === true
                ? html `<span class="-true">true</span>`
                : value === false
                    ? html `<span class="-false">false</span>`
                    : value === null
                        ? html `<span class="-null">null</span>`
                        : value === undefined
                            ? html `<span class="-undefined">undefined</span>`
                            : value;
    }
    _applyUpdate(update) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.adapter) {
                this.log(`No adapter defined to handle update of ${update.path.join('.')}...`, update.value);
                return;
            }
            console.log(update);
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
    _createComponentDefaultValuesFromSchema(schema) {
        const newValues = {};
        __deepMap(schema, ({ object, prop, value, path }) => {
            if (object.type !== 'object' && prop === 'type') {
                const finalPath = path
                    .split('.')
                    .filter((p) => p !== 'properties' && p !== 'items' && p !== 'type');
                let newValue = object.default;
                if (newValue === undefined) {
                    switch (true) {
                        case object.enum !== undefined:
                            newValue = object.enum[0];
                            break;
                            break;
                        case value === 'string':
                            newValue = '';
                            break;
                        case value === 'boolean':
                            newValue = false;
                            break;
                        case value === 'number':
                            if (object.minimum !== undefined) {
                                newValue = object.minimum;
                            }
                            else {
                                newValue = 0;
                            }
                            break;
                    }
                }
                __set(newValues, finalPath, newValue);
            }
            return value;
        });
        return newValues;
    }
    _renderComponentValuesPreview(schema, path = []) {
        var _a;
        // get the values for the current path
        const values = __get((_a = this._currentComponent) === null || _a === void 0 ? void 0 : _a.values, path);
        // check if we have a widget specified and that it is available
        if (schema.widget) {
            if (!this._registeredWidgets[schema.widget]) {
                throw new Error(`The widget "${schema.widget}" is not registered in carpenter. Make sure to register it using SCarpenterElement.registerWidget static method...`);
            }
            const tag = literal `${unsafeStatic(this._registeredWidgets[schema.widget].tag)}`;
            return staticHtml `
        <${tag} @s-carpenter.update=${(e) => {
                var _a;
                __set((_a = this._currentComponent) === null || _a === void 0 ? void 0 : _a.values, path, e.detail);
                console.log(this._currentComponent);
                this._applyUpdate({
                    component: this._currentComponent,
                    value: e.detail,
                    path,
                });
            }}></${tag}>
      `;
        }
        switch (true) {
            case schema.type === 'object' && schema.properties !== undefined:
                return html `
          <ul class=${this.cls('_values-object')}>
            ${Object.entries(schema.properties).map(([key, value]) => {
                    var _a;
                    return html `
                <li class=${this.cls('_values-item')}>
                  <div
                    class=${this.cls('_values-prop')}
                    style="--prop-length: ${key.length}"
                  >
                    ${(_a = value.title) !== null && _a !== void 0 ? _a : key}
                  </div>
                  ${this._renderComponentValuesPreview(schema.properties[key], [
                        ...path,
                        key,
                    ])}
                </li>
              `;
                })}
          </ul>
        `;
                break;
            case schema.type === 'array' && schema.items !== undefined:
                return html `
          <ul class=${this.cls('_values-array')}>
            ${(values === null || values === void 0 ? void 0 : values.length) &&
                    values.map((value, i) => html `
                <li class=${this.cls('_values-item')}>
                  <div class=${this.cls('_values-index')}>${i}</div>
                  ${this._renderComponentValuesPreview(schema.items, [
                        ...path,
                        `${i}`,
                    ])}
                </li>
              `)}
            <button
              class=${this.cls('_values-add')}
              @click=${() => {
                    var _a;
                    const newValues = this._createComponentDefaultValuesFromSchema(schema.items);
                    if (!values) {
                        __set((_a = this._currentComponent) === null || _a === void 0 ? void 0 : _a.values, path, [newValues]);
                    }
                    else {
                        values.push(newValues);
                    }
                    this.requestUpdate();
                }}
            >
              Add
            </button>
          </ul>
        `;
                break;
            default:
                return html `
          <div class=${this.cls('_values-value')}>
            ${this._renderComponentValueEditWidget(values, path)}
          </div>
        `;
                break;
        }
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

          <div class=${this.cls('_values')}>
            ${this._renderComponentValuesPreview(this._currentComponent.schema)}
          </div>
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
//# sourceMappingURL=CarpenterElement.js.map
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
import __LitElement from '@lotsof/lit-element';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../src/css/CarpenterDaemonElement.css';
let CarpenterDaemonElement = class CarpenterDaemonElement extends __LitElement {
    constructor() {
        super('s-carpenterd');
        this._domElementsToComponentObjectMap = new WeakMap();
        this._componentObjectToDomElements = new WeakMap();
        this._$actions = null;
    }
    firstUpdated() {
        // get the $actions element
        this._$actions = this.querySelector(`.${this.cls('_actions')}`);
    }
    mount() {
        return __awaiter(this, void 0, void 0, function* () {
            // load the specs from the specs script tags
            this._loadSpecs();
        });
    }
    getComponentDomElement(component) {
        // check from component object directly
        if (component.$component) {
            return component.$component;
        }
        // get the component in the page
        const $component = document.querySelector(`#${component.id}`);
        // make sure the component actually exists in the page
        if (!$component) {
            throw new Error(`The registered component (${component.name})[#${component.id}] does not exists in the page...`);
        }
        // set the $component property to the component object
        component.$component = $component;
        // save the reference to the dom element
        // directly inside the component object
        this._componentObjectToDomElements.set(component, $component);
        // save the component object reference
        // in the _domElementsToComponentObjectMap weak map
        this._domElementsToComponentObjectMap.set($component, component);
        return $component;
    }
    getComponentFromDomElement($elm) {
        if (!this._domElementsToComponentObjectMap.has($elm)) {
            throw new Error(`The logged element above does not has any component attachec to it...`);
        }
        return this._domElementsToComponentObjectMap.get($elm);
    }
    _loadSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            // get all the script tags with the carpenter attribute
            const $specsScripts = document.querySelectorAll('script[carpenter]');
            // init every components found in the page
            for (let $specsScript of $specsScripts !== null && $specsScripts !== void 0 ? $specsScripts : []) {
                this._loadSpecsScript($specsScript);
            }
        });
    }
    _loadSpecsScript($specsScript) {
        return __awaiter(this, void 0, void 0, function* () {
            let component = {};
            this.log(`Getting the specs from the specs script:`, $specsScript);
            // internal page anchor to a script tag
            if (!$specsScript.hasAttribute('src')) {
                this.log(`Getting the specs from a an inline specs script tag...`);
                try {
                    component = JSON.parse($specsScript.innerHTML);
                }
                catch (e) {
                    this.log($specsScript);
                    throw new Error(`Error parsing the inline specs script`);
                }
            }
            else if ($specsScript.hasAttribute('src')) {
                // try parsing the src as json directly
                try {
                    this.log(`Trying to parse the specs script src as json...`);
                    component = JSON.parse($specsScript.src);
                }
                catch (e) {
                    this.log(`Fetching the specs from the src url ${$specsScript.src}...`);
                    // it seems that the src is a url, so let's fetch it
                    const res = yield fetch($specsScript.src);
                    component = yield res.json();
                }
            }
            this.log(`Component specs:`, component);
            // get the $component element inside the page
            const $component = this.getComponentDomElement(component);
            // set the component object to the dom element
            component.$component = $component;
            // emit a new component
            this._emit('carpenter.component', component);
            // add the s-carpenter-component class to the component
            $component.classList.add('s-carpenter-component');
            // init the component edition behaviors
            this._initComponentListeners(component);
        });
    }
    _setActionsSizeAndPosition(component) {
        if (!this._$actions) {
            return;
        }
        const bound = component.$component.getBoundingClientRect();
        this._$actions.style.top = `${bound.top}px`;
        this._$actions.style.left = `${bound.left}px`;
        this._$actions.style.width = `${bound.width}px`;
        this._$actions.style.height = `${bound.height}px`;
    }
    _initComponentListeners(component) {
        // hover behavior
        component.$component.addEventListener('pointerenter', (e) => {
            // add the "-carpenter-hover" class to the component
            component.$component.classList.add('-hover');
            // set the "$actions" element to the position
            this._setActionsSizeAndPosition(component);
            // emit the mouse enter event
            this._emit('s-carpenter.mousenter', component);
            // this._bindActionsToComponent(this.getComponentFromDomElement(component.$component));
        });
        component.$component.addEventListener('pointerleave', (e) => {
            // remove the "-carpenter-hover" class to the component
            component.$component.classList.remove('-hover');
            // emit the mouse leave event
            this._emit('s-carpenter.mouseleave', component);
        });
        component.$component.addEventListener('click', (e) => {
            this._emit('carpenter.edit', component);
        });
    }
    _emit(name, value) {
        const event = new CustomEvent(name, {
            bubbles: true,
            detail: value,
        });
        this.dispatchEvent(event);
    }
    render() {
        return html ` <div class="${this.cls('_actions')}"></div>`;
    }
};
CarpenterDaemonElement = __decorate([
    customElement('s-carpenterd')
], CarpenterDaemonElement);
export default CarpenterDaemonElement;
//# sourceMappingURL=CarpenterDeamonElement.js.map
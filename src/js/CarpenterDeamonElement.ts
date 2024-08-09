import __LitElement from '@lotsof/litElement';

import { html } from 'lit';

import { customElement } from 'lit/decorators.js';
import '../../src/css/CarpenterDaemonElement.css';
import {
  ICarpenterComponent,
  ICarpenterCustomEvent,
} from '../shared/Carpenter.types.js';

@customElement('s-carpenterd')
export default class CarpenterDaemonElement extends __LitElement {
  private _domElementsToComponentObjectMap: WeakMap<
    Element,
    ICarpenterComponent
  > = new WeakMap();

  private _componentObjectToDomElements: WeakMap<ICarpenterComponent, Element> =
    new WeakMap();

  private _$actions: HTMLElement | null = null;

  constructor() {
    super({
      name: 's-carpenterd',
    });
  }

  private firstUpdated() {
    // get the $actions element
    this._$actions = this.querySelector(`.${this.cls('_actions')}`);
  }

  async mount() {
    // load the specs from the specs script tags
    this._loadSpecs();
  }

  public getComponentDomElement(component: ICarpenterComponent): Element {
    // check from component object directly
    if (component.$component) {
      return component.$component;
    }

    // get the component in the page
    const $component = document.querySelector(`#${component.id}`);

    // make sure the component actually exists in the page
    if (!$component) {
      throw new Error(
        `The registered component (${component.name})[#${component.id}] does not exists in the page...`,
      );
    }

    // set the $component property to the component object
    component.$component = $component;

    // save the reference to the dom element
    // directly inside the component object
    this._componentObjectToDomElements.set(component, $component as Element);

    // save the component object reference
    // in the _domElementsToComponentObjectMap weak map
    this._domElementsToComponentObjectMap.set($component as Element, component);

    return $component;
  }

  public getComponentFromDomElement($elm: Element): ICarpenterComponent {
    if (!this._domElementsToComponentObjectMap.has($elm)) {
      throw new Error(
        `The logged element above does not has any component attachec to it...`,
      );
    }

    return this._domElementsToComponentObjectMap.get(
      $elm,
    ) as ICarpenterComponent;
  }

  private async _loadSpecs() {
    // get all the script tags with the carpenter attribute
    const $specsScripts = document.querySelectorAll('script[carpenter]');

    // init every components found in the page
    for (let $specsScript of $specsScripts ?? []) {
      this._loadSpecsScript($specsScript as HTMLScriptElement);
    }
  }

  private async _loadSpecsScript(
    $specsScript: HTMLScriptElement,
  ): Promise<any> {
    let component: Partial<ICarpenterComponent> = {};

    this.log(`Getting the specs from the specs script:`, $specsScript);

    // internal page anchor to a script tag
    if (!$specsScript.hasAttribute('src')) {
      this.log(`Getting the specs from a an inline specs script tag...`);

      try {
        component = JSON.parse($specsScript.innerHTML);
      } catch (e) {
        this.log($specsScript);
        throw new Error(`Error parsing the inline specs script`);
      }
    } else if ($specsScript.hasAttribute('src')) {
      // try parsing the src as json directly
      try {
        this.log(`Trying to parse the specs script src as json...`);
        component = JSON.parse($specsScript.src as string);
      } catch (e) {
        this.log(`Fetching the specs from the src url ${$specsScript.src}...`);

        // it seems that the src is a url, so let's fetch it
        const res = await fetch($specsScript.src);
        component = await res.json();
      }
    }

    this.log(`Component specs:`, component);

    // get the $component element inside the page
    const $component = this.getComponentDomElement(
      component as ICarpenterComponent,
    );

    // set the component object to the dom element
    component.$component = $component;

    // emit a new component
    this._emit('carpenter.component', component as ICarpenterComponent);

    // add the s-carpenter-component class to the component
    $component.classList.add('s-carpenter-component');

    // init the component edition behaviors
    this._initComponentListeners(component as ICarpenterComponent);
  }

  private _setActionsSizeAndPosition(component: ICarpenterComponent): void {
    if (!this._$actions) {
      return;
    }
    const bound = component.$component.getBoundingClientRect();
    this._$actions.style.top = `${bound.top}px`;
    this._$actions.style.left = `${bound.left}px`;
    this._$actions.style.width = `${bound.width}px`;
    this._$actions.style.height = `${bound.height}px`;
  }

  private _initComponentListeners(component: ICarpenterComponent): void {
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

  protected _emit(name: string, value: ICarpenterComponent): void {
    const event: ICarpenterCustomEvent = new CustomEvent(name, {
      bubbles: true,
      detail: value,
    });
    this.dispatchEvent(event);
  }

  protected render(): any {
    return html` <div class="${this.cls('_actions')}"></div>`;
  }
}

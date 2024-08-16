import __LitElement from '@lotsof/lit-element';

import '@lotsof/json-schema-form';

// @todo    check why is a problem importing this functions
// @ts-ignore
import { __isInIframe } from '@lotsof/sugar/is';

import __CarpenterFetchAdapter from '../components/fetchAdapter/fetchAdapter.js';

import { html } from 'lit';
import { property, state } from 'lit/decorators.js';

import '../../src/css/CarpenterElement.css';
import {
  TCarpenterComponent,
  TCarpenterSpecs,
  TCarpenterUpdateObject,
  TCarpenterWidget,
} from '../shared/Carpenter.types.js';

export default class CarpenterElement extends __LitElement {
  public static widgets: Record<string, TCarpenterWidget> = {};
  public static registerWidget(widget: TCarpenterWidget): void {
    this.widgets[widget.id] = widget;
  }

  @property({ type: String })
  accessor src: string = '';

  @property()
  accessor adapter: __CarpenterFetchAdapter | null = null;

  @property({ type: Object })
  accessor widgets: Record<string, TCarpenterWidget> = {};

  @state()
  accessor _currentComponent: TCarpenterComponent | null = null;

  @state()
  accessor _currentComponentId: string = '';

  private _registeredWidgets: Record<string, TCarpenterWidget> = {};
  private _specs: TCarpenterSpecs = {
    components: {},
  };

  private _$iframe?: HTMLIFrameElement;

  constructor() {
    super('s-carpenter');
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
  public get isDaemon(): boolean {
    return __isInIframe();
  }

  public get $iframeDocument(): Document | null | undefined {
    return this._$iframe?.contentDocument;
  }

  async mount() {
    // handle the widgets
    this._registeredWidgets = {
      wysiwyg: {
        id: 'wysiwyg',
        tag: 's-carpenter-wysiwyg-widget',
      },
      ...this.widgets,
      ...CarpenterElement.widgets,
    };

    // if not in an iframe, init the environment
    // by creating an iframe and load the carpenter deamon
    // inside it
    if (this.isDaemon) {
      return;
    }

    // load the environment by
    // creating the iframe etc...
    await this._initEnvironment();

    // init the listeners like escape key, etc...
    this._initListeners(document);
    this._initListeners(this.$iframeDocument as Document);
  }

  private _initListeners(context: Document): void {
    // escape key
    context.addEventListener('keyup', (e) => {
      switch (true) {
        case e.key === 'Escape':
          this._currentComponent = null;
          break;
      }
    });
  }

  public registerComponent(component: TCarpenterComponent): void {
    this.log(`Registering the component (${component.name})[#${component.id}]`);
    this._specs.components[component.id] = component;
  }

  private _initEnvironment(): void {
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
    $iframe?.contentWindow?.document.open();
    $iframe?.contentWindow?.document.write(document.documentElement.outerHTML);
    $iframe?.contentWindow?.document.close();

    this.$iframeDocument?.querySelector(`.${this.cls('_iframe')}`)?.remove();
    this.$iframeDocument?.querySelector(this.tagName)?.remove();

    // empty page
    document
      .querySelectorAll(`body > *:not(${this.tagName}):not(script):not(iframe)`)
      .forEach(($el) => {
        $el.remove();
      });

    // inject the carpenter deamon
    this._injectCarpenterDeamon();
  }

  private _injectCarpenterDeamon(): void {
    const $deamon = this._$iframe?.contentDocument?.createElement(
      's-carpenterd',
    ) as HTMLElement;
    $deamon.setAttribute('id', 's-carpenterd');
    $deamon.setAttribute('verbose', 'true');

    $deamon.addEventListener('carpenter.component', (e) => {
      this.registerComponent((<CustomEvent>e).detail as TCarpenterComponent);
    });
    $deamon.addEventListener('carpenter.edit', (e) => {
      this._currentComponent = (<CustomEvent>e).detail;
      this.requestUpdate();
    });

    this._$iframe?.contentDocument?.body.appendChild($deamon);
  }

  private _findInSchema(schema: any, path: string[]): any {
    const foundSchema = path.reduce((acc, key) => {
      if (acc?.properties?.[key]) {
        return acc.properties[key];
      }
      if (acc?.items?.properties?.[key]) {
        return acc.items.properties[key];
      }
      if (acc?.[key] !== undefined) {
        return acc[key];
      }
      return null;
    }, schema);

    return foundSchema;
  }

  private async _applyUpdate(update: TCarpenterUpdateObject): Promise<void> {
    if (!this.adapter) {
      this.log(
        `No adapter defined to handle update of ${update.path.join('.')}...`,
        update.value,
      );
      return;
    }

    // make the update throug the specified adapter
    const response = await this.adapter.applyUpdate(update);

    // if the component has been totally updated
    // we need to refresh his reference
    if (!update.component.$component.parentElement) {
      update.component.$component = this.$iframeDocument?.querySelector(
        `#${update.component.id}`,
      ) as HTMLElement;
    }

    // update the component
    this.requestUpdate();
  }

  public render() {
    if (this._currentComponent) {
      return html`
        <div class=${this.cls('_component')}>
          <header class=${this.cls('_header')}>
            <h2 class=${this.cls('_header-title')}>
              ${this._currentComponent.name}
            </h2>
            ${this._currentComponent.description
              ? html`
                  <p class=${this.cls('_header-description')}>
                    ${this._currentComponent.description}
                  </p>
                `
              : ''}
          </header>

          <s-json-schema-form
            @sJsonSchemaForm.update=${(e: CustomEvent) => {
              console.log('UP', e);

              this._applyUpdate({
                ...e.detail.update,
                component: this._currentComponent,
              });
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

CarpenterElement.define('s-carpenter', CarpenterElement);

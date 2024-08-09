import __LitElement from '@lotsof/litElement';

import { Draft, Draft2019, JsonError } from 'json-schema-library';

import '../components/wysiwygWidget/wysiwygWidget.js';

// @todo    check why is a problem importing this functions
// @ts-ignore
import { __isInIframe } from '@lotsof/sugar/is';

import __CarpenterFetchAdapter from '../components/fetchAdapter/fetchAdapter.js';

import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { literal, html as staticHtml, unsafeStatic } from 'lit/static-html.js';

import { __deepMap, __get, __set } from '@lotsof/sugar/object';

import '../../src/css/CarpenterElement.css';
import {
  ICarpenterComponent,
  ICarpenterSpecs,
  ICarpenterUpdateObject,
  ICarpenterWidget,
} from '../shared/Carpenter.types.js';

export default class CarpenterElement extends __LitElement {
  public static widgets: Record<string, ICarpenterWidget> = {};
  public static registerWidget(widget: ICarpenterWidget): void {
    this.widgets[widget.id] = widget;
  }

  @property({ type: String })
  accessor src: string = '';

  @property()
  accessor adapter: __CarpenterFetchAdapter | null = null;

  @property({ type: Object })
  accessor widgets: Record<string, ICarpenterWidget> = {};

  @state()
  accessor _currentComponent: ICarpenterComponent | null = null;

  @state()
  accessor _currentComponentId: string = '';

  private _registeredWidgets: Record<string, ICarpenterWidget> = {};
  private _specs: ICarpenterSpecs = {
    components: {},
  };

  private _$iframe?: HTMLIFrameElement;

  constructor() {
    super({
      name: 's-carpenter',
    });
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

  public registerComponent(component: ICarpenterComponent): void {
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
      this.registerComponent((<CustomEvent>e).detail as ICarpenterComponent);
    });
    $deamon.addEventListener('carpenter.edit', (e) => {
      this._currentComponent = (<CustomEvent>e).detail;
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

  private _validateValues(schema: any, value: any): JsonError[] {
    const jsonSchema: Draft = new Draft2019(schema),
      errors: JsonError[] = jsonSchema.validate(value);
    return errors;
  }

  private _renderComponentValueErrors(errors: JsonError[]): any {
    return html`
      <ul class=${this.cls('_values-errors')}>
        ${errors.map(
          (error) => html`
            <li class=${this.cls('_values-error')}>
              ${error.message
                .replace('in `#`', '')
                .replace('at `#`', '')
                .trim()}
            </li>
          `,
        )}
      </ul>
    `;
  }

  private _renderComponentValueEditWidget(value: any, path: string[]): any {
    // get the schema for current path

    // remove the numerical indexes in the path.
    // this is due to the fact that the schema is not
    // aware of the array indexes
    const pathWithoutIndexes = path.filter((p) => isNaN(parseInt(p)));

    // get the schema for the current path
    const schema = this._findInSchema(
      this._currentComponent?.schema,
      pathWithoutIndexes,
    );

    // handle default value
    if (value === null && schema.default !== undefined) {
      __set(this._currentComponent?.values, path, schema.default);
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
          return html`<select
              class=${`${this.cls('_values-select')} form-select`}
              @change=${(e) => {
                __set(this._currentComponent?.values, path, e.target.value);
                this._applyUpdate({
                  component: this._currentComponent as ICarpenterComponent,
                  value: e.target.value,
                  path,
                });
              }}
            >
              ${schema.enum.map((v) => {
                return html`<option value=${v} ?selected=${v === value}>
                  ${v}
                </option>`;
              })}
            </select>
            ${renderedErrors} `;
          break;
        case schema.type === 'string':
          return html`<input
              type="text"
              .value=${value ?? ''}
              class=${this.cls('_values-input')}
              @input=${(e: any) => {
                __set(this._currentComponent?.values, path, e.target.value);
              }}
              @change=${(e) => {
                this._applyUpdate({
                  component: this._currentComponent as ICarpenterComponent,
                  value: e.target.value,
                  path,
                });
              }}
            />
            ${renderedErrors} `;
          break;
        case schema.type === 'boolean':
          return html`<input
            type="checkbox"
            .checked=${value}
            class=${`${this.cls('_values-checkbox')} form-checkbox`}
            @change=${(e) => {
              __set(this._currentComponent?.values, path, e.target.checked);
              this._applyUpdate({
                component: this._currentComponent as ICarpenterComponent,
                value: e.target.checked,
                path,
              });
            }}
          />`;
          break;
        case schema.type === 'number':
          return html`<input
            type="number"
            .value=${value}
            min=${schema.minimum}
            max=${schema.maximum}
            class=${`${this.cls('_values-input')} form-input form-number`}
            @input=${(e: any) => {
              __set(
                this._currentComponent?.values,
                path,
                parseFloat(e.target.value),
              );
            }}
            @change=${(e) => {
              this._applyUpdate({
                component: this._currentComponent as ICarpenterComponent,
                value: e.target.value,
                path,
              });
            }}
          />`;
          break;
      }
    }

    return typeof value === 'number'
      ? html`<span class="-number">${value}</span>`
      : value === true
      ? html`<span class="-true">true</span>`
      : value === false
      ? html`<span class="-false">false</span>`
      : value === null
      ? html`<span class="-null">null</span>`
      : value === undefined
      ? html`<span class="-undefined">undefined</span>`
      : value;
  }

  private async _applyUpdate(update: ICarpenterUpdateObject): Promise<void> {
    if (!this.adapter) {
      this.log(
        `No adapter defined to handle update of ${update.path.join('.')}...`,
        update.value,
      );
      return;
    }

    console.log(update);

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

  private _createComponentDefaultValuesFromSchema(schema: any): any {
    const newValues: any = {};

    __deepMap(schema, ({ object, prop, value, path }) => {
      if (object.type !== 'object' && prop === 'type') {
        const finalPath = path
          .split('.')
          .filter((p) => p !== 'properties' && p !== 'items' && p !== 'type');
        let newValue: any = object.default;

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
              } else {
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

  private _renderComponentValuesPreview(schema: any, path: string[] = []): any {
    // get the values for the current path
    const values = __get(this._currentComponent?.values, path);

    // check if we have a widget specified and that it is available
    if (schema.widget) {
      if (!this._registeredWidgets[schema.widget]) {
        throw new Error(
          `The widget "${schema.widget}" is not registered in carpenter. Make sure to register it using SCarpenterElement.registerWidget static method...`,
        );
      }
      const tag = literal`${unsafeStatic(
        this._registeredWidgets[schema.widget].tag,
      )}`;
      return staticHtml`
        <${tag} @s-carpenter.update=${(e) => {
        __set(this._currentComponent?.values, path, e.detail);
        console.log(this._currentComponent);
        this._applyUpdate({
          component: this._currentComponent as ICarpenterComponent,
          value: e.detail,
          path,
        });
      }}></${tag}>
      `;
    }

    switch (true) {
      case schema.type === 'object' && schema.properties !== undefined:
        return html`
          <ul class=${this.cls('_values-object')}>
            ${Object.entries(schema.properties).map(
              ([key, value]) => html`
                <li class=${this.cls('_values-item')}>
                  <div
                    class=${this.cls('_values-prop')}
                    style="--prop-length: ${key.length}"
                  >
                    ${(<any>value).title ?? key}
                  </div>
                  ${this._renderComponentValuesPreview(schema.properties[key], [
                    ...path,
                    key,
                  ])}
                </li>
              `,
            )}
          </ul>
        `;
        break;
      case schema.type === 'array' && schema.items !== undefined:
        return html`
          <ul class=${this.cls('_values-array')}>
            ${values?.length &&
            values.map(
              (value, i) => html`
                <li class=${this.cls('_values-item')}>
                  <div class=${this.cls('_values-index')}>${i}</div>
                  ${this._renderComponentValuesPreview(schema.items, [
                    ...path,
                    `${i}`,
                  ])}
                </li>
              `,
            )}
            <button
              class=${this.cls('_values-add')}
              @click=${() => {
                const newValues = this._createComponentDefaultValuesFromSchema(
                  schema.items,
                );
                if (!values) {
                  __set(this._currentComponent?.values, path, [newValues]);
                } else {
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
        return html`
          <div class=${this.cls('_values-value')}>
            ${this._renderComponentValueEditWidget(values, path)}
          </div>
        `;
        break;
    }
  }

  protected render() {
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

          <div class=${this.cls('_values')}>
            ${this._renderComponentValuesPreview(this._currentComponent.schema)}
          </div>
        </div>
      `;
    }
  }
}

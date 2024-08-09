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
import __LitElement from '@lotsof/litElement';
import __EditorJS from '@editorjs/editorjs';
import __Header from '@editorjs/header';
import __List from '@editorjs/list';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
let CarpenterWysiwygWidget = class CarpenterWysiwygWidget extends __LitElement {
    constructor() {
        super({
            name: 's-carpenter-wysiwyg-widget',
        });
    }
    mount() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    firstUpdated(_changedProperties) {
        // init editor js
        this._editor = new __EditorJS({
            placeholder: 'Let`s write an awesome story!',
            holder: 's-carpenter-wysiwyg-widget-editor-js',
            tools: {
                header: __Header,
                list: {
                    class: __List,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered',
                    },
                },
            },
        });
    }
    //   @pointerup=${() => {
    //     this.dispatchEvent(
    //       new CustomEvent('s-carpenter.update', {
    //         bubbles: true,
    //         detail: 'hello',
    //       }),
    //     );
    //   }}
    render() {
        return html ` <div id="s-carpenter-wysiwyg-widget-editor-js"></div>`;
    }
};
CarpenterWysiwygWidget = __decorate([
    customElement('s-carpenter-wysiwyg-widget')
], CarpenterWysiwygWidget);
export default CarpenterWysiwygWidget;
//# sourceMappingURL=CarpenterWysiwygWidget.js.map
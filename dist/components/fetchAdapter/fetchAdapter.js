var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @todo    check why this import des not work correctly
// @ts-ignore
import { __clearSelection } from '@lotsof/sugar/dom';
export default class CarpenterFetchAdapter {
    constructor(settings) {
        this.settings = Object.assign({ url: document.location.href }, (settings !== null && settings !== void 0 ? settings : {}));
    }
    applyUpdate(update) {
        return __awaiter(this, void 0, void 0, function* () {
            // protect the component from being updated
            // if not in the page
            if (!update.component.$component) {
                throw new Error(`The component with id ${update.component.id} does not exists in the page...`);
            }
            const response = yield fetch(this.settings.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(update),
            }), json = yield response.json();
            // replace in the html
            update.component.$component.outerHTML = json.html;
            setTimeout(() => {
                console.log('clear');
                __clearSelection();
            }, 1000);
            return Object.assign(Object.assign({}, update), json);
        });
    }
}
//# sourceMappingURL=fetchAdapter.js.map
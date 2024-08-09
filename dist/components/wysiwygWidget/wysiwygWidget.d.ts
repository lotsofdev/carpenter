import __LitElement from '@lotsof/litElement';
import { PropertyValues } from 'lit';
import '../../../src/components/wysiwygWidget/wysiwygWidget.css';
export default class CarpenterWysiwygWidget extends __LitElement {
    private _editor;
    constructor();
    mount(): Promise<void>;
    firstUpdated(_changedProperties: PropertyValues): void;
    protected render(): any;
}

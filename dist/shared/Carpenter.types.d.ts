import { JSONSchema7 } from 'json-schema';
import type { TJsonSchemaFormUpdateObject, TJsonSchemaFormWidget } from '@lotsof/json-schema-form';
import __CarpenterFetchAdapter from '../components/fetchAdapter/fetchAdapter.js';
export type TCarpenterSettings = {
    adapter: typeof __CarpenterFetchAdapter;
};
export type TCarpenterSpecs = {
    components: Record<string, TCarpenterComponent>;
};
export type TCarpenterComponent = {
    id: string;
    name: string;
    description?: string;
    schema: JSONSchema7;
    values: any;
    $component: Element;
};
export type TCarpenterUpdateObject = TJsonSchemaFormUpdateObject & {
    component: TCarpenterComponent;
};
export type TCarpenterUpdateResult = {
    component: TCarpenterComponent;
    path: string[];
    value: any;
    html?: string;
};
export type TCarpenterCustomEvent = CustomEvent & {
    detail: TCarpenterComponent;
};
export type TCarpenterAdapter = {
    applyUpdate(TCarpenterUpdateObject: any): void;
};
export type TCarpenterWidget = TJsonSchemaFormWidget & {};

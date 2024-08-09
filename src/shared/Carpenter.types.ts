import { JSONSchema7 } from 'json-schema';

import {
  IJsonSchemaFormUpdateObject,
  IJsonSchemaFormWidget,
} from '@lotsof/json-schema-form/src/shared/JsonSchemaForm.types.js';
import __CarpenterFetchAdapter from '../components/fetchAdapter/fetchAdapter.js';

export interface ICarpenterSettings {
  adapter: typeof __CarpenterFetchAdapter;
}

export interface ICarpenterSpecs {
  components: Record<string, ICarpenterComponent>;
}

export interface ICarpenterComponent {
  id: string;
  name: string;
  description?: string;
  schema: JSONSchema7;
  values: any;
  $component: Element;
}

export interface ICarpenterUpdateObject extends IJsonSchemaFormUpdateObject {
  component: ICarpenterComponent;
}

export interface ICarpenterUpdateResult {
  component: ICarpenterComponent;
  path: string[];
  value: any;
  html?: string;
}

export interface ICarpenterCustomEvent extends CustomEvent {
  detail: ICarpenterComponent;
}

export interface ICarpenterAdapter {
  applyUpdate(ICarpenterUpdateObject): void;
}

export interface ICarpenterWidget extends IJsonSchemaFormWidget {}

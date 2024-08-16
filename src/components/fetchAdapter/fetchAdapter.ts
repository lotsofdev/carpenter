import type {
  TCarpenterAdapter,
  TCarpenterUpdateObject,
  TCarpenterUpdateResult,
} from '../../shared/Carpenter.types.js';

// @todo    check why this import des not work correctly
// @ts-ignore
import { __clearSelection } from '@lotsof/sugar/dom';

export interface ICarpenterFetchAdapterSettings {
  url: string;
}

export default class CarpenterFetchAdapter implements TCarpenterAdapter {
  settings: ICarpenterFetchAdapterSettings;

  constructor(settings?: Partial<ICarpenterFetchAdapterSettings>) {
    this.settings = {
      url: document.location.href,
      ...(settings ?? {}),
    };
  }

  public async applyUpdate(
    update: TCarpenterUpdateObject,
  ): Promise<TCarpenterUpdateResult> {
    // protect the component from being updated
    // if not in the page
    if (!update.component.$component) {
      throw new Error(
        `The component with id ${update.component.id} does not exists in the page...`,
      );
    }

    const response = await fetch(this.settings.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      }),
      json = await response.json();

    // replace in the html
    update.component.$component.outerHTML = json.html;

    setTimeout(() => {
      console.log('clear');
      __clearSelection();
    }, 1000);

    return {
      ...update,
      ...json,
    };
  }
}

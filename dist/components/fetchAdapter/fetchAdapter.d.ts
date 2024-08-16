import type { TCarpenterAdapter, TCarpenterUpdateObject, TCarpenterUpdateResult } from '../../shared/Carpenter.types.js';
export interface ICarpenterFetchAdapterSettings {
    url: string;
}
export default class CarpenterFetchAdapter implements TCarpenterAdapter {
    settings: ICarpenterFetchAdapterSettings;
    constructor(settings?: Partial<ICarpenterFetchAdapterSettings>);
    applyUpdate(update: TCarpenterUpdateObject): Promise<TCarpenterUpdateResult>;
}

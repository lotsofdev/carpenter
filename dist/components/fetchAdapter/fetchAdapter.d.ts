import type { ICarpenterAdapter, ICarpenterUpdateObject, ICarpenterUpdateResult } from '../../shared/Carpenter.types.js';
export interface ICarpenterFetchAdapterSettings {
    url: string;
}
export default class CarpenterFetchAdapter implements ICarpenterAdapter {
    settings: ICarpenterFetchAdapterSettings;
    constructor(settings?: Partial<ICarpenterFetchAdapterSettings>);
    applyUpdate(update: ICarpenterUpdateObject): Promise<ICarpenterUpdateResult>;
}

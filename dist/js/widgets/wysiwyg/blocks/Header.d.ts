import __Header from '@editorjs/header';
export default class Header extends __Header {
    constructor({ data, config, api, readOnly }: {
        data: any;
        config: any;
        api: any;
        readOnly: any;
    });
    /**
     * Get tag for target level
     * By default returns second-leveled header
     *
     * @returns {HTMLElement}
     */
    getTag(): any;
}

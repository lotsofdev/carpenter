import __Header from '@editorjs/header';
export default class Header extends __Header {
    constructor({ data, config, api, readOnly }) {
        super({ data, config, api, readOnly });
        this._element = this.getTag();
    }
    /**
     * Get tag for target level
     * By default returns second-leveled header
     *
     * @returns {HTMLElement}
     */
    getTag() {
        const tag = super.getTag();
        let headerClass = 'typo-h' + this.currentLevel.number;
        tag.classList.add(headerClass);
        return tag;
    }
}
//# sourceMappingURL=Header.js.map
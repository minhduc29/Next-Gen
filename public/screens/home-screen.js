import { css } from '../js/utils.js'

class HomeScreen extends HTMLElement {
    constructor() {
        super()
        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.innerHTML = `
        ${css}`
    }
}

window.customElements.define("home-screen", HomeScreen)
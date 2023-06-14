import { css, notice, closeModal } from '../js/utils.js'
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"

class LoginForm extends HTMLElement {
    constructor() {
        super()
        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.innerHTML = `
        ${css}
        <h4 class="center text-4b88a2">Login</h4>
        <div class="row">
            <form id="login" class="col s12">
                <div class="row">
                    <div class="input-field col s12">
                        <input id="email" type="email" class="validate text-4b88a2" placeholder="Email">
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="password" type="password" class="validate text-4b88a2" placeholder="Password">
                    </div>
                </div>
                <button class="btn">Login</button>
            </form>
            <button class="btn" id="forgot-pw">Forgot password?</button>
        </div>`

        // Initialize
        const auth = getAuth()

        // Login
        const loginForm = this._shadowRoot.querySelector('#login')
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault()

            // Get user info
            const email = this._shadowRoot.querySelector('#email').value
            const password = this._shadowRoot.querySelector('#password').value

            // Login user
            signInWithEmailAndPassword(auth, email, password).then(user => {
                notice(`User ${user.user.displayName} successfully logged in`)
                // Reset form
                closeModal('#login-modal')
                loginForm.reset()
            }).catch(err => {
                // Catch error
                notice(err.message)
            })
        })

        // Forgot password
        const forgotPw = this._shadowRoot.querySelector('#forgot-pw')
        forgotPw.addEventListener('click', (e) => {
            e.preventDefault()
            // forgotPassword function
        })
    }
}

window.customElements.define('login-form', LoginForm)
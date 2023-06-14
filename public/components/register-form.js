import { css, notice, closeModal } from '../js/utils.js'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"
import { getFirestore, collection, query, where, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js"

class RegisterForm extends HTMLElement {
    constructor() {
        super()
        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.innerHTML = `
        ${css}
        <h4 class="center text-4b88a2">Register</h4>
        <div class="row">
            <form id="register" class="col s12">
                <div class="row">
                    <div class="input-field col s12">
                        <input id="username" type="text" class="validate text-4b88a2" placeholder="Username">
                    </div>
                </div>
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
                <div class="row">
                    <div class="input-field col s12">
                        <input id="pwconfirmation" type="password" class="validate text-4b88a2" placeholder="Password Confirmation">
                    </div>
                </div>
                <button class="btn">Register</button>
            </form>
        </div>`

        // Initialize
        const auth = getAuth()
        const db = getFirestore()

        // Register
        const registerForm = this._shadowRoot.querySelector('#register')
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault()

            // Get user info
            const username = this._shadowRoot.querySelector('#username').value
            const email = this._shadowRoot.querySelector('#email').value
            const password = this._shadowRoot.querySelector('#password').value
            const pwcf = this._shadowRoot.querySelector('#pwconfirmation').value

            // Register user
            if (username.trim() === '') {
                notice('Missing username')
            } else if (username.trim().length < 6) {
                notice('Username must be at least 6 characters')
            } else if (password !== pwcf) {
                notice('Password and password confirmation must be the same')
            } else if (password === pwcf) {
                let exist = false
                const q = query(collection(db, 'users'), where('username', '==', username.trim()))
                getDocs(q).then(d => {
                    d.forEach(data => {
                        if (data.exists) {
                            exist = true
                        }
                    })
                    if (!exist) {
                        createUserWithEmailAndPassword(auth, email, password).then(cred => {
                            // Create data firestore
                            const initialData = {
                                username: username,
                                email: email,
                                photoURL: 'https://firebasestorage.googleapis.com/v0/b/next-gen-2cea7.appspot.com/o/users%2Fprofile_picture.png?alt=media&token=99a74c57-f47f-4931-bf41-6a59c38b7424&_gl=1*aq435s*_ga*OTA4MzE2ODUwLjE2ODYxMDY1Mzk.*_ga_CW55HF8NVT*MTY4NjMxMjgzMy42LjEuMTY4NjMxNDYyNy4wLjAuMA..'
                            }
                            const docRef = doc(db, 'users', cred.user.uid)
                            setDoc(docRef, initialData, { merge: false })
                            notice(`User ${username} successfully registered`)
                            updateProfile(auth.currentUser, {
                                displayName: username,
                                photoURL: 'https://firebasestorage.googleapis.com/v0/b/next-gen-2cea7.appspot.com/o/users%2Fprofile_picture.png?alt=media&token=99a74c57-f47f-4931-bf41-6a59c38b7424&_gl=1*aq435s*_ga*OTA4MzE2ODUwLjE2ODYxMDY1Mzk.*_ga_CW55HF8NVT*MTY4NjMxMjgzMy42LjEuMTY4NjMxNDYyNy4wLjAuMA..'
                            })
                        }).then(() => {
                            // Reset form
                            closeModal('#register-modal')
                            registerForm.reset()
                        }).catch(err => {
                            // Catch error
                            notice(err.message)
                        })
                    } else {
                        notice("This username has already been taken")
                    }
                })
            }
        })
    }
}

window.customElements.define("register-form", RegisterForm)
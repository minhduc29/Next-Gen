import { css, notice } from '../js/utils.js'
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js"


class ProfileItem extends HTMLElement {
    constructor() {
        super()
        this._shadowRoot = this.attachShadow({ mode: 'open' })
        this._shadowRoot.innerHTML = `
        ${css}
        <img id="profile-pic" src="" alt="Profile Picture" class="responsive-img">
        <h2 class="center text-4b88a2">Profile</h2>
        <div id="profile"></div><br>
        <button class="btn" id="change-pw">Change password</button>
        <button class="btn" id="change-name">Change username</button>
        <input type="file" id="change-pp">`

        // Initialize
        const auth = getAuth()
        const db = getFirestore()

        // Change profile picture
        const changePp = this._shadowRoot.querySelector("#change-pp")
        changePp.addEventListener('change', (e) => {
            e.preventDefault()
            // changeProfilePic(e) function
            changePp.value = ''
        })

        // Change password
        const changePw = this._shadowRoot.querySelector("#change-pw")
        changePw.addEventListener('click', (e) => {
            e.preventDefault()
            const email = prompt('Enter your email: ')
            const password = prompt('Enter your password: ')
            const credential = EmailAuthProvider.credential(email, password)
            reauthenticateWithCredential(auth.currentUser, credential).then(() => {
                let newPw = prompt('Enter your new password: ')
                let newPwCf = prompt('Confirm your new password: ')
                if (newPw == newPwCf && newPw.trim() !== "") {
                    updatePassword(auth.currentUser, newPw).then(() => {
                        notice('Password has been changed')
                    }).catch(err => {
                        notice(err.message)
                    })
                } else {
                    notice('Wrong new password confirmation or invalid password')
                }
            }).catch(err => {
                notice(err.message)
            })
        })

        // Change username
        const changeName = this._shadowRoot.querySelector("#change-name")
        changeName.addEventListener('click', (e) => {
            e.preventDefault()
            // changeUsername() function
        })

        // Check and change data for current user
        onAuthStateChanged(auth, user => {
            if (user) {
                const html = `
                <br><h5 class="text-2f3162">Email: ${user.email}</h5>
                <br><h5 class="text-2f3162">Username: ${user.displayName}</h5>`
                this._shadowRoot.querySelector("#profile").innerHTML = html
                this._shadowRoot.querySelector("#profile-pic").src = user.photoURL

                // Realtime update photoURL
                const docRef = doc(db, 'users', user.uid)
                onSnapshot(docRef, snapshot => {
                    this._shadowRoot.querySelector("#profile-pic").src = snapshot.data().photoURL
                    this._shadowRoot.querySelector("#profile").innerHTML = `
                    <br><h5 class="text-2f3162">Email: ${snapshot.data().email}</h5>
                    <br><h5 class="text-2f3162">Username: ${snapshot.data().username}</h5>`
                })
            }
        })
    }
}

window.customElements.define('profile-item', ProfileItem)
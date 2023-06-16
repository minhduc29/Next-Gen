import { css, notice, closeModal } from '../js/utils.js'
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"
import { getFirestore, doc, onSnapshot, getDocs, setDoc, query, collection, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js"

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
        const storage = getStorage()

        // Change profile picture
        const changePp = this._shadowRoot.querySelector("#change-pp")
        changePp.addEventListener('change', (e) => {
            e.preventDefault()

            let file = e.target.files[0]
            if (file) {
                if (file.type.startsWith("image")) {
                    $('body').removeClass('loaded')
                    closeModal("#profile-modal")

                    let fileRef = ref(storage, `users/${auth.currentUser.uid}.jpg`)
                    uploadBytes(fileRef, file).then(() => {
                        getDownloadURL(fileRef).then(url => {
                            updateProfile(auth.currentUser, { photoURL: url })
                            const docRef = doc(db, 'users', auth.currentUser.uid)
                            setDoc(docRef, { photoURL: url }, { merge: true }).then(() => {
                                $('body').addClass('loaded')
                                notice("Profile picture has been changed")
                            })
                        })
                    }).catch(err => {
                        notice(err.message)
                    })
                } else {
                    notice("Please choose an image")
                }
            }
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

            const username = prompt("Enter your new username: ")
            if (username.trim() == "") {
                notice("Please input valid username")
            } else if (username.trim().length < 6) {
                notice("Username must be at least 6 characters")
            } else if (username.trim() == auth.currentUser.displayName) {
                notice("New username must be different from current username")
            } else {
                closeModal("#profile-modal")
                let exist = false
                const q = query(collection(db, 'users'), where('username', '==', username.trim()))
                getDocs(q).then(d => {
                    d.forEach(data => {
                        if (data.exists) {
                            exist = true
                        }
                    })
                    if (exist) {
                        notice("This username has already been taken")
                    } else {
                        $('body').removeClass('loaded')
                        const docRef = doc(db, 'users', auth.currentUser.uid)
                        setDoc(docRef, { username: username }, { merge: true }).then(() => {
                            $('body').addClass('loaded')
                            notice("Username has been changed")
                        })
                        updateProfile(auth.currentUser, { displayName: username })
                    }
                })
            }
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
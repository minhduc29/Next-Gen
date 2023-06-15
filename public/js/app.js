import { initialize, copyright, notice, setupUI } from './utils.js'
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"
import '../components/login-form.js'
import '../components/register-form.js'
import '../components/profile-item.js'
import '../screens/home-screen.js'

// Initialize
initialize()
const auth = getAuth()

// Copyright
copyright()

// Logout
const logoutBtn = document.getElementsByClassName('logout-btn')
for (let i = 0; i < logoutBtn.length; i++) {
    logoutBtn[i].addEventListener('click', (e) => {
        e.preventDefault()
        auth.signOut()
    })
}

// Listen for auth status to setup UI
onAuthStateChanged(auth, user => {
    if (user) {
        setupUI(user)
        notice(`Welcome back ${user.displayName}`)
    } else {
        setupUI()
    }
})
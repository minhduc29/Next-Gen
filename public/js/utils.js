// Init
function initialize() {
    M.AutoInit()
}

// Copyright
function copyright() {
    const cpr = document.getElementById('cpr')
    const year = new Date().getFullYear()
    cpr.insertAdjacentHTML('beforeend', year)
}

// Toastify
function notice(msg) {
    M.toast({ html: msg, classes: 'bg-4b88a2' })
}

// Setup UI for specific part
function setupUI(user) {
    const logout = document.querySelectorAll('.logout')
    const login = document.querySelectorAll('.login')
    if (user) {
        // Toggle UI
        login.forEach(item => item.style.display = 'block')
        logout.forEach(item => item.style.display = 'none')
    } else {
        // Toggle UI
        login.forEach(item => item.style.display = 'none')
        logout.forEach(item => item.style.display = 'block')
    }
}

// Close modal
function closeModal(modalID) {
    const modal = document.querySelector(modalID)
    M.Modal.getInstance(modal).close()
}

// CSS for web component
const css = `
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
<style>
    @import "./css/style.css"
</style>`

export { initialize, copyright, notice, setupUI, closeModal, css }
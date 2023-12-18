function setInvalidState(message) {
    document.getElementById("invalid-state").classList.remove("d-none");
    document.getElementById("invalid-state-message").innerHTML = message;
}

function reset() {
    document.getElementById("invalid-state").classList.add("d-none");
    document.getElementById("invalid-state-message").innerHTML = '';
}

export default { setInvalidState, reset }
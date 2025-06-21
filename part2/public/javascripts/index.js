document.getElementById('app').addEventListener('submit', function(event) {
    event.preventDefault();

    const username= document.getElementById('uname').value;
    const password= document.getElementById('psw').value;

    if (username.trim() === '' || password.trim() === '') {
        alert('Please enter a Username and Password');
        return;
    }
    SendLoginCredentials(username, password);

});

async function SendLoginCredentials(username, password) {
    try{
        const response = await
    }
}

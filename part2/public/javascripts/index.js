document.getElementById('app').addEventListener('submit', function(event) {
    event.preventDefault();

    const username= document.getElementById('uname').value;
    const password= document.getElementById('psw').value;

    if (username.trim() === '' || password.trim() === '') {
        alert('Please enter a Username and Password');
        return;
    }

    async function SendLoginCredentials() {
    try {
  const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password})
        });
        const data = await response.json();
        if (user.role === 'owner') {
            redirect('/owner-dashboard.html'); //if owner redirect to owner dashboard
        }
        else if (user.role === 'walker') {
            redirect('/walker-dashboard.html'); //if walker redirect to walker dashboard
        }
} catch (error) {
   console.error('Error during login:', error);
}

}

});




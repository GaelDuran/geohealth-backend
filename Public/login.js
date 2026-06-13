const API_BASE = 'http://localhost:4000';


// REGISTRO
document.getElementById('register-btn')
.addEventListener('click', async () => {

    const name =
        document.getElementById('register-name').value;

    const email =
        document.getElementById('register-email').value;

    const password =
        document.getElementById('register-password').value;

    try{

        const response = await fetch(
            `${API_BASE}/api/users/register`,
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        alert(data.message);

    }catch(err){
        console.error(err);
    }

});


// LOGIN
document.getElementById('login-btn')
.addEventListener('click', async () => {

    const email =
        document.getElementById('login-email').value;

    const password =
        document.getElementById('login-password').value;

    try{

        const response = await fetch(
            `${API_BASE}/api/users/login`,
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        if(response.ok){

    localStorage.setItem(
        'userName',
        data.user.name
    );

    localStorage.setItem(
        'userEmail',
        data.user.email
    );

    window.location.href =
        'index.html';
}

    }catch(err){
        console.error(err);
    }

});
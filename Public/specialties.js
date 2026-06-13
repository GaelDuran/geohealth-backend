const API_BASE = 'http://localhost:4000';

const table =
document.getElementById('specialties-table');

let editingId = null;

async function loadSpecialties(){

    const res =
    await fetch(`${API_BASE}/api/specialties`);

    const specialties =
    await res.json();

    table.innerHTML = '';

    specialties.forEach(item => {

        const row =
        document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description}</td>

            <td>

                <button
                onclick="editSpecialty(
                    '${item._id}',
                    '${item.name}',
                    '${item.description}'
                )">
                Editar
                </button>

                <button
                onclick="deleteSpecialty(
                    '${item._id}'
                )">
                Eliminar
                </button>

            </td>
        `;

        table.appendChild(row);

    });

}

document
.getElementById('specialty-form')
.addEventListener('submit',
async function(e){

    e.preventDefault();

    const name =
    document.getElementById('name').value;

    const description =
    document.getElementById('description').value;

    const url = editingId
    ? `${API_BASE}/api/specialties/${editingId}`
    : `${API_BASE}/api/specialties`;

    const method =
    editingId ? 'PATCH' : 'POST';

    await fetch(url,{
        method,
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            name,
            description
        })
    });

    this.reset();

    editingId = null;

    loadSpecialties();

});

function editSpecialty(
    id,
    name,
    description
){

    editingId = id;

    document
    .getElementById('name')
    .value = name;

    document
    .getElementById('description')
    .value = description;

}

async function deleteSpecialty(id){

    await fetch(
        `${API_BASE}/api/specialties/${id}`,
        {
            method:'DELETE'
        }
    );

    loadSpecialties();

}

const userName =
localStorage.getItem(
    'userName'
);

if(userName){

    document.getElementById(
        'user-name'
    ).textContent =
        userName;

}

const logoutBtn =
document.getElementById(
    'logout-btn'
);

if(logoutBtn){

    logoutBtn.addEventListener(
        'click',
        function(e){

            e.preventDefault();

            localStorage.clear();

            window.location.href =
                'login.html';

        }
    );

}

if(
    !localStorage.getItem(
        'userName'
    )
){
    window.location.href =
        'login.html';
}

loadSpecialties();
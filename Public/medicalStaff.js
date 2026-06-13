const API_BASE = 'http://localhost:4000';

const table =
document.getElementById('doctors-table');

const specialtySelect =
document.getElementById('specialty');

let editingId = null;

async function loadSpecialties() {

    try {

        const res =
            await fetch(`${API_BASE}/api/specialties`);

        const specialties =
            await res.json();

        specialtySelect.innerHTML =
            '<option value="">Seleccionar especialidad</option>';

        specialties.forEach(item => {

            specialtySelect.innerHTML += `
                <option value="${item._id}">
                    ${item.name}
                </option>
            `;

        });

    } catch (err) {

        console.error(
            'Error cargando especialidades',
            err
        );

    }

}

async function loadDoctors() {

    try {

        const res =
            await fetch(
                `${API_BASE}/api/medicalStaff`
            );

        const doctors =
            await res.json();

        table.innerHTML = '';

        doctors.forEach(doctor => {

            const row =
                document.createElement('tr');

            row.innerHTML = `
                <td>${doctor.name}</td>
                <td>${doctor.phone}</td>
                <td>${doctor.specialty?.name || ''}</td>

                <td>

                    <button
                        onclick="editDoctor(
                            '${doctor._id}',
                            '${doctor.name}',
                            '${doctor.phone}',
                            '${doctor.specialty?._id}'
                        )"
                    >
                        Editar
                    </button>

                    <button
                        class="danger"
                        onclick="deleteDoctor(
                            '${doctor._id}'
                        )"
                    >
                        Eliminar
                    </button>

                </td>
            `;

            table.appendChild(row);

        });

    } catch (err) {

        console.error(
            'Error cargando médicos',
            err
        );

    }

}

document
.getElementById('doctor-form')
.addEventListener(
    'submit',
    async function(e){

        e.preventDefault();

        const name =
            document.getElementById('name').value;

        const phone =
            document.getElementById('phone').value;

        const specialty =
            specialtySelect.value;

        const url = editingId
            ? `${API_BASE}/api/medicalStaff/${editingId}`
            : `${API_BASE}/api/medicalStaff`;

        const method =
            editingId ? 'PATCH' : 'POST';

        await fetch(url, {

            method,

            headers: {
                'Content-Type':'application/json'
            },

            body: JSON.stringify({
                name,
                phone,
                specialty
            })

        });

        this.reset();

        editingId = null;

        loadDoctors();

    }
);

function editDoctor(
    id,
    name,
    phone,
    specialtyId
){

    editingId = id;

    document
        .getElementById('name')
        .value = name;

    document
        .getElementById('phone')
        .value = phone;

    specialtySelect.value =
        specialtyId;

}

async function deleteDoctor(id){

    const confirmed =
        confirm(
            '¿Eliminar médico?'
        );

    if(!confirmed) return;

    await fetch(
        `${API_BASE}/api/medicalStaff/${id}`,
        {
            method:'DELETE'
        }
    );

    loadDoctors();

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
loadDoctors();
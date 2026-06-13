const API_BASE = 'http://localhost:4000';

const map = L.map('map').setView([20.67, -101.35], 13);
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
const drawControl = new L.Control.Draw({

    draw: {
        polygon: true,
        rectangle: true,
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: false
    },
    edit: {
        featureGroup: drawnItems
    }
});

map.addControl(drawControl);
const markersLayer = L.layerGroup().addTo(map);
const tableBody = document.querySelector('#places-table tbody');
const saveButton = document.getElementById('save-button');
const cancelEditButton = document.getElementById('cancel-edit');
const editingIdInput = document.getElementById('editing-id');
const searchInput = document.getElementById('search-place');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

let marker;

function resetForm() {
    document.getElementById('place-form').reset();
    document.getElementById('lat').value = '';
    document.getElementById('lng').value = '';
    editingIdInput.value = '';
    saveButton.textContent = 'Guardar Lugar';
    cancelEditButton.classList.add('hidden');
    if (marker) {
        map.removeLayer(marker);
        marker = null;
    }
}

function clearResults() {
    markersLayer.clearLayers();
    tableBody.innerHTML = '';
}

function renderPlacesTable(places) {
    tableBody.innerHTML = '';

    places.forEach(place => {
        if (!place.location || !place.location.coordinates) return;

        const [lng, lat] = place.location.coordinates;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${place.name || ''}</td>
            <td>${place.description || ''}</td>
            <td>${lat.toFixed(5)}</td>
            <td>${lng.toFixed(5)}</td>
            <td class="actions">
                <button type="button" class="secondary" data-action="edit" data-id="${place._id}">Editar</button>
                <button type="button" class="danger" data-action="delete" data-id="${place._id}">Borrar</button>
            </td>
        `;
        tableBody.appendChild(row);

        const placeMarker = L.marker([lat, lng]).addTo(markersLayer)
            .bindPopup(`<strong>${place.name || ''}</strong><br>${place.description || ''}<br><small>${place._id}</small>`);

        row.addEventListener('mouseenter', () => placeMarker.openPopup());
    });
}

map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`)
        .openPopup();
});

map.on(
    L.Draw.Event.CREATED,
    async function (event) {

        const layer = event.layer;

        drawnItems.addLayer(layer);

        const latlngs =
            layer.getLatLngs()[0];

        const points =
            latlngs.map(point => [

                point.lat,

                point.lng

            ]);

        try {

            await fetch(
                `${API_BASE}/api/zones`,
                {

                    method: 'POST',

                    headers: {
                        'Content-Type':
                        'application/json'
                    },

                    body: JSON.stringify({

                        name: 'Zona Salud',

                        points

                    })

                }
            );

            alert(
                'Zona guardada'
            );

        } catch (err) {

            console.error(err);

            alert(
                'Error al guardar zona'
            );

        }

    }
);

async function loadZones() {

    try {

        const res =
            await fetch(
                `${API_BASE}/api/zones`
            );

        const zones =
            await res.json();

        zones.forEach(zone => {

            const polygon =
                L.polygon(zone.points);

            polygon.zoneId =
                zone._id;

            polygon.bindPopup(`
                <strong>${zone.name}</strong>
                <br><br>
                <button onclick="deleteZone('${zone._id}')">
                    Eliminar Zona
                </button>
            `);

            drawnItems.addLayer(
                polygon
            );

        });

    } catch (err) {

        console.error(err);

    }

}

async function deleteZone(id) {

    const confirmed =
        confirm(
            '¿Eliminar esta zona?'
        );

    if (!confirmed) return;

    try {

        await fetch(
            `${API_BASE}/api/zones/${id}`,
            {
                method: 'DELETE'
            }
        );

        drawnItems.clearLayers();

        await loadZones();

        alert(
            'Zona eliminada'
        );

    } catch (err) {

        console.error(err);

    }

}

// Cargar y mostrar lugares existentes
async function loadPlaces() {
    try {
        const res = await fetch(`${API_BASE}/api/places`);
        const places = await res.json();

        clearResults();
        renderPlacesTable(places);
    } catch (err) {
        console.error('Error cargando lugares:', err);
    }
}

async function deletePlace(id) {
    const confirmed = confirm('¿Seguro que deseas borrar este registro?');
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_BASE}/api/places/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error en el servidor (${response.status})`);
        }

        resetForm();
        await loadPlaces();
        await loadStats();
    } catch (err) {
        console.error(err);
        alert(`No se pudo borrar el registro: ${err.message}`);
    }
}

function startEdit(place) {
    document.getElementById('name').value = place.name || '';
    document.getElementById('description').value = place.description || '';
    document.getElementById('lat').value = place.location.coordinates[1];
    document.getElementById('lng').value = place.location.coordinates[0];
    editingIdInput.value = place._id;
    saveButton.textContent = 'Actualizar Lugar';
    cancelEditButton.classList.remove('hidden');
}

// Manejar el formulario
document.getElementById('place-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const latitude = parseFloat(document.getElementById('lat').value);
    const longitude = parseFloat(document.getElementById('lng').value);
    const editingId = editingIdInput.value;

    if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) {
        alert('Por favor seleccione una ubicación en el mapa y complete el nombre.');
        return;
    }

    try {
        const method = editingId ? 'PATCH' : 'POST';
        const url = editingId ? `${API_BASE}/api/places/${editingId}` : `${API_BASE}/api/places`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, latitude, longitude })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error en el servidor (${response.status})`);
        }

        alert(editingId ? 'Lugar actualizado' : 'Lugar registrado');
        resetForm();
        await loadPlaces();
        await loadStats();
    } catch (err) {
        console.error(err);
        alert(`No se pudo guardar el lugar: ${err.message}`);
    }
});

cancelEditButton.addEventListener('click', resetForm);

tableBody.addEventListener('click', async function (e) {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const placeId = button.dataset.id;
    const action = button.dataset.action;

    try {
        const res = await fetch(`${API_BASE}/api/places`);
        const places = await res.json();
        const place = places.find(item => item._id === placeId);

        if (!place) {
            alert('No se encontró el registro');
            return;
        }

        if (action === 'edit') {
            startEdit(place);
            map.setView([place.location.coordinates[1], place.location.coordinates[0]], 15);
            return;
        }

        if (action === 'delete') {
            await deletePlace(placeId);
        }
    } catch (err) {
        console.error(err);
        alert('No se pudo completar la acción');
    }
});

async function searchPlaces(text){

    try{

        const res =
        await fetch(`${API_BASE}/api/places`);

        const places =
        await res.json();

        const filtered =
        places.filter(place =>
            place.name
            .toLowerCase()
            .includes(
                text.toLowerCase()
            )
        );

        clearResults();
        renderPlacesTable(filtered);

    }catch(err){

        console.error(err);

    }

}
searchInput.addEventListener(
    'input',
    function(){

        searchPlaces(
            this.value
        );

    }
);

async function loadStats() {

    try {

        const [
            placesRes,
            zonesRes,
            doctorsRes,
            specialtiesRes
        ] = await Promise.all([

            fetch(`${API_BASE}/api/places`),

            fetch(`${API_BASE}/api/zones`),

            fetch(`${API_BASE}/api/medicalStaff`),

            fetch(`${API_BASE}/api/specialties`)

        ]);

        const places =
            await placesRes.json();

        const zones =
            await zonesRes.json();

        const doctors =
            await doctorsRes.json();

        const specialties =
            await specialtiesRes.json();

        document.getElementById(
            'places-count'
        ).textContent =
            places.length;

        document.getElementById(
            'zones-count'
        ).textContent =
            zones.length;

        document.getElementById(
            'doctors-count'
        ).textContent =
            doctors.length;

        document.getElementById(
            'specialties-count'
        ).textContent =
            specialties.length;

    } catch (err) {

        console.error(
            'Error cargando estadísticas',
            err
        );
    }
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
            localStorage.removeItem(
                'userName'
            );
            localStorage.removeItem(
                'userEmail'
            );
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

// Inicializar carga de lugares al inicio
loadPlaces();
loadZones();
loadStats();
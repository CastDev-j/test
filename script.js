const startTime = 7;
const endTime = 19;
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
let savedTimes = [];
let userColors = [];

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#horario tbody');

    // Generar la tabla de horarios
    for (let hour = startTime; hour <= endTime; hour++) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = `${hour}:00 - ${hour + 1}:00`;
        row.appendChild(timeCell);

        days.forEach(day => {
            const cell = document.createElement('td');
            cell.classList.add('selectable');
            cell.addEventListener('click', () => toggleSelection(cell, hour, day));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    }

    document.getElementById('guardar').addEventListener('click', saveSelections);

    // Obtener los horarios guardados al cargar la página
    fetchSchedules();
});

const selectedTimes = [];

function toggleSelection(cell, hour, day) {
    cell.classList.toggle('selected');
    const timeIndex = selectedTimes.findIndex(t => t.hour === hour && t.day === day);
    if (timeIndex > -1) {
        selectedTimes.splice(timeIndex, 1);
    } else {
        selectedTimes.push({ hour, day });
    }
}

function saveSelections() {
    const nombre = document.getElementById('nombre').value;
    const color = document.getElementById('color').value;
    if (!nombre || !color) {
        alert('Nombre y color son obligatorios.');
        return;
    }
    
    // Preparar los datos para enviar a la API
    const data = {
        nombre,  // Nombre del usuario
        color,   // Color del usuario
        horasOcupadas: selectedTimes
    };

    // Enviar datos a la API
    fetch('https://66bfb5ab42533c403146e364.mockapi.io/horarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Horario guardado:', data);
        fetchSchedules(); // Refrescar la tabla después de guardar
    })
    .catch(error => {
        console.error('Error al guardar el horario:', error);
    });
}

function fetchSchedules() {
    fetch('https://66bfb5ab42533c403146e364.mockapi.io/horarios')
    .then(response => response.json())
    .then(data => {
        savedTimes = data.flatMap(item => item.horasOcupadas.map(t => ({
            ...t,
            color: item.color,
            nombre: item.nombre
        })));
        userColors = data.map(item => ({ nombre: item.nombre, color: item.color }));
        generateSavedScheduleTable();
        displayUserColors();
    })
    .catch(error => {
        console.error('Error al obtener los horarios:', error);
    });
}

function generateSavedScheduleTable() {
    const savedTableContainer = document.getElementById('tabla-horarios-guardados');
    savedTableContainer.innerHTML = ''; // Limpiar el contenido previo

    const table = document.createElement('table');
    table.id = 'horario-guardado';

    // Crear encabezado de la tabla
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Hora';
    headerRow.appendChild(timeHeader);

    days.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');

    for (let hour = startTime; hour <= endTime; hour++) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = `${hour}:00 - ${hour + 1}:00`;
        row.appendChild(timeCell);

        days.forEach(day => {
            const cell = document.createElement('td');
            const color = getCellColor(hour, day);
            if (color) {
                cell.style.backgroundColor = color;
                cell.style.color = '#fff'; // Color de texto blanco para mejor contraste
            }
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    savedTableContainer.appendChild(table);
}

function getCellColor(hour, day) {
    const entry = savedTimes.find(t => t.hour === hour && t.day === day);
    return entry ? entry.color : null;
}

function displayUserColors() {
    const coloresDisponiblesDiv = document.getElementById('colores-disponibles');
    coloresDisponiblesDiv.innerHTML = '';

    userColors.forEach(user => {
        const colorDiv = document.createElement('div');
        colorDiv.textContent = user.nombre;
        colorDiv.style.backgroundColor = user.color;
        colorDiv.style.padding = '5px';
        colorDiv.style.marginBottom = '5px';
        colorDiv.style.color = '#fff';
        coloresDisponiblesDiv.appendChild(colorDiv);
    });
}

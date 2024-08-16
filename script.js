const startTime = 7;
const endTime = 19;
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
let savedTimes = [];

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
    const hoursOcupadasDiv = document.getElementById('horas-ocupadas');
    hoursOcupadasDiv.innerHTML = '';
    
    selectedTimes.forEach(time => {
        const div = document.createElement('div');
        div.textContent = `${time.day} ${time.hour}:00 - ${time.hour + 1}:00`;
        hoursOcupadasDiv.appendChild(div);
    });

    // Preparar los datos para enviar a MockAPI
    const data = {
        usuario: "Usuario1",  // Cambia esto por el nombre del usuario o algún identificador si lo tienes
        horasOcupadas: selectedTimes
    };

    // Enviar datos a MockAPI
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
        savedTimes = data.flatMap(item => item.horasOcupadas);
        generateSavedScheduleTable();
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
            const isSelected = savedTimes.some(t => t.hour === hour && t.day === day);
            if (isSelected) {
                cell.classList.add('selected');
            }
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    savedTableContainer.appendChild(table);
}

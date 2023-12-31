document.addEventListener('DOMContentLoaded', function() {
    carregarCalendario();
});

function carregarCalendario() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        timeZone: 'UTC-3',
        editable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            carregarEventos()
                .then(eventos => {
                    const eventosTransformados = transformarFormato(eventos);
                    successCallback(eventosTransformados);
                })
                .catch(error => {
                    console.error('Erro ao carregar eventos:', error);
                    failureCallback(error);
                });
        },
        eventClick: function(info) {
            console.log('Evento selecionado:', info.event.extendedProps.description);
            Swal.fire('Descrição: ' + info.event.extendedProps.description);
        },
    });

    calendar.render();
}

function carregarEventos() {
    return fetch('http://localhost:3000/eventos')
        .then(response => response.json())
        .catch(error => {
            console.error('Erro ao carregar eventos:', error);
            return [];
        });
}

function transformarFormato(eventos) {
    return eventos.map(evento => {
        return {
            id: evento.id,
            title: evento.titulo,
            description: evento.descricao,
            start: FormataStringData(evento.data_inicio), // Formatação da data de início
            end: FormataStringData(evento.data_fim), // Formatação da data de fim
            extendedProps: {
                description: evento.descricao,
            },
        };
    });
}

function FormataStringData(data) {
    var dia  = data.split("/")[0];
    var mes  = data.split("/")[1];
    var ano  = data.split("/")[2];

    return ano + '-' + ("0"+mes).slice(-2) + '-' + ("0"+dia).slice(-2);
}

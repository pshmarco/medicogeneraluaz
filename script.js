document.addEventListener('DOMContentLoaded', () => {
    const ramos = document.querySelectorAll('.ramo');
    const creditosAprobadosCountSpan = document.getElementById('creditosAprobadosCount');
    const totalCreditosSpan = document.getElementById('totalCreditos');
    const porcentajeAvanceSpan = document.getElementById('porcentajeAvance');
    const ramosAprobadosCountSpan = document.getElementById('ramosAprobadosCount');
    const totalRamosSpan = document.getElementById('totalRamos');

    // Calcula el total de ramos y créditos una vez al cargar
    let totalRamos = ramos.length;
    totalRamosSpan.textContent = totalRamos;

    let totalCreditos = 0;
    ramos.forEach(ramo => {
        // Usamos parseFloat para los créditos ya que pueden tener decimales
        const creditos = parseFloat(ramo.dataset.creditos || '0');
        totalCreditos += creditos;
    });
    totalCreditosSpan.textContent = totalCreditos.toFixed(1); // Muestra con un decimal

    // Cargar el estado de los ramos desde localStorage
    // 'medicoGeneralApprovedRamos' es una clave única para esta malla
    let approvedRamos = new Set(JSON.parse(localStorage.getItem('medicoGeneralApprovedRamos')) || []);

    // Función para guardar el estado actual de los ramos aprobados
    function saveRamosState() {
        localStorage.setItem('medicoGeneralApprovedRamos', JSON.stringify(Array.from(approvedRamos)));
    }

    // Función para actualizar la visualización de los ramos y el progreso
    function updateRamosDisplay() {
        let currentApprovedCreditos = 0;
        let currentApprovedRamosCount = 0;

        ramos.forEach(ramo => {
            const ramoId = ramo.dataset.id;
            if (approvedRamos.has(ramoId)) {
                ramo.classList.add('aprobado');
                currentApprovedRamosCount++;
                currentApprovedCreditos += parseFloat(ramo.dataset.creditos || '0');
            } else {
                ramo.classList.remove('aprobado');
            }
        });

        // Actualizar los textos del resumen de avance
        ramosAprobadosCountSpan.textContent = currentApprovedRamosCount;
        creditosAprobadosCountSpan.textContent = currentApprovedCreditos.toFixed(1); // Muestra con un decimal
        
        const porcentaje = totalCreditos > 0 ? ((currentApprovedCreditos / totalCreditos) * 100).toFixed(1) : 0;
        porcentajeAvanceSpan.textContent = porcentaje;
    }

    // Añadir el event listener a cada ramo para el clic
    ramos.forEach(ramo => {
        ramo.addEventListener('click', () => {
            const ramoId = ramo.dataset.id; // Obtener el ID único del ramo

            if (approvedRamos.has(ramoId)) {
                // Si ya está aprobado, destacharlo
                approvedRamos.delete(ramoId);
            } else {
                // Si no está aprobado, tacharlo
                approvedRamos.add(ramoId);
            }

            saveRamosState();        // Guardar el nuevo estado
            updateRamosDisplay();    // Actualizar la interfaz
        });
    });

    // Cargar y mostrar el estado inicial cuando la página se carga
    updateRamosDisplay();
});

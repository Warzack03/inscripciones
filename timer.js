// Variables globales
let totalSeconds = 0; // Tiempo inicial en segundos (comienza en 0)
const timerElement = document.getElementById('timer'); // Contenedor del temporizador

// Función principal para el contador hacia adelante
function startTimer() {
    const interval = setInterval(() => {
        totalSeconds++; // Incrementar tiempo en segundos

        // Calcular minutos y segundos
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        // Formatear los minutos y segundos a dos dígitos
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        // Actualizar el contenido del temporizador
        timerElement.textContent = `${minutes}:${seconds}`;

        // Detener el temporizador al llegar a 25 minutos
        if (totalSeconds >= 25 * 60) {
            clearInterval(interval); // Detener el contador
            timerElement.textContent = "25:00"; // Asegurar el formato final
        }
    }, 1000); // Intervalo de 1 segundo
}

// Iniciar el temporizador automáticamente
startTimer();

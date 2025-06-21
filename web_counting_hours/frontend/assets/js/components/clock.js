/*
 * frontend/assets/js/components/clock.js
 * Descrição: Script para controlar a animação do relógio.
 */

// ==========================================================================
// SELEÇÃO DE ELEMENTOS DO DOM (Relacionados ao Relógio)
// ==========================================================================
const hr = document.querySelector('#hr'); // Ponteiro das horas
const mn = document.querySelector('#mn'); // Ponteiro dos minutos
const sc = document.querySelector('#sc'); // Ponteiro dos segundos

// Valor em graus para cada segundo (para o movimento dos ponteiros do relógio)
const deg = 6;

// ==========================================================================
// LÓGICA DO RELÓGIO
// ==========================================================================

// Usando a função setInterval para atualizar os ponteiros a cada segundo (1000 milissegundos)
function startClock() {
    setInterval(() => {
        let day = new Date(); // Cria um novo objeto Date para obter a hora atual
        let hh = day.getHours() * 30; // Calcula o ângulo do ponteiro das horas (360 graus / 12 horas)
        let mm = day.getMinutes() * deg; // Calcula o ângulo do ponteiro dos minutos
        let ss = day.getSeconds() * deg; // Calcula o ângulo do ponteiro dos segundos

        // Aplica uma transformação de rotação CSS a cada ponteiro para atualizar sua posição
        // A rotação é feita no eixo Z (para girar no plano 2D)
        if (hr) {
            hr.style.transform = `rotateZ(${hh + (mm / 12)}deg)`; // A hora também é influenciada pelos minutos para um movimento mais realista
        }
        if (mn) {
            mn.style.transform = `rotateZ(${mm}deg)`;
        }
        if (sc) {
            sc.style.transform = `rotateZ(${ss}deg)`;
        }
    }, 1000);
}

// Inicia o relógio quando o script é carregado
startClock();
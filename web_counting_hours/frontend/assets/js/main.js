/*
 * frontend/assets/js/main.js
 * Descrição: Arquivo principal para inicializar e importar os módulos do frontend.
 */

// Importa a lógica da barra lateral
import './components/sidebar.js';

// Importa a lógica do relógio (a função startClock é executada automaticamente)
import './components/clock.js';

// Importa a lógica de navegação (os event listeners são adicionados automaticamente)
import './navigation.js';

// Importa a lógica de gerenciamento de funcionários (a função fetchEmployees é chamada no navigation.js)
import './components/employees.js';

// Importa a lógica do modal (os event listeners são adicionados automaticamente)
import './components/modal.js';

// ==========================================================================
// LÓGICA ADICIONAL OU INICIALIZAÇÃO GERAL (SE NECESSÁRIO)
// ==========================================================================

// Por exemplo, você pode adicionar aqui alguma lógica que precisa ser executada
// assim que a página for totalmente carregada.
document.addEventListener('DOMContentLoaded', () => {
    console.log('Frontend scripts carregados e inicializados.');
});
/*
 * frontend/assets/js/components/sidebar.js
 * Descrição: Lógica para controlar a interatividade da barra lateral.
 */

// ==========================================================================
// SELEÇÃO DE ELEMENTOS DO DOM (Relacionados à Barra Lateral)
// ==========================================================================
const toggle = document.querySelector('.menu-toggle'); // Botão de alternar menu
const sidebar = document.querySelector('.sidebar'); // Elemento da barra lateral

// Variável para controlar o timeout do hover da barra lateral
let hoverTimeout;

// ==========================================================================
// LÓGICA DA BARRA LATERAL
// ==========================================================================

// Adiciona um ouvinte de evento de clique ao botão de alternar o menu
if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
        // Verifica se a barra lateral possui a classe 'expanded'
        const isExpanded = sidebar.classList.contains('expanded');

        if (isExpanded) {
            // Se estiver expandida, remove a classe 'expanded' para recolher
            sidebar.classList.remove('expanded');
            // Adiciona a classe 'no-hover' para desabilitar temporariamente o efeito de hover
            sidebar.classList.add('no-hover');

            // Limpa qualquer timeout anterior para evitar comportamentos inesperados
            clearTimeout(hoverTimeout);

            // Define um novo timeout para remover a classe 'no-hover' após 500ms
            // Isso permite que o efeito de hover volte a funcionar após a transição de recolhimento
            hoverTimeout = setTimeout(() => {
                sidebar.classList.remove('no-hover');
            }, 500); // Ajuste este tempo se desejar uma transição mais suave ou mais rápida
        } else {
            // Se não estiver expandida, adiciona a classe 'expanded' para expandir
            sidebar.classList.add('expanded');
            // Remove a classe 'no-hover' caso tenha sido adicionada anteriormente
            sidebar.classList.remove('no-hover');
        }
    });
}
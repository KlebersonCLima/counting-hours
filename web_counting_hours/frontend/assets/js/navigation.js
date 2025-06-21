/*
 * frontend/assets/js/navigation.js
 * Descrição: Lógica para controlar a navegação da barra lateral.
 */

// ==========================================================================
// SELEÇÃO DE ELEMENTOS DO DOM (Relacionados à Navegação)
// ==========================================================================
const homeButton = document.querySelector('.home-button');
const employeesButton = document.querySelector('.employees-button');
const clockContainer = document.querySelector('.clock-container');
// const mainContent = document.querySelector('.main-content');
const mainTitleElement = document.querySelector('.title');
// const employeesTableContainer = document.getElementById('employees-table-container');
// const addEmployeeButtonModal = document.getElementById('add-employee-button');
const employeesTitleElement = document.getElementById('employees-title');
// const sidebar = document.querySelector('.sidebar');
// let hoverTimeout; // Variável global compartilhada com sidebar.js

// ==========================================================================
// LÓGICA DOS BOTÕES DE NAVEGAÇÃO
// ==========================================================================

// Adiciona um ouvinte de evento de clique ao botão de início (Home)
if (homeButton) {
    homeButton.addEventListener('click', () => {
        // Exibe novamente o container do relógio
        if (clockContainer) {
            clockContainer.style.display = 'flex'; // Garante que seja exibido como flex
        }

        // Mostra o título principal "Counting Hours"
        if (mainTitleElement) {
            mainTitleElement.style.display = 'block';
        }

        // Esconde o título de funcionários
        if (employeesTitleElement) {
            employeesTitleElement.style.display = 'none';
        }

        // Esconder o botão de adicionar funcionário ao voltar para a página inicial
        if (addEmployeeButtonModal) {
            addEmployeeButtonModal.style.display = 'none';
        }

        // Remover mensagens de erro ou "nenhum encontrado" ao voltar para a página inicial
        const existingErrorMessage = mainContent.querySelector('.error-message');
        if (existingErrorMessage) {
            mainContent.removeChild(existingErrorMessage);
        }
        const existingNoDataMessage = mainContent.querySelector('.no-data-message');
        if (existingNoDataMessage) {
            mainContent.removeChild(existingNoDataMessage);
        }

        // Limpa qualquer tabela existente
        if (employeesTableContainer) {
            employeesTableContainer.innerHTML = '';
        }

        // Se a barra estiver expandida, recolhe (reutilizando a lógica do sidebar)
        if (sidebar && sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
            sidebar.classList.add('no-hover');
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                sidebar.classList.remove('no-hover');
            }, 500);
        }

        // Adiciona o container do relógio de volta ao main-content
        if (clockContainer) {
            mainContent.prepend(clockContainer); // Adiciona o relógio no início
        }
    });
}

// Adiciona um ouvinte de evento de clique ao botão de funcionários
if (employeesButton) {
    employeesButton.addEventListener('click', () => {
        // Oculta o container do relógio
        if (clockContainer) {
            clockContainer.style.display = 'none';
        }

        // Esconder o título principal "Counting Hours"
        if (mainTitleElement) {
            mainTitleElement.style.display = 'none';
        }

        // Mostrar o título de funcionários
        if (employeesTitleElement) {
            employeesTitleElement.style.display = 'block';
        }

        // Mostrar o botão de adicionar funcionário
        if (addEmployeeButtonModal) {
            addEmployeeButtonModal.style.display = 'block';
        }

        // Limpar o container da tabela antes de buscar e renderizar
        if (employeesTableContainer) {
            employeesTableContainer.innerHTML = ''; // Limpa qualquer tabela anterior
        }

        // Se a barra estiver expandida, recolhe (reutilizando a lógica do sidebar)
        if (sidebar && sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
            sidebar.classList.add('no-hover');
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                sidebar.classList.remove('no-hover');
            }, 500);
        }

        // Chama a função para buscar e exibir os funcionários (esta função será movida depois)
        fetchEmployees();
    });
}
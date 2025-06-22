/*
 * frontend/assets/js/navigation.js
 * Descrição: Lógica para controlar a navegação da barra lateral.
 */

// ==========================================================================
// LÓGICA DOS BOTÕES DE NAVEGAÇÃO
// ==========================================================================

// Adiciona um ouvinte de evento de clique ao botão de início (Home)
if (homeButton) {
    homeButton.addEventListener('click', () => {
        console.log('Navegando para Home...');

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

        // Limpa completamente a área de funcionários
        if (typeof clearEmployeesArea === 'function') {
            clearEmployeesArea();
        } else {
            // Fallback se a função não estiver disponível
            if (employeesTableContainer) {
                employeesTableContainer.innerHTML = '';
            }
            const existingMessages = mainContent.querySelectorAll('.error-message, .no-data-message');
            existingMessages.forEach(message => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            });
        }

        // A lógica do sidebar é gerenciada pelo sidebar.js

        // Adiciona o container do relógio de volta ao main-content
        if (clockContainer) {
            mainContent.prepend(clockContainer); // Adiciona o relógio no início
        }
    });
}

// Adiciona um ouvinte de evento de clique ao botão de funcionários
if (employeesButton) {
    employeesButton.addEventListener('click', () => {
        console.log('Navegando para Funcionários...');

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

        // Limpa completamente a área de funcionários antes de buscar
        if (typeof clearEmployeesArea === 'function') {
            clearEmployeesArea();
        } else {
            // Fallback se a função não estiver disponível
            if (employeesTableContainer) {
                employeesTableContainer.innerHTML = '';
            }
            const existingMessages = mainContent.querySelectorAll('.error-message, .no-data-message');
            existingMessages.forEach(message => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            });
        }

        // A lógica do sidebar é gerenciada pelo sidebar.js

        // Chama a função para buscar e exibir os funcionários
        fetchEmployees();
    });
}
/*
 * frontend/assets/js/components/employees.js
 * Descrição: Lógica para buscar, exibir e interagir com a lista de funcionários.
 */

// ==========================================================================
// SELEÇÃO DE ELEMENTOS DO DOM (Relacionados à Lista de Funcionários)
// ==========================================================================
const employeesTableContainer = document.getElementById('employees-table-container');
const mainContent = document.querySelector('.main-content');

// ==========================================================================
// FUNÇÃO PARA BUSCAR E EXIBIR OS FUNCIONÁRIOS
// ==========================================================================
function fetchEmployees() {
    if (employeesTableContainer) {
        employeesTableContainer.innerHTML = ''; // Limpa qualquer tabela existente
        // Limpa qualquer mensagem anterior de erro ou "nenhum encontrado"
        const existingErrorMessage = mainContent.querySelector('.error-message');
        if (existingErrorMessage) {
            mainContent.removeChild(existingErrorMessage);
        }
        const existingNoDataMessage = mainContent.querySelector('.no-data-message');
        if (existingNoDataMessage) {
            mainContent.removeChild(existingNoDataMessage);
        }
        fetch('http://127.0.0.1:5000/funcionarios') // Faz a requisição GET para a API
            .then(response => response.json()) // Converte a resposta para JSON
            .then(data => {
                // 'data' agora contém a lista de funcionários como um array de arrays
                if (data && data.length > 0) {
                    // Cria a tabela HTML
                    const table = document.createElement('table');
                    table.classList.add('employees-table'); // Adiciona uma classe para estilização futura

                    // Cria o cabeçalho da tabela
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    const headers = ['ID', 'Foto Perfil', 'Nome', 'CPF', 'Carga Horária', 'Ações']; // Nomes das colunas
                    headers.forEach(headerText => {
                        const th = document.createElement('th');
                        th.textContent = headerText;
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.appendChild(thead);

                    // Cria o corpo da tabela
                    const tbody = document.createElement('tbody');
                    data.forEach(employee => {
                        const row = document.createElement('tr');
                        employee.forEach((cellData, index) => { // Adicionamos o 'index' aqui
                            const td = document.createElement('td');
                            if (index === 4 && typeof cellData === 'number') { // Se for a quinta célula (carga horária) e for um número
                                const hours = Math.floor(cellData / 60);
                                const minutes = cellData % 60;
                                const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                td.textContent = formattedTime;
                            } else if (index === 1) { // Se for a coluna da foto de perfil (índice 1)
                                // Aqui você pode adicionar lógica para exibir a foto se tiver o caminho
                                td.textContent = cellData || 'Sem Foto'
                            } else {
                                td.textContent = cellData === null ? '' : cellData;
                            }
                            row.appendChild(td);
                        });

                        // Adicionar a coluna de ações com os botões
                        const actionsTd = document.createElement('td');
                        const deleteButton = document.createElement('button');
                        const deleteIcon = document.createElement('i');
                        deleteIcon.classList.add('fas', 'fa-trash-alt'); // Adiciona as classes do Font Awesome para a lixeira
                        deleteButton.appendChild(deleteIcon);
                        deleteButton.classList.add('delete-button'); // Adicionar uma classe para estilo e event listener
                        deleteButton.dataset.employeeId = employee[0]; // Armazenar o ID do funcionário no botão

                        const editButton = document.createElement('button');
                        const editIcon = document.createElement('i');
                        editIcon.classList.add('fas', 'fa-pencil-alt'); // Adiciona as classes do Font Awesome para o lápis
                        editButton.appendChild(editIcon);
                        editButton.classList.add('edit-button'); // Adicionar uma classe para estilo e event listener
                        editButton.dataset.employeeId = employee[0]; // Armazenar o ID do funcionário no botão
                        editButton.addEventListener('click', openEditModal); // Adicionar o listener para a função openEditModal (será movida depois)

                        actionsTd.appendChild(deleteButton);
                        actionsTd.appendChild(editButton);
                        row.appendChild(actionsTd);

                        tbody.appendChild(row);
                    });
                    table.appendChild(tbody);

                    if (employeesTableContainer) {
                        employeesTableContainer.appendChild(table);
                    }
                    // Adicionar event listeners para os botões DEPOIS que a tabela for criada
                    addDeleteEventListeners();
                } else {
                    const noEmployeesMessage = document.createElement('p');
                    noEmployeesMessage.textContent = 'Nenhum funcionário encontrado.';
                    noEmployeesMessage.classList.add('no-data-message'); // Adiciona uma classe para identificar
                    mainContent.appendChild(noEmployeesMessage);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar funcionários:', error);
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Erro ao carregar a lista de funcionários.';
                errorMessage.classList.add('error-message'); // Adiciona uma classe para identificar
                mainContent.appendChild(errorMessage);
            });
    }
}

// ==========================================================================
// FUNÇÃO PARA ADICIONAR EVENT LISTENERS AOS BOTÕES DE EXCLUIR
// ==========================================================================
function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const employeeId = this.dataset.employeeId;
            if (confirm(`Tem certeza que deseja excluir o funcionário com ID ${employeeId}?`)) {
                fetch(`http://127.0.0.1:5000/funcionarios/${employeeId}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (response.ok) {
                            console.log(`Funcionário com ID ${employeeId} excluído com sucesso.`);
                            // Recarregar a lista de funcionários após a exclusão
                            fetchEmployees();
                            // Opcional: Mostrar uma mensagem de sucesso para o usuário
                        } else {
                            console.error(`Erro ao excluir funcionário com ID ${employeeId}.`);
                            // Opcional: Mostrar uma mensagem de erro para o usuário
                        }
                    })
                    .catch(error => {
                        console.error('Erro na requisição de exclusão:', error);
                        // Opcional: Mostrar uma mensagem de erro para o usuário
                    });
            }
        });
    });
}
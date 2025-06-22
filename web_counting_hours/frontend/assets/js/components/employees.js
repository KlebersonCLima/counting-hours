/*
 * frontend/assets/js/components/employees.js
 * Descrição: Lógica para buscar, exibir e interagir com a lista de funcionários.
 */

// ==========================================================================
// FUNÇÃO PARA BUSCAR E EXIBIR OS FUNCIONÁRIOS
// ==========================================================================
function fetchEmployees() {
    // Evita chamadas duplicadas
    if (isFetchingEmployees) {
        console.log('Busca de funcionários já em andamento, ignorando chamada duplicada.');
        return;
    }

    if (employeesTableContainer) {
        isFetchingEmployees = true;

        // Limpa o container completamente
        employeesTableContainer.innerHTML = '';

        // Limpa mensagens anteriores
        clearPreviousMessages();

        console.log('Iniciando busca de funcionários...');

        fetch('http://127.0.0.1:5000/funcionarios')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados recebidos:', data);

                // Armazena os dados atuais
                currentEmployeesData = data;

                if (data && Array.isArray(data) && data.length > 0) {
                    createEmployeesTable(data);
                } else {
                    showNoEmployeesMessage();
                }
            })
            .catch(error => {
                console.error('Erro ao buscar funcionários:', error);
                showErrorMessage('Erro ao carregar a lista de funcionários.');
            })
            .finally(() => {
                isFetchingEmployees = false;
            });
    }
}

// ==========================================================================
// FUNÇÃO PARA LIMPAR MENSAGENS ANTERIORES
// ==========================================================================
function clearPreviousMessages() {
    const existingMessages = mainContent.querySelectorAll('.error-message, .no-data-message');
    existingMessages.forEach(message => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    });
}

// ==========================================================================
// FUNÇÃO PARA LIMPAR COMPLETAMENTE A ÁREA DE FUNCIONÁRIOS
// ==========================================================================
function clearEmployeesArea() {
    if (employeesTableContainer) {
        employeesTableContainer.innerHTML = '';
    }
    clearPreviousMessages();
    currentEmployeesData = null;
}

// ==========================================================================
// FUNÇÃO PARA CRIAR A TABELA DE FUNCIONÁRIOS
// ==========================================================================
function createEmployeesTable(employees) {
    // Limpa o container antes de criar a nova tabela
    employeesTableContainer.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('employees-table');

    // Cria o cabeçalho da tabela
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['ID', 'Foto Perfil', 'Nome', 'CPF', 'Carga Horária', 'Ações'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Cria o corpo da tabela
    const tbody = document.createElement('tbody');

    employees.forEach(employee => {
        const row = document.createElement('tr');

        // Verifica se employee é um array válido
        if (Array.isArray(employee) && employee.length >= 5) {
            // ID
            const idTd = document.createElement('td');
            idTd.textContent = employee[0] || '';
            row.appendChild(idTd);

            // Foto Perfil
            const fotoTd = document.createElement('td');

            if (employee[1] && employee[1] !== 'None') {
                // Se há foto, criar uma imagem
                const img = document.createElement('img');
                // Adicionar timestamp para evitar cache
                img.src = `http://127.0.0.1:5000/funcionarios/profile_pic/${employee[0]}?t=${Date.now()}`;
                img.alt = `Foto de ${employee[2]}`;
                img.onerror = function () {
                    // Se a imagem não carregar, mostrar ícone padrão
                    this.style.display = 'none';
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-user-circle';
                    fotoTd.appendChild(icon);
                };
                img.onload = function () {
                    // Se a imagem carregar com sucesso, garantir que está visível
                    this.style.display = 'inline-block';
                };
                fotoTd.appendChild(img);
            } else {
                // Se não há foto, mostrar ícone padrão
                const icon = document.createElement('i');
                icon.className = 'fas fa-user-circle';
                fotoTd.appendChild(icon);
            }
            row.appendChild(fotoTd);

            // Nome
            const nomeTd = document.createElement('td');
            nomeTd.textContent = employee[2] || '';
            row.appendChild(nomeTd);

            // CPF
            const cpfTd = document.createElement('td');
            cpfTd.textContent = employee[3] || '';
            row.appendChild(cpfTd);

            // Carga Horária (converter de minutos para HH:MM)
            const cargaTd = document.createElement('td');
            if (typeof employee[4] === 'number') {
                const hours = Math.floor(employee[4] / 60);
                const minutes = employee[4] % 60;
                const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                cargaTd.textContent = formattedTime;
            } else {
                cargaTd.textContent = employee[4] || '';
            }
            row.appendChild(cargaTd);

            // Ações
            const actionsTd = document.createElement('td');
            actionsTd.appendChild(createDeleteButton(employee[0], employee[2]));
            actionsTd.appendChild(createEditButton(employee[0]));
            row.appendChild(actionsTd);
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    employeesTableContainer.appendChild(table);

    // Adiciona event listeners para os botões
    addDeleteEventListeners();
}

// ==========================================================================
// FUNÇÃO PARA CRIAR BOTÃO DE EXCLUIR
// ==========================================================================
function createDeleteButton(employeeId, employeeName) {
    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('i');

    deleteIcon.classList.add('fas', 'fa-trash-alt');
    deleteButton.appendChild(deleteIcon);
    deleteButton.classList.add('delete-button');
    deleteButton.dataset.employeeId = employeeId;
    deleteButton.dataset.employeeName = employeeName;

    return deleteButton;
}

// ==========================================================================
// FUNÇÃO PARA CRIAR BOTÃO DE EDITAR
// ==========================================================================
function createEditButton(employeeId) {
    const editButton = document.createElement('button');
    const editIcon = document.createElement('i');

    editIcon.classList.add('fas', 'fa-pencil-alt');
    editButton.appendChild(editIcon);
    editButton.classList.add('edit-button');
    editButton.dataset.employeeId = employeeId;
    editButton.addEventListener('click', openEditModal);

    return editButton;
}

// ==========================================================================
// FUNÇÃO PARA MOSTRAR MENSAGEM DE NENHUM FUNCIONÁRIO
// ==========================================================================
function showNoEmployeesMessage() {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('no-data-message');
    messageContainer.style.cssText = `
        text-align: center;
        padding: 40px 20px;
        color: #BFBFBF;
        background-color: rgba(27, 28, 30, 0.8);
        border-radius: 8px;
        margin: 20px auto;
        max-width: 500px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;

    messageContainer.innerHTML = `
        <i class="fas fa-users" style="font-size: 48px; color: #007ACC; margin-bottom: 20px; display: block;"></i>
        <h3 style="margin: 0 0 15px 0; color: #BFBFBF;">Nenhum funcionário encontrado</h3>
        <p style="margin: 0; line-height: 1.5;">Realize o cadastro de um novo funcionário para começar a usar o sistema.</p>
    `;

    mainContent.appendChild(messageContainer);
}

// ==========================================================================
// FUNÇÃO PARA MOSTRAR MENSAGEM DE ERRO
// ==========================================================================
function showErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    errorContainer.style.cssText = `
        text-align: center;
        padding: 20px;
        color: #d9534f;
        background-color: rgba(217, 83, 79, 0.1);
        border: 1px solid rgba(217, 83, 79, 0.3);
        border-radius: 8px;
        margin: 20px auto;
        max-width: 500px;
    `;

    errorContainer.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
        ${message}
    `;

    mainContent.appendChild(errorContainer);
}

// ==========================================================================
// FUNÇÃO PARA ADICIONAR EVENT LISTENERS AOS BOTÕES DE EXCLUIR
// ==========================================================================
function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const employeeId = this.dataset.employeeId;
            const employeeName = this.dataset.employeeName; // Nome do funcionário

            // SweetAlert2 para confirmação de exclusão
            Swal.fire({
                title: 'Confirmar Exclusão',
                text: `Tem certeza que deseja excluir o funcionário "${employeeName}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                background: '#2c3e50',
                color: '#ecf0f1',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Usuário confirmou a exclusão
                    fetch(`http://127.0.0.1:5000/funcionarios/${employeeId}`, {
                        method: 'DELETE',
                    })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(data => {
                                    throw { status: response.status, data: data };
                                });
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log(`Funcionário "${employeeName}" excluído com sucesso.`);

                            // SweetAlert2 de sucesso
                            const message = data.message || 'Funcionário excluído com sucesso!';
                            Swal.fire({
                                title: 'Sucesso!',
                                text: message,
                                icon: 'success',
                                confirmButtonColor: '#28a745',
                                background: '#2c3e50',
                                color: '#ecf0f1',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false
                            });

                            // Recarrega a lista após um pequeno delay
                            setTimeout(() => {
                                fetchEmployees();
                            }, 500);
                        })
                        .catch(error => {
                            console.error('Erro na requisição de exclusão:', error);

                            let title, text, icon, color;

                            if (error.status === 404 && error.data.error === 'not_found') {
                                title = 'Funcionário não encontrado';
                                text = error.data.message || 'O funcionário não foi encontrado no sistema.';
                                icon = 'warning';
                                color = '#ffc107';
                            } else if (error.status === 500) {
                                title = 'Erro do Servidor';
                                text = error.data.message || 'Erro interno do servidor. Tente novamente.';
                                icon = 'error';
                                color = '#dc3545';
                            } else {
                                title = 'Erro!';
                                text = error.data.message || 'Ocorreu um erro ao excluir o funcionário.';
                                icon = 'error';
                                color = '#dc3545';
                            }

                            Swal.fire({
                                icon: icon,
                                title: title,
                                text: text,
                                confirmButtonColor: color,
                                background: '#2c3e50',
                                color: '#ecf0f1'
                            });
                        });
                }
                // Se clicou em Cancelar, não faz nada (result.dismiss === Swal.DismissReason.cancel)
            });
        });
    });
}

// ==========================================================================
// EXPORTA FUNÇÕES PARA USO EM OUTROS ARQUIVOS
// ==========================================================================
window.clearEmployeesArea = clearEmployeesArea;
window.fetchEmployees = fetchEmployees; 
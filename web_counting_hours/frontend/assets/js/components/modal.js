/*
 * frontend/assets/js/components/modal.js
 * Descrição: Lógica para controlar o modal de adicionar e editar funcionários.
 */

// ==========================================================================
// SELEÇÃO DE ELEMENTOS DO DOM (Relacionados ao Modal)
// ==========================================================================
const addEmployeeButtonModal = document.getElementById('add-employee-button');
const addEmployeeModal = document.getElementById('add-employee-modal');
const closeButton = document.querySelector('.close-button');
const cancelButton = document.querySelector('.cancel-button');
const addEmployeeForm = document.getElementById('add-employee-form');
const cpfInputModal = document.getElementById('cpf'); // CPF input dentro do modal
let currentEmployeeId = null; // Variável para armazenar o ID do funcionário sendo editado

// ==========================================================================
// FUNÇÕES DE CONTROLE DO MODAL
// ==========================================================================

// Abre o modal de adicionar funcionário
if (addEmployeeButtonModal) {
    addEmployeeButtonModal.addEventListener('click', () => {
        addEmployeeModal.style.display = 'block';
        resetModalForm(); // Garante que o formulário esteja resetado ao abrir para adicionar
    });
}

// Fecha o modal ao clicar no botão de fechar (X)
if (closeButton) {
    closeButton.addEventListener('click', () => {
        addEmployeeModal.style.display = 'none';
        resetModalForm();
    });
}

// Fecha o modal ao clicar fora da área do modal
window.addEventListener('click', (event) => {
    if (event.target == addEmployeeModal) {
        addEmployeeModal.style.display = 'none';
        resetModalForm();
    }
});

// Fecha o modal ao clicar no botão de cancelar
if (cancelButton) {
    cancelButton.addEventListener('click', () => {
        addEmployeeModal.style.display = 'none';
        resetModalForm();
    });
}

// Reseta o formulário do modal para o estado inicial (para adicionar novo funcionário)
function resetModalForm() {
    const modalTitle = document.querySelector('#add-employee-modal h2');
    if (modalTitle) {
        modalTitle.textContent = 'Adicionar Novo Funcionário';
    }
    const submitButton = document.querySelector('#add-employee-form button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Salvar';
    }
    currentEmployeeId = null; // Reseta o ID para indicar que é uma nova adição
    addEmployeeForm.reset(); // Limpa os campos do formulário
    // Define a carga normal como padrão ao adicionar
    const cargaNormalRadio = document.getElementById('carga_normal');
    if (cargaNormalRadio) {
        cargaNormalRadio.checked = true;
    }
    const cargaOutroRadio = document.getElementById('carga_outro');
    if (cargaOutroRadio) {
        cargaOutroRadio.checked = false;
    }
    const cargaHorariaOutroInput = document.getElementById('carga_horaria_outro');
    if (cargaHorariaOutroInput) {
        cargaHorariaOutroInput.value = ''; // Limpa o campo de outra carga horária
    }
}

// ==========================================================================
// LÓGICA DE FORMATAÇÃO DO CPF NO MODAL
// ==========================================================================
if (cpfInputModal) {
    cpfInputModal.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, ''); // Remove tudo que não é número
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i === 3 || i === 6) {
                formattedValue += '.';
            } else if (i === 9) {
                formattedValue += '-';
            }
            formattedValue += value[i];
        }
        this.value = formattedValue.slice(0, 14); // Limita o tamanho para 14 caracteres
    });
}

// ==========================================================================
// LÓGICA DE SUBMISSÃO DO FORMULÁRIO DO MODAL
// ==========================================================================
if (addEmployeeForm) {
    addEmployeeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const profilePic = document.getElementById('profile_pic').files[0];
        const name = document.getElementById('name').value;
        const cpf = document.getElementById('cpf').value;
        let cargaHoraria;
        const cargaNormalRadio = document.getElementById('carga_normal');
        const cargaOutroRadio = document.getElementById('carga_outro');
        const cargaHorariaOutroInput = document.getElementById('carga_horaria_outro');

        if (cargaNormalRadio.checked) {
            cargaHoraria = cargaNormalRadio.value;
        } else if (cargaOutroRadio.checked) {
            cargaHoraria = cargaHorariaOutroInput.value;
        } else {
            console.warn('Nenhuma opção de carga horária selecionada.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('cpf', cpf);
        formData.append('carga_horaria', cargaHoraria);

        // Adicionar a foto de perfil apenas se um novo arquivo foi selecionado
        if (profilePic) {
            formData.append('profile_pic', profilePic);
        }

        const method = currentEmployeeId ? 'PUT' : 'POST';
        const url = currentEmployeeId ? `http://127.0.0.1:5000/funcionarios/${currentEmployeeId}` : 'http://127.0.0.1:5000/funcionarios';

        fetch(url, {
            method: method,
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                console.log(`${method === 'PUT' ? 'Funcionário atualizado' : 'Funcionário adicionado'} com sucesso:`, data);
                addEmployeeModal.style.display = 'none';
                fetchEmployees(); // Recarrega a lista de funcionários após a operação
                currentEmployeeId = null; // Reseta o ID após a edição/adição
                resetModalForm();
                // TODO: Exibir mensagem de sucesso visualmente
            })
            .catch(error => {
                console.error(`Erro ao ${method === 'PUT' ? 'atualizar' : 'adicionar'} funcionário:`, error);
                // TODO: Exibir mensagem de erro visualmente
            });
    });
}

// ==========================================================================
// FUNÇÃO PARA ABRIR O MODAL DE EDIÇÃO
// ==========================================================================
function openEditModal() {
    currentEmployeeId = this.dataset.employeeId;
    const employeeId = this.dataset.employeeId;

    // Alterar o título do modal
    const modalTitle = document.querySelector('#add-employee-modal h2');
    if (modalTitle) {
        modalTitle.textContent = 'Editar Funcionário';
    }

    // Alterar o texto do botão de salvar
    const submitButton = document.querySelector('#add-employee-form button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Salvar Edições';
    }

    // Buscar os dados do funcionário pelo ID para preencher o formulário
    fetch(`http://127.0.0.1:5000/funcionarios/${employeeId}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(employeeData => {
            // Preencher o formulário com os dados do funcionário
            document.getElementById('name').value = employeeData.nome;
            document.getElementById('cpf').value = employeeData.cpf;

            // Lógica para preencher a carga horária
            const cargaNormalRadio = document.getElementById('carga_normal');
            const cargaOutroRadio = document.getElementById('carga_outro');
            const cargaHorariaOutroInput = document.getElementById('carga_horaria_outro');
            const cargaHorariaMinutes = employeeData.carga_horaria;
            const hours = Math.floor(cargaHorariaMinutes / 60);
            const minutes = cargaHorariaMinutes % 60;
            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            // Verifique o valor da carga horária do funcionário e selecione o radio button correto
            if (cargaHorariaMinutes === 528) { // 8 horas e 48 minutos em minutos (8 * 60 + 48)
                if (cargaNormalRadio) cargaNormalRadio.checked = true;
                if (cargaOutroRadio) cargaOutroRadio.checked = false;
                if (cargaHorariaOutroInput) cargaHorariaOutroInput.value = '';
            } else {
                if (cargaNormalRadio) cargaNormalRadio.checked = false;
                if (cargaOutroRadio) cargaOutroRadio.checked = true;
                if (cargaHorariaOutroInput) cargaHorariaOutroInput.value = formattedTime;
            }

            // Mostrar o modal
            addEmployeeModal.style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao buscar dados do funcionário para edição:', error);
            // Opcional: Mostrar uma mensagem de erro para o usuário
        });
}

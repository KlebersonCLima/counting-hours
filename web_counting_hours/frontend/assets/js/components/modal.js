/*
 * frontend/assets/js/components/modal.js
 * Descrição: Lógica para controlar o modal de adicionar e editar funcionários.
 */

// ==========================================================================
// VARIÁVEIS GLOBAIS
// ==========================================================================

let cpfOriginal = null; // Para armazenar o CPF original durante edição

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

// ==========================================================================
// FUNÇÃO PARA RESETAR O FORMULÁRIO DO MODAL
// ==========================================================================
function resetModalForm() {
    // Resetar campos do formulário
    document.getElementById('add-employee-form').reset();

    // Limpar a foto atual
    const currentProfilePic = document.getElementById('current-profile-pic');
    if (currentProfilePic) {
        currentProfilePic.style.display = 'none';
    }

    // Resetar o título do modal
    const modalTitle = document.querySelector('#add-employee-modal h2');
    if (modalTitle) {
        modalTitle.textContent = 'Adicionar Novo Funcionário';
    }

    // Resetar o texto do botão de salvar
    const submitButton = document.querySelector('#add-employee-form button[type="submit"]');
    if (submitButton) {
        submitButton.textContent = 'Salvar';
    }

    // Limpar variáveis de controle
    currentEmployeeId = null;
    cpfOriginal = null;
}

// ==========================================================================
// FUNÇÕES DE VALIDAÇÃO DE CPF
// ==========================================================================

/**
 * Verifica se o CPF já existe na base de dados
 * @param {string} cpf - CPF a ser verificado
 * @returns {Promise<boolean>} - true se existe, false caso contrário
 */
async function verificarCPFDuplicado(cpf) {
    try {
        const response = await fetch('http://127.0.0.1:5000/funcionarios/verificar-cpf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf: cpf })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Verificar o status da resposta
        if (data.status === 'cpf_existente') {
            return true; // CPF já existe
        } else if (data.status === 'cpf_valido') {
            return false; // CPF está disponível
        } else {
            console.error('Status inesperado:', data.status);
            return false;
        }
    } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        throw error; // Re-throw para tratamento no caller
    }
}

/**
 * Valida se o campo CPF está vazio ou não foi alterado
 * @param {string} cpf - CPF atual
 * @param {string} cpfOriginal - CPF original (para edição)
 * @returns {boolean} - true se vazio ou não alterado, false caso contrário
 */
function validarCampoVazioOuNaoAlterado(cpf, cpfOriginal = null) {
    const cpfLimpo = cpf.trim();

    // Se estiver vazio
    if (!cpfLimpo) {
        return true;
    }

    // Se for edição e não foi alterado
    if (cpfOriginal && cpfLimpo === cpfOriginal) {
        return true;
    }

    return false;
}

/**
 * Exibe mensagem de erro usando SweetAlert
 * @param {string} mensagem - Mensagem a ser exibida
 */
function exibirMensagemErro(mensagem) {
    Swal.fire({
        icon: 'warning',
        title: 'Validação',
        text: mensagem,
        confirmButtonColor: '#ffc107',
        background: '#2c3e50',
        color: '#ecf0f1'
    });
}

/**
 * Exibe mensagem de sucesso usando SweetAlert
 * @param {string} mensagem - Mensagem a ser exibida
 */
function exibirMensagemSucesso(mensagem) {
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: mensagem,
        confirmButtonColor: '#28a745',
        background: '#2c3e50',
        color: '#ecf0f1'
    });
}

// ==========================================================================
// CONFIGURAÇÃO DO CAMPO CPF
// ==========================================================================

// Configurar o campo CPF para aceitar apenas números
document.addEventListener('DOMContentLoaded', function () {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            // Remove tudo que não é número
            let value = e.target.value.replace(/\D/g, '');

            // Limita a 11 dígitos
            if (value.length > 11) {
                value = value.substring(0, 11);
            }

            // Aplica formatação (opcional)
            if (value.length > 0) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }

            e.target.value = value;
        });
    }
});

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
        this.value = formattedValue;
    });
}

// ==========================================================================
// LÓGICA DE SUBMISSÃO DO FORMULÁRIO DO MODAL
// ==========================================================================
if (addEmployeeForm) {
    addEmployeeForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Prevenir duplo clique
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton.disabled) {
            return;
        }
        submitButton.disabled = true;

        // Obter valores dos campos
        const name = document.getElementById('name').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const profilePic = document.getElementById('profile_pic').files[0];
        const cargaHoraria = "8:48"; // Carga horária padrão fixa

        // ==========================================================================
        // FLUXO DE VALIDAÇÃO CONFORME ESPECIFICAÇÃO
        // ==========================================================================

        // 1. Validação do nome do funcionário vazio
        if (!name) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obrigatório',
                text: 'Por favor, informe o nome do funcionário.',
                confirmButtonColor: '#ffc107',
                background: '#2c3e50',
                color: '#ecf0f1'
            });
            submitButton.disabled = false;
            return; // Não prossegue com a requisição
        }

        // 2. Validação do CPF vazio
        if (!cpf) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obrigatório',
                text: 'Por favor, informe o CPF.',
                confirmButtonColor: '#ffc107',
                background: '#2c3e50',
                color: '#ecf0f1'
            });
            submitButton.disabled = false;
            return; // Não prossegue com a requisição
        }

        // 3. Validação do CPF com menos de 11 dígitos
        const cpfNumeros = cpf.replace(/\D/g, '');
        if (cpfNumeros.length < 11) {
            Swal.fire({
                icon: 'warning',
                title: 'CPF Inválido',
                text: 'O CPF deve conter no mínimo 11 dígitos.',
                confirmButtonColor: '#ffc107',
                background: '#2c3e50',
                color: '#ecf0f1'
            });
            submitButton.disabled = false;
            return; // Não prossegue com a requisição
        }

        // 4. Validação de CPF duplicado (apenas para novos funcionários)
        if (!currentEmployeeId) {
            try {
                const cpfExiste = await verificarCPFDuplicado(cpf);
                if (cpfExiste) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'CPF Duplicado',
                        text: 'CPF já existente.',
                        confirmButtonColor: '#ffc107',
                        background: '#2c3e50',
                        color: '#ecf0f1'
                    });
                    submitButton.disabled = false;
                    return; // Não salva nem fecha o modal
                }
            } catch (error) {
                console.error('Erro ao verificar CPF:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao verificar CPF. Tente novamente.',
                    confirmButtonColor: '#dc3545',
                    background: '#2c3e50',
                    color: '#ecf0f1'
                });
                submitButton.disabled = false;
                return;
            }
        }

        // ==========================================================================
        // EXECUÇÃO DO FLUXO DE INCLUSÃO
        // ==========================================================================

        // Mostrar loading
        Swal.fire({
            title: 'Salvando...',
            text: 'Aguarde enquanto salvamos os dados.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
            background: '#2c3e50',
            color: '#ecf0f1'
        });

        const formData = new FormData();
        formData.append('name', name);
        formData.append('cpf', cpf);
        formData.append('carga_horaria', cargaHoraria);

        // Adicionar a foto de perfil apenas se um novo arquivo foi selecionado
        if (profilePic) {
            formData.append('profile_pic', profilePic);
        }

        const method = currentEmployeeId ? 'PUT' : 'POST';
        const url = currentEmployeeId ? `http://127.0.0.1:5000/funcionarios/${currentEmployeeId}` : 'http://127.0.0.1:5000/funcionarios/';

        console.log('DEBUG: Enviando requisição:', { method, url, currentEmployeeId });

        fetch(url, {
            method: method,
            body: formData,
        })
            .then(response => {
                console.log('DEBUG: Resposta recebida:', response.status, response.statusText);
                if (!response.ok) {
                    return response.json().then(data => {
                        throw { status: response.status, data: data };
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('DEBUG: Dados da resposta:', data);
                // Sucesso - CPF e nome válidos + CPF único
                const isEdit = currentEmployeeId ? true : false;
                const message = isEdit ? 'Funcionário alterado com sucesso.' : 'Funcionário incluído com sucesso.';

                console.log('DEBUG: Operação realizada com sucesso, mostrando toast...');

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: message,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#2c3e50',
                    color: '#ecf0f1',
                    didClose: () => {
                        console.log('DEBUG: Toast fechado, fechando modal e atualizando lista...');
                        // Fechar modal e atualizar lista
                        addEmployeeModal.style.display = 'none';
                        // Resetar formulário apenas se não for edição
                        if (!isEdit) {
                            resetModalForm();
                        } else {
                            // Para edição, apenas limpar o currentEmployeeId
                            currentEmployeeId = null;
                            cpfOriginal = null;
                        }
                        fetchEmployees();
                    }
                });
            })
            .catch(error => {
                console.error('Erro:', error);
                console.log('Status:', error.status);
                console.log('Dados:', error.data);

                let title, text, icon, color;

                // Verificar se é erro de rede/CORS
                if (error.message && error.message.includes('Failed to fetch')) {
                    title = 'Erro de Conexão';
                    text = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
                    icon = 'error';
                    color = '#dc3545';
                } else if (error.status === 400) {
                    if (error.data && error.data.error === 'missing_fields') {
                        title = 'Campos Obrigatórios';
                        text = 'Todos os campos são obrigatórios.';
                        icon = 'warning';
                        color = '#ffc107';
                    } else if (error.data && error.data.error === 'invalid_hours') {
                        title = 'Carga Horária Inválida';
                        text = error.data.message || 'Formato de carga horária inválido.';
                        icon = 'warning';
                        color = '#ffc107';
                    } else {
                        title = 'Dados Inválidos';
                        text = error.data ? error.data.message : 'Verifique os dados informados.';
                        icon = 'warning';
                        color = '#ffc107';
                    }
                } else if (error.status === 409 && error.data && error.data.error === 'duplicate_cpf') {
                    title = 'CPF Duplicado';
                    text = error.data.message || 'Este CPF já está cadastrado no sistema.';
                    icon = 'warning';
                    color = '#ffc107';
                } else if (error.status === 404 && error.data && error.data.error === 'not_found') {
                    title = 'Funcionário Não Encontrado';
                    text = error.data.message || 'Funcionário não encontrado.';
                    icon = 'error';
                    color = '#dc3545';
                } else if (error.status === 500) {
                    title = 'Erro do Servidor';
                    text = error.data ? error.data.message : 'Erro interno do servidor. Tente novamente.';
                    icon = 'error';
                    color = '#dc3545';
                } else {
                    title = 'Erro!';
                    text = error.data ? error.data.message : 'Ocorreu um erro inesperado. Tente novamente.';
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
            })
            .finally(() => {
                // Reabilitar o botão
                submitButton.disabled = false;
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

            // Armazenar o CPF original para validação
            cpfOriginal = employeeData.cpf;

            // Sempre marcar a carga horária padrão (8:48)
            const cargaNormalRadio = document.getElementById('carga_normal');
            if (cargaNormalRadio) cargaNormalRadio.checked = true;

            // Exibir a foto atual do funcionário (se existir)
            const currentProfilePic = document.getElementById('current-profile-pic');
            const currentProfileImg = document.getElementById('current-profile-img');
            const profilePicInput = document.getElementById('profile_pic');

            if (currentProfilePic && currentProfileImg) {
                // Verificar se o funcionário tem foto
                if (employeeData.id) {
                    const photoUrl = `http://127.0.0.1:5000/funcionarios/profile_pic/${employeeData.id}?t=${Date.now()}`;
                    currentProfileImg.src = photoUrl;
                    currentProfileImg.onerror = function () {
                        // Se a foto não carregar, ocultar o container
                        currentProfilePic.style.display = 'none';
                    };
                    currentProfileImg.onload = function () {
                        // Se a foto carregar, mostrar o container
                        currentProfilePic.style.display = 'block';
                    };
                } else {
                    currentProfilePic.style.display = 'none';
                }
            }

            // Mostrar o modal
            addEmployeeModal.style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao buscar dados do funcionário para edição:', error);
            // Opcional: Mostrar uma mensagem de erro para o usuário
        });
}
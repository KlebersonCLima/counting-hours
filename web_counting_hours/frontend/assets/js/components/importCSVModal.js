document.addEventListener("DOMContentLoaded", () => {
    const importCSVButton = document.querySelector(".import-csv");
    const importModal = document.getElementById("import-csv-modal");
    const closeBtn = importModal.querySelector(".close-button");

    importCSVButton.addEventListener("click", openImportCsvModal);
    closeBtn.addEventListener("click", closeImportCsvModal);

    window.addEventListener("click", (event) => {
        if (event.target === importModal) {
            closeImportCsvModal();
        }
    });

    // ADICIONAR EVENT LISTENER APENAS UMA VEZ AQUI
    const employeeSelect = document.getElementById('employee-select');
    if (employeeSelect) {
        employeeSelect.addEventListener('change', fillEmployeeData);
    }
});

// ==========================================================================
// FUNÇÃO PARA CARREGAR FUNCIONÁRIOS NO COMBO
// ==========================================================================
function loadEmployeesIntoSelect() {
    const employeeSelect = document.getElementById('employee-select');
    
    // Limpa opções existentes
    employeeSelect.innerHTML = '<option value=""> </option>';
    
    fetch(`http://127.0.0.1:5000/funcionarios`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(funcionarios => {
            console.log('Funcionários recebidos:', funcionarios); 
            
            funcionarios.forEach(funcionario => {
                console.log('🔍 Processando funcionário:', funcionario);
                
                const option = document.createElement('option');

                option.value = funcionario[0];
                option.textContent = funcionario[2]; 
                employeeSelect.appendChild(option);
                
                console.log('Option criada - Value:', option.value, 'Text:', option.textContent); 
            });
            
        })
        .catch(error => {
            console.error('Erro ao carregar funcionários:', error);
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Erro ao carregar funcionários';
            option.disabled = true;
            employeeSelect.appendChild(option);
        });
}

// ==========================================================================
// FUNÇÃO PARA PREENCHER OS DADOS DO FUNCIONÁRIO
// ==========================================================================
function fillEmployeeData() {
    const employeeSelect = document.getElementById('employee-select');
    if (!employeeSelect) {
        console.error('Elemento employee-select não encontrado');
        return;
    }

    const selectedEmployeeId = employeeSelect.value;
    console.log('ID selecionado:', selectedEmployeeId);
    console.log('Tipo do ID:', typeof selectedEmployeeId);
    console.log('Select HTML:', employeeSelect.outerHTML); // DEBUG COMPLETO

    // Referências aos campos
    const employeeNameField = document.getElementById('employee-name');
    const employeeCpfField = document.getElementById('employee-cpf');
    const employeeHoursField = document.getElementById('employee-hours');

    // VALIDAÇÃO MELHORADA
    if (!selectedEmployeeId || selectedEmployeeId === "") {
        console.log('Nenhum funcionário selecionado, limpando campos...');
        employeeNameField.value = '';
        employeeCpfField.value = '';
        employeeHoursField.value = '';
        return;
    }

    // ADICIONAR LOADING VISUAL (OPCIONAL)
    employeeNameField.value = 'Carregando...';
    employeeCpfField.value = 'Carregando...';
    employeeHoursField.value = 'Carregando...';

    // Fazer fetch do funcionário específico
    fetch(`http://127.0.0.1:5000/funcionarios/${selectedEmployeeId}`)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { 
                    throw new Error(`Erro HTTP: ${response.status} - ${text}`); 
                });
            }
            return response.json();
        })
        .then(employeeData => {
            console.log('Dados do funcionário recebidos:', employeeData);
            
            // CORREÇÃO: Usar índices se vier como array também
            if (Array.isArray(employeeData)) {
                employeeNameField.value = employeeData[2] || ''; // Nome na posição 2
                employeeCpfField.value = employeeData[3] || '';  // CPF na posição 3
                
                // Converter carga horária minutos para HH:MM
                const cargaHorariaMinutes = employeeData[4] || 0; // Carga horária na posição 4
                const hours = Math.floor(cargaHorariaMinutes / 60);
                const minutes = cargaHorariaMinutes % 60;
                const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                employeeHoursField.value = formattedTime;
            } else {
                // Se vier como objeto (caso normal)
                employeeNameField.value = employeeData.nome || '';
                employeeCpfField.value = employeeData.cpf || '';
                
                const cargaHorariaMinutes = employeeData.carga_horaria || 0;
                const hours = Math.floor(cargaHorariaMinutes / 60);
                const minutes = cargaHorariaMinutes % 60;
                const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                employeeHoursField.value = formattedTime;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados do funcionário:', error);
            employeeNameField.value = '';
            employeeCpfField.value = '';
            employeeHoursField.value = '';
        });
}

// ==========================================================================
// FUNÇÃO PARA ABRIR O MODAL
// ==========================================================================
function openImportCsvModal() {
    const importCsvModal = document.getElementById('import-csv-modal');
    
    // Limpar os campos primeiro
    document.getElementById('employee-name').value = '';
    document.getElementById('employee-cpf').value = '';
    document.getElementById('employee-hours').value = '';
    document.getElementById('employee-select').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    document.getElementById('csv_file').value = '';
    
    // Carregar os funcionários DEPOIS de limpar
    loadEmployeesIntoSelect();
    
    // Mostrar o modal
    importCsvModal.classList.add('active');
}

// ==========================================================================
// EVENT LISTENER DO FORMULÁRIO
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    const importCsvForm = document.getElementById('import-csv-form');
    if (importCsvForm) {
        importCsvForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processarCSVeGerarPlanilha();
        });
    }
});

// ==========================================================================
// FUNÇÃO PARA MOSTRAR POPUP PERSONALIZADO
// ==========================================================================
function showCustomAlert(message, type = 'error') {
    // Remove popup existente se houver
    const existingPopup = document.getElementById('custom-alert');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Criar popup
    const popup = document.createElement('div');
    popup.id = 'custom-alert';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content ${type}">
                <div class="popup-header">
                    <h3>${type === 'error' ? '❌ Erro' : type === 'success' ? '✅ Sucesso' : 'ℹ️ Aviso'}</h3>
                </div>
                <div class="popup-body">
                    <p>${message}</p>
                </div>
                <div class="popup-footer">
                    <button onclick="closeCustomAlert()" class="popup-btn">OK</button>
                </div>
            </div>
        </div>
    `;

    // Estilos CSS inline
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
    `;

    const style = document.createElement('style');
    style.textContent = `
        .popup-overlay {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .popup-content {
            background: rgba(27, 28, 30, 0.95);
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            animation: popupIn 0.3s ease;
            color: #BFBFBF;
        }

        .popup-content.error { 
            border-top: 4px solid #d9534f; 
        }

        .popup-content.success { 
            border-top: 4px solid #5cb85c; 
        }

        .popup-content.warning { 
            border-top: 4px solid #ff8c00; 
        }

        .popup-header {
            padding: 20px 20px 0;
            text-align: center;
        }

        .popup-header h3 {
            margin: 0;
            font-size: 18px;
            color: #BFBFBF;
        }

        .popup-body {
            padding: 15px 20px;
            text-align: center;
        }

        .popup-body p {
            margin: 0;
            color: #BFBFBF;
            line-height: 1.5;
        }

        .popup-footer {
            padding: 0 20px 20px;
            text-align: center;
        }

        .popup-btn {
            background: #007ACC;
            color: white;
            border: none;
            padding: 10px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s ease;
        }

        .popup-btn:hover {
            background: #005A9F;
        }

        .popup-btn.cancel {
            background: transparent;
            color: #BFBFBF;
            border: 1px solid #BFBFBF;
            margin-left: 10px;
        }

        .popup-btn.cancel:hover {
            background: rgba(191, 191, 191, 0.1);
        }

        .popup-btn.error {
            background: #d9534f;
        }

        .popup-btn.error:hover {
            background: #c9302c;
        }

        .popup-btn.success {
            background: #5cb85c;
        }

        .popup-btn.success:hover {
            background: #449d44;
        }

        @keyframes popupIn {
            from { 
                transform: scale(0.7); 
                opacity: 0; 
            }
            to { 
                transform: scale(1); 
                opacity: 1; 
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(popup);
}

function closeCustomAlert() {
    const popup = document.getElementById('custom-alert');
    if (popup) {
        popup.remove();
    }
}

// ==========================================================================
// FUNÇÃO PARA VALIDAR FORMULÁRIO
// ==========================================================================
function validarFormulario() {
    const employeeId = document.getElementById('employee-select').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const csvFile = document.getElementById('csv_file').files[0];

    // Validar funcionário selecionado
    if (!employeeId || employeeId === '') {
        showCustomAlert('Por favor, selecione um funcionário.', 'error');
        return false;
    }

    // Validar data inicial
    if (!startDate) {
        showCustomAlert('Por favor, selecione a data inicial.', 'error');
        return false;
    }

    // Validar data final
    if (!endDate) {
        showCustomAlert('Por favor, selecione a data final.', 'error');
        return false;
    }

    // Validar se data final não é menor que inicial
    const dataInicial = new Date(startDate);
    const dataFinal = new Date(endDate);
    
    if (dataFinal < dataInicial) {
        showCustomAlert('A data final não pode ser menor que a data inicial.', 'error');
        return false;
    }

    // Validar arquivo CSV
    if (!csvFile) {
        showCustomAlert('Por favor, selecione um arquivo CSV.', 'error');
        return false;
    }

    // Verificar se é realmente um arquivo CSV
    if (!csvFile.name.toLowerCase().endsWith('.csv')) {
        showCustomAlert('Por favor, selecione um arquivo CSV válido.', 'error');
        return false;
    }

    return true;
}

// ==========================================================================
// FUNÇÃO PRINCIPAL - PROCESSAR CSV E GERAR PLANILHA
// ==========================================================================
async function processarCSVeGerarPlanilha() {
    console.log('Iniciando processamento...');

    // Validar formulário primeiro
    if (!validarFormulario()) {
        return;
    }

    // Mostrar loading
    showCustomAlert('Processando dados, aguarde...', 'warning');

    try {
        // Coletar dados do modal
        const formData = new FormData();
        formData.append('csv_file', document.getElementById('csv_file').files[0]);
        formData.append('employee_id', document.getElementById('employee-select').value);
        formData.append('employee_name', document.getElementById('employee-name').value);
        formData.append('employee_cpf', document.getElementById('employee-cpf').value);
        formData.append('employee_hours', document.getElementById('employee-hours').value);
        formData.append('start_date', document.getElementById('start-date').value);
        formData.append('end_date', document.getElementById('end-date').value);

        console.log('Enviando dados para o servidor...');

        // Enviar para Python
        const response = await fetch('http://127.0.0.1:5000/gerar-planilha', {
            method: 'POST',
            body: formData
        });

        // Fechar popup de loading
        closeCustomAlert();

        if (response.ok) {
            const blob = await response.blob();
            
            // Download automático
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'relatorio-ponto.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Sucesso
            showCustomAlert('Planilha gerada com sucesso!', 'success');
            closeImportCsvModal();
            
        } else {
            const errorText = await response.text();
            showCustomAlert(`Erro no servidor: ${errorText}`, 'error');
        }

    } catch (error) {
        closeCustomAlert();
        console.error('Erro:', error);
        showCustomAlert(`Erro ao processar: ${error.message}`, 'error');
    }
}

// ==========================================================================
// FUNÇÃO PARA FECHAR O MODAL
// ==========================================================================
function closeImportCsvModal() {
    const importCsvModal = document.getElementById('import-csv-modal');
    importCsvModal.classList.remove('active');
}

/*
 * frontend/assets/js/components/importCSVModal.js
 * Descrição: Lógica para o modal de importação CSV com SweetAlert2
 */

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

    // Event listener para o select de funcionários
    const employeeSelect = document.getElementById('employee-select');
    if (employeeSelect) {
        employeeSelect.addEventListener('change', fillEmployeeData);
    }

    // Event listener para o formulário
    const importCsvForm = document.getElementById('import-csv-form');
    if (importCsvForm) {
        importCsvForm.addEventListener('submit', function (e) {
            e.preventDefault();
            processarCSVeGerarPlanilha();
        });
    }
});

// ==========================================================================
// FUNÇÃO PARA CARREGAR FUNCIONÁRIOS NO COMBO
// ==========================================================================
function loadEmployeesIntoSelect() {
    const employeeSelect = document.getElementById('employee-select');

    // Limpa opções existentes
    employeeSelect.innerHTML = '<option value="">Selecione um funcionário...</option>';

    fetch(`http://127.0.0.1:5000/funcionarios`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(funcionarios => {
            funcionarios.forEach(funcionario => {
                const option = document.createElement('option');
                option.value = funcionario[0];
                option.textContent = funcionario[2];
                employeeSelect.appendChild(option);
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
    const employeeNameField = document.getElementById('employee-name');
    const employeeCpfField = document.getElementById('employee-cpf');
    const employeeHoursField = document.getElementById('employee-hours');

    // Limpar campos se nenhum funcionário selecionado
    if (!selectedEmployeeId || selectedEmployeeId === "") {
        employeeNameField.value = '';
        employeeCpfField.value = '';
        employeeHoursField.value = '';
        return;
    }

    // Mostrar loading
    employeeNameField.value = 'Carregando...';
    employeeCpfField.value = 'Carregando...';
    employeeHoursField.value = 'Carregando...';

    // Buscar dados do funcionário
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
            // Verificar se os dados vieram como array ou objeto
            let nome, cpf, cargaHorariaMinutes;

            if (Array.isArray(employeeData)) {
                // Se vier como array (formato antigo)
                nome = employeeData[2] || '';
                cpf = employeeData[3] || '';
                cargaHorariaMinutes = employeeData[4] || 0;
            } else {
                // Se vier como objeto (formato novo)
                nome = employeeData.nome || '';
                cpf = employeeData.cpf || '';
                cargaHorariaMinutes = employeeData.carga_horaria || 0;
            }

            // Converter carga horária de minutos para HH:MM
            const hours = Math.floor(cargaHorariaMinutes / 60);
            const minutes = cargaHorariaMinutes % 60;
            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            employeeNameField.value = nome;
            employeeCpfField.value = cpf;
            employeeHoursField.value = formattedTime;
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

    // Limpar os campos
    document.getElementById('employee-name').value = '';
    document.getElementById('employee-cpf').value = '';
    document.getElementById('employee-hours').value = '';
    document.getElementById('employee-select').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    document.getElementById('csv_file').value = '';

    // Carregar funcionários
    loadEmployeesIntoSelect();

    // Mostrar o modal
    importCsvModal.classList.add('active');
}

// ==========================================================================
// FUNÇÃO PARA VALIDAR FORMULÁRIO COM SWEETALERT2
// ==========================================================================
function validarFormulario() {
    const employeeId = document.getElementById('employee-select').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const csvFile = document.getElementById('csv_file').files[0];

    // Validar funcionário selecionado
    if (!employeeId || employeeId === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obrigatório',
            text: 'Por favor, selecione um funcionário.',
            confirmButtonColor: '#ffc107',
            background: '#2c3e50',
            color: '#ecf0f1'
        });
        return false;
    }

    // Validar data inicial
    if (!startDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obrigatório',
            text: 'Por favor, preencha a data inicial.',
            confirmButtonColor: '#ffc107',
            background: '#2c3e50',
            color: '#ecf0f1'
        });
        return false;
    }

    // Validar data final
    if (!endDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obrigatório',
            text: 'Por favor, preencha a data final.',
            confirmButtonColor: '#ffc107',
            background: '#2c3e50',
            color: '#ecf0f1'
        });
        return false;
    }

    // Validar se data final não é menor que inicial
    const dataInicial = new Date(startDate);
    const dataFinal = new Date(endDate);

    if (dataFinal < dataInicial) {
        Swal.fire({
            icon: 'warning',
            title: 'Data Inválida',
            text: 'A data final não pode ser menor que a data inicial.',
            confirmButtonColor: '#ffc107',
            background: '#2c3e50',
            color: '#ecf0f1'
        });
        return false;
    }

    // Validar arquivo CSV
    if (!csvFile) {
        Swal.fire({
            icon: 'warning',
            title: 'Campo Obrigatório',
            text: 'Por favor, selecione um arquivo CSV.',
            confirmButtonColor: '#ffc107',
            background: '#2c3e50',
            color: '#ecf0f1'
        });
        return false;
    }

    // Verificar se é realmente um arquivo CSV
    if (!csvFile.name.toLowerCase().endsWith('.csv')) {
        Swal.fire({
            icon: 'warning',
            title: 'Arquivo Inválido',
            text: 'Por favor, selecione um arquivo CSV válido.',
            confirmButtonColor: '#ffc107',
            background: '#2c3e50',
            color: '#ecf0f1'
        });
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

    // Mostrar loading com SweetAlert2
    Swal.fire({
        title: 'Processando dados...',
        text: 'Aguarde enquanto analisamos o CSV.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
        background: '#2c3e50',
        color: '#ecf0f1'
    });

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

        console.log('Enviando CSV para análise...');

        // Primeiro, enviar CSV para análise de dias incompletos
        const response = await fetch('http://127.0.0.1:5000/funcionarios/processar-csv', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro no servidor: ${errorText}`);
        }

        const result = await response.json();
        const diasIncompletos = result.dias_incompletos || [];
        const totalDiasIncompletos = result.total_dias_incompletos || 0;

        console.log(`Encontrados ${totalDiasIncompletos} dias com pontos incompletos`);

        // Se não há dias incompletos, gerar planilha diretamente
        if (totalDiasIncompletos === 0) {
            await gerarPlanilhaFinal({});
            return;
        }

        // Processar justificativas para cada dia incompleto
        const justificativas = {};

        for (let i = 0; i < diasIncompletos.length; i++) {
            const dia = diasIncompletos[i];
            const justificativa = await solicitarJustificativa(dia.data, i + 1, totalDiasIncompletos, dia.motivo);

            if (justificativa === null) {
                // Usuário cancelou
                Swal.fire({
                    icon: 'info',
                    title: 'Processo Cancelado',
                    text: 'O processamento foi cancelado pelo usuário.',
                    confirmButtonColor: '#6c757d',
                    background: '#2c3e50',
                    color: '#ecf0f1'
                });
                return;
            }

            justificativas[dia.data_iso] = justificativa;
        }

        // Gerar planilha final com justificativas
        await gerarPlanilhaFinal(justificativas);

    } catch (error) {
        console.error('Erro:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro de Processamento',
            text: `Erro ao processar: ${error.message}`,
            confirmButtonColor: '#dc3545',
            background: '#2c3e50',
            color: '#ecf0f1'
        });
    }
}

// ==========================================================================
// FUNÇÃO PARA SOLICITAR JUSTIFICATIVA
// ==========================================================================
async function solicitarJustificativa(data, index, total, motivo) {
    let titulo = `Dia ${data}`;
    let descricao = '';

    if (motivo === 'dia_ausente') {
        titulo = `Dia ${data} sem ponto registrado`;
        descricao = 'Este dia não possui nenhum registro de ponto no CSV.';
    } else if (motivo.startsWith('ponto_incompleto_')) {
        const pontosVazios = motivo.split('_')[2];
        titulo = `Dia ${data} com ponto incompleto`;
        descricao = `Este dia possui ${pontosVazios} ponto(s) não registrado(s) no CSV.`;
    }

    return new Promise((resolve) => {
        Swal.fire({
            title: titulo,
            html: `
                <p style="margin-bottom: 10px; color: #ecf0f1; font-size: 14px;">${descricao}</p>
                <p style="margin-bottom: 20px;">Por favor selecione uma justificativa (${index}/${total}):</p>
                <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0;">
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <input type="radio" id="feriado" name="justificativa" value="FERIADO" style="margin-right: 8px;">
                            <label for="feriado" style="cursor: pointer; margin: 0;">🏖️ Feriado</label>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <input type="radio" id="folga" name="justificativa" value="FOLGA" style="margin-right: 8px;">
                            <label for="folga" style="cursor: pointer; margin: 0;">🛌 Folga</label>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <input type="radio" id="atestado" name="justificativa" value="ATESTADO" style="margin-right: 8px;">
                            <label for="atestado" style="cursor: pointer; margin: 0;">🏥 Atestado</label>
                        </div>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            background: '#2c3e50',
            color: '#ecf0f1',
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: () => {
                const selected = document.querySelector('input[name="justificativa"]:checked');
                if (!selected) {
                    Swal.showValidationMessage('Você deve selecionar uma justificativa!');
                    return false;
                }
                return selected.value;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(result.value);
            } else {
                resolve(null); // Cancelado
            }
        });
    });
}

// ==========================================================================
// FUNÇÃO PARA GERAR PLANILHA EXCEL FINAL
// ==========================================================================
async function gerarPlanilhaFinal(justificativas) {
    try {
        console.log('🔍 DEBUG: Iniciando geração de planilha...');
        console.log('📝 DEBUG: Justificativas recebidas:', justificativas);

        // Mostrar loading
        Swal.fire({
            title: 'Gerando planilha Excel...',
            text: 'Aguarde enquanto geramos o arquivo formatado com base no CSV original.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
            background: '#2c3e50',
            color: '#ecf0f1'
        });

        // Ler conteúdo do arquivo CSV original
        const csvFile = document.getElementById('csv_file').files[0];
        console.log('📄 DEBUG: Arquivo CSV:', csvFile);

        const csvContent = await csvFile.text();
        console.log('📄 DEBUG: Conteúdo CSV (primeiros 200 chars):', csvContent.substring(0, 200));

        // Coletar informações do funcionário
        const employeeName = document.getElementById('employee-name').value;
        const employeeCpf = document.getElementById('employee-cpf').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        console.log('👤 DEBUG: Dados do funcionário:', {
            employeeName,
            employeeCpf,
            startDate,
            endDate
        });

        // Preparar dados para envio
        const requestData = {
            csv_content: csvContent,
            justificativas: justificativas,
            employee_name: employeeName,
            employee_cpf: employeeCpf,
            start_date: startDate,
            end_date: endDate
        };

        console.log('📤 DEBUG: Dados para envio:', requestData);

        // Enviar para gerar planilha Excel final
        console.log('🔄 DEBUG: Enviando requisição...');
        const response = await fetch('http://127.0.0.1:5000/funcionarios/gerar-planilha-final', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        console.log('📡 DEBUG: Status da resposta:', response.status);
        console.log('📡 DEBUG: Headers da resposta:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ DEBUG: Erro na resposta:', errorText);
            throw new Error(`Erro ao gerar planilha: ${errorText}`);
        }

        // Download automático
        console.log('📥 DEBUG: Iniciando download...');
        const blob = await response.blob();
        console.log('📦 DEBUG: Blob criado, tamanho:', blob.size, 'bytes');
        console.log('📦 DEBUG: Tipo do blob:', blob.type);

        const url = window.URL.createObjectURL(blob);
        console.log('🔗 DEBUG: URL criada:', url);

        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_completo_${new Date().toISOString().slice(0, 10)}.xlsx`;
        console.log('📁 DEBUG: Nome do arquivo:', a.download);

        document.body.appendChild(a);
        console.log('🖱️ DEBUG: Clicando no link...');
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log('✅ DEBUG: Download concluído!');

        // Sucesso
        Swal.fire({
            icon: 'success',
            title: 'Planilha gerada com sucesso!',
            text: 'A planilha Excel foi criada com base no CSV original e baixada automaticamente.',
            confirmButtonColor: '#28a745',
            background: '#2c3e50',
            color: '#ecf0f1'
        });

        closeImportCsvModal();

    } catch (error) {
        console.error('❌ DEBUG: Erro ao gerar planilha final:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro ao Gerar Planilha',
            text: `Erro: ${error.message}`,
            confirmButtonColor: '#dc3545',
            background: '#2c3e50',
            color: '#ecf0f1'
        });
    }
}

// ==========================================================================
// FUNÇÃO PARA FECHAR O MODAL
// ==========================================================================
function closeImportCsvModal() {
    const importCsvModal = document.getElementById('import-csv-modal');
    importCsvModal.classList.remove('active');
}

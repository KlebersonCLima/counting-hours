/*
 * frontend/assets/js/globals.js
 * Descrição: Variáveis globais compartilhadas entre todos os componentes
 */

// ==========================================================================
// VARIÁVEIS GLOBAIS DO DOM
// ==========================================================================

// Elementos da sidebar
const toggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

// Elementos de navegação
const homeButton = document.querySelector('.home-button');
const employeesButton = document.querySelector('.employees-button');
const clockContainer = document.querySelector('.clock-container');
const mainContent = document.querySelector('.main-content');
const mainTitleElement = document.querySelector('.title');
const employeesTitleElement = document.getElementById('employees-title');

// Elementos de funcionários
const employeesTableContainer = document.getElementById('employees-table-container');
const addEmployeeButtonModal = document.getElementById('add-employee-button');

// Elementos do modal
const addEmployeeModal = document.getElementById('add-employee-modal');
const closeButton = addEmployeeModal ? addEmployeeModal.querySelector('.close-button') : null;
const cancelButton = addEmployeeModal ? addEmployeeModal.querySelector('.cancel-button') : null;
const addEmployeeForm = document.getElementById('add-employee-form');
const cpfInputModal = document.getElementById('cpf');

// Elemento do relógio para controle de z-index
const clockElement = document.querySelector('.clock');

// ==========================================================================
// VARIÁVEIS DE CONTROLE
// ==========================================================================
let hoverTimeout;
let currentEmployeeId = null;
let isFetchingEmployees = false;
let currentEmployeesData = null;

// ==========================================================================
// CONTROLE DE Z-INDEX DO RELÓGIO PARA MODAIS
// ==========================================================================

// Função para esconder o relógio atrás dos modais
function hideClockBehindModal() {
    if (clockElement) {
        clockElement.style.zIndex = '-1';
    }
}

// Função para mostrar o relógio acima dos modais
function showClockAboveModal() {
    if (clockElement) {
        clockElement.style.zIndex = '1';
    }
}

// Aguardar o SweetAlert carregar e então interceptar
document.addEventListener('DOMContentLoaded', function () {
    // Aguardar um pouco para o SweetAlert carregar
    setTimeout(() => {
        if (window.Swal) {
            // Interceptar abertura de modais SweetAlert
            const originalSwalFire = window.Swal.fire;
            window.Swal.fire = function (...args) {
                hideClockBehindModal();
                return originalSwalFire.apply(this, args).finally(() => {
                    showClockAboveModal();
                });
            };

            // Interceptar fechamento de modais SweetAlert
            const originalClose = window.Swal.close;
            window.Swal.close = function () {
                showClockAboveModal();
                return originalClose.apply(this, arguments);
            };
        }
    }, 100);
}); 
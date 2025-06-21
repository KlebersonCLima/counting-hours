<a name="top"></a>

<div align="center">
    <img width="94" height="94" src="https://img.icons8.com/3d-fluency/94/clock.png" alt="clock"/>
    <h1><strong>Counting Hours</strong></h1>
    <p><em>Automatize o controle de horas trabalhadas e otimize a produtividade com precisão.</em></p>
</div>

---

## Sumário

- [Visão Geral](#visão-geral)
- [Lean Inception](#lean-inception)
- [Persona](#persona)
- [Funcionalidades Atuais](#funcionalidades-atuais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Execução](#configuração-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Próximos Passos](#próximos-passos)
- [Licença](#licença)

---

## Visão Geral

Aplicação web desenvolvida para automatizar a geração de relatórios de ponto dos colaboradores, otimizando o processo de envio dessas informações para a contabilidade.
O Counting Hours tem como objetivo simplificar a contabilização das horas trabalhadas, permitindo o registro de colaboradores com suas respectivas cargas horárias. Esses dados são utilizados como base para a geração de relatórios que indicam eventuais saldos de horas, como horas extras ou débitos.

[🔝](#top)

## Lean Inception

| **Aspecto**                    | **Descrição**                             |
| ------------------------------ | ----------------------------------------- |
| **Destinatário**               | Head de Operações da empresa **Lucro+**    |
| **Necessidade**                | Busca por uma solução mais eficiente para controlar e monitorar as horas trabalhadas pelos colaboradores, com foco na gestão de horas extras e horas a serem compensadas.    |
| **Nome do Produto**            | **Counting Hours**                    |
| **Categoria**                  | Sistema de gerenciamento de horas de trabalho e ponto eletrônico.   |
| **Benefício Principal**        | Permite calcular automaticamente as horas extras e as horas em débito dos colaboradores, com base nos registros do sistema de ponto da empresa, auxiliando a Head de Operações a supervisionar e otimizar a carga horária de forma eficiente. |
| **Diferencial em Relação às Alternativas**         | Diferente de sistemas tradicionais de ponto ou planilhas manuais, que requerem intervenções frequentes e estão sujeitos a erros humanos.  |
| **Valor Agregado**             | Automatiza o cálculo das horas de trabalho e gera relatórios precisos, proporcionando um controle mais eficiente e reduzindo a suscetibilidade a erros. Adicionalmente, o sistema permite visualizar os colaboradores com mais horas trabalhadas, sendo útil para análise de bonificações. Outro diferencial é a possibilidade de exportar uma planilha do Excel com todos os registros do colaborador selecionado, proporcionando à Head de Operações uma ferramenta prática para reuniões e feedbacks sobre a evolução do colaborador.   |

[🔝](#top)

---

## Persona

<div align="left">
  <div style="
    width: 100px;
    height: 100px;
    background: linear-gradient(to right, #ff8c00, #ff0080);
    border-radius: 50%;
    padding: 2px;
    display: inline-block;
  ">
    <img src="aux_counting_hours/images/img00.jfif" alt="Imagem da Persona"
         width="100" height="100"
         style="border-radius: 50%; display: block;" />
  </div>
</div>

| **Aspecto**                | **Descrição**                                                        |
|----------------------------|----------------------------------------------------------------------|
| **Nome**                   | Maria Andrade                                                        |
| **Idade**                  | 27                                                                   |
| **Cargo**                  | Head de Operações                                                    |
| **Empresa**                | Lucro+                                                               |
| **Responsabilidades**      | Gerenciar a operação e eficiência dos processos internos, especialmente o controle de horas e produtividade dos colaboradores.  |
| **Desafios**               | Precisa de uma solução eficiente para supervisionar as horas de trabalho dos colaboradores, assegurando que todos cumpram suas jornadas e identificando de forma prática horas extras e devedoras.    |
| **Objetivos**              | Melhorar a precisão e o controle do ponto eletrônico, reduzir erros manuais e gerar relatórios detalhados para tomadas de decisão mais rápidas.|
| **Soluções Esperadas**     | Um sistema que calcule automaticamente as horas trabalhadas, visualize colaboradores que merecem bonificações, e permita exportar dados para reuniões e feedbacks. |

[🔝](#top)

---

## Funcionalidades Atuais

- **Cadastro de Funcionários:** Permite adicionar informações básicas dos funcionários, como nome, CPF e carga horária.
- **Gerenciamento da Carga Horária:** Define a carga horária padrão de cada funcionário, essencial para a contabilização de horas.
- **Interface de Usuário Intuitiva:** Uma interface web simples e fácil de usar para gerenciar os funcionários.

[🔝](#top)

---

## Tecnologias Utilizadas

- **Frontend:** HTML, CSS e JavaScript
- **Backend:** Python, Flask
- **Banco de Dados:** SQLite

[🔝](#top)

---

## Pré-requisitos

Certifique-se de ter o **Python 3.13** instalado em seu sistema. As dependências do backend serão instaladas utilizando o `pip`.

[🔝](#top)

---

## Configuração e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/JulesElo/Counting-Hours.git
    cd web_counting_hours
    ```

2.  **Navegue até o diretório do backend:**
    ```bash
    cd backend
    ```

3.  **Instale as dependências do backend:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Certifique-se de que o arquivo `requirements.txt` contenha `Flask` e `Flask-CORS`.)*

4.  **Execute o backend:**
    ```bash
    py main.py
    ```
    O backend estará rodando em `http://127.0.0.1:5000/` por padrão.

5.  **Abra o arquivo `frontend/index.html` no seu navegador web.**

[🔝](#top)

---

## Estrutura do Projeto

```bash
C:.
├───aux_counting_hours
│   └───images
│       └───img00.jfif
├───web_counting_hours
│   │   main.py
│   │
│   ├───backend
│   │   │   config.py
│   │   │   requirements.txt
│   │   │   __init__.py
│   │   │
│   │   ├───app
│   │   │   │   database.py
│   │   │   │   utils.py
│   │   │   │   __init__.py
│   │   │   │
│   │   │   └───routes
│   │   │           employee_routes.py
│   │   │           __init__.py
│   │   │
│   │   ├───data
│   │   │       funcionarios.db
│   │   │
│   │   └───uploads
│   │
│   └───frontend
│       │   index.html
│       │
│       └───assets
│           ├───css
│           │   │   base.css
│           │   │   layout.css
│           │   │   style.css
│           │   │
│           │   └───components
│           │           clock.css
│           │           employees-table.css
│           │           modal.css
│           │           sidebar.css
│           │
│           ├───images
│           │       clock.png
│           │
│           └───js
│               │   main.js
│               │   navigation.js
│               │
│               └───components
│                       clock.js
│                       employees.js
│                       modal.js
│                       sidebar.js
├───.gitignore
├───LICENSE
└───README.md
```

[🔝](#top)

---

## Próximos Passos

- Adicionar um novo banco de dados para armazenar as horas dos funcionários e gerar relatórios precisos de horas trabalhadas e saldos de horas por período.
- Implementar um dashboard para visualizar colaboradores com mais horas em débito e mais horas extras.

[🔝](#top)

---

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para obter mais detalhes.

[🔝](#top)
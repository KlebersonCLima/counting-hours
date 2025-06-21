# main.py
from datetime import datetime
from data_processing import load_and_clean_data
from excel_report import create_and_fill_excel_report

def main():
    """
    Função principal para gerar o relatório de espelho de ponto.
    Coleta as informações do usuário e coordena o processo de geração.
    """
    print("Por favor, insira os dados para o relatório:")
    employee_name = input("Nome do funcionário: ")
    employee_cpf = input("CPF do funcionário: ")
    company_cnpj = "41.589.570/0001-46"  # CNPJ fixo
    start_date_str = input("Data inicial (ex: 01/01/2025): ")
    end_date_str = input("Data final (ex: 31/05/2025): ")
    daily_workload_str = input("Carga horária diária (ex: 08:00): ")
    csv_file_path = "Jules Lima 01-01-25 - 25-05-25-Espelho de ponto.csv" # input("Caminho para o arquivo CSV (ex: data.csv): ")

    # Converte a carga horária para um valor que o Excel entende como tempo
    daily_workload_excel_value = 0.0
    try:
        hours, minutes = map(int, daily_workload_str.split(':'))
        daily_workload_excel_value = (hours / 24.0) + (minutes / (24.0 * 60.0))
    except ValueError:
        print(f"Aviso: Formato de carga horária diária inválido '{daily_workload_str}'. Usando 08:00 como padrão.")
        daily_workload_excel_value = (8 / 24.0)

    print("\n--- Processando dados ---")
    df, point_cols_names, data_col_name = load_and_clean_data(csv_file_path)

    if df is None:
        print("Erro: Não foi possível processar os dados do CSV. Encerrando.")
        return

    # Gera o nome do arquivo de saída
    filename_prefix = "Controle de Ponto -"
    first_name = employee_name.split()[0] if employee_name else "Espelho"
    output_filename = f"{filename_prefix} {first_name}.xlsx"

    print("\n--- Gerando relatório Excel ---")
    create_and_fill_excel_report(
        dataframe=df,
        output_filename=output_filename,
        employee_name=employee_name,
        employee_cpf=employee_cpf,
        company_cnpj=company_cnpj,
        start_date=start_date_str,
        end_date=end_date_str,
        daily_workload_excel_value=daily_workload_excel_value,
        point_columns_names=point_cols_names,
        date_column_name=data_col_name
    )

    print(f"\nProcesso concluído! Planilha '{output_filename}' criada com sucesso!")


if __name__ == "__main__":
    main()
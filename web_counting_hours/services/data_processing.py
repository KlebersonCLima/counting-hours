# data_processing.py
import pandas as pd
from datetime import datetime

def clean_time_value(value):
    """
    Limpa uma string de horário, removendo caracteres não numéricos e não ':'.
    Retorna uma string vazia se o valor for NaN.
    """
    if pd.isna(value):
        return ""
    return ''.join([char for char in str(value) if char.isdigit() or char == ':'])

def load_and_clean_data(csv_path: str):
    """
    Carrega dados de um arquivo CSV, limpa as colunas de ponto
    e prepara a coluna de data.

    Args:
        csv_path (str): O caminho para o arquivo CSV de entrada.

    Returns:
        tuple: Um tuple contendo (DataFrame, lista de nomes de colunas de ponto,
               nome da coluna de data original) ou (None, None, None) em caso de erro.
    """
    try:
        df = pd.read_csv(csv_path)
        print(f"Arquivo CSV '{csv_path}' lido com sucesso.")
    except FileNotFoundError:
        print(f"Erro: O arquivo CSV '{csv_path}' não foi encontrado. Verifique o caminho.")
        return None, None, None
    except Exception as e:
        print(f"Erro ao ler o arquivo CSV: {e}")
        return None, None, None

    # Identifica e limpa as colunas de ponto
    point_columns_names = [col for col in df.columns if col.startswith('Ponto') and df[col].dtype == 'object']
    for col in point_columns_names:
        df[col] = df[col].apply(clean_time_value)
    print("Dados de ponto do CSV limpos.")

    # Prepara a coluna de data
    date_col_name = df.columns[0]
    df['parsed_date'] = df[date_col_name].str.extract(r'(\d{2}/\d{2})')[0] + f'/{datetime.now().year}'
    df['parsed_date'] = pd.to_datetime(df['parsed_date'], format='%d/%m/%Y', errors='coerce')
    df.dropna(subset=['parsed_date'], inplace=True)
    print("Coluna de data processada.")

    return df, point_columns_names, date_col_name
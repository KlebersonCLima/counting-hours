# backend/app/database.py

import sqlite3
from ..config import DATABASE_NAME  # Importando a constante do arquivo de configuração

def create_connection():
    """Cria uma conexão com o banco de dados SQLite."""
    conn = None
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        print(f"Conexão com o banco de dados {DATABASE_NAME} estabelecida com sucesso.")
    except sqlite3.Error as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
    return conn

def create_table():
    """Cria a tabela funcionarios se ela não existir."""
    conn = create_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS funcionarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    foto_perfil TEXT,
                    nome TEXT NOT NULL,
                    cpf TEXT UNIQUE NOT NULL,
                    carga_horaria INTEGER
                )
            """)
            conn.commit()
            print("Tabela 'funcionarios' criada com sucesso (ou já existia).")
        except sqlite3.Error as e:
            print(f"Erro ao criar a tabela 'funcionarios': {e}")
        finally:
            conn.close()

def _convert_to_minutes(time_str):
    """Função auxiliar para converter uma string 'H:MM' para minutos totais."""
    try:
        if ':' in time_str:
            parts = time_str.split(':')
            hours = int(parts[0])
            minutes = int(parts[1])
            return (hours * 60) + minutes
        else:
            # Se não houver ':', tenta converter diretamente para int (assumindo já ser minutos)
            try:
                return int(float(time_str) * 60) # Multiplica por 60 se for dado em horas
            except ValueError:
                return None # Retorna None se a conversão falhar
    except (AttributeError, ValueError, IndexError):
        return None # Retorna None se ocorrer algum erro na conversão

def insert_funcionario(foto_perfil, nome, cpf, carga_horaria_str):
    """Insere um novo funcionário na tabela funcionarios, convertendo carga horária para minutos."""
    conn = create_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            minutes = _convert_to_minutes(carga_horaria_str)
            if minutes is None:
                print(f"Erro ao converter carga horária '{carga_horaria_str}' para minutos para o funcionário '{nome}'.")
                return None

            sql = """
                INSERT INTO funcionarios (foto_perfil, nome, cpf, carga_horaria)
                VALUES (?, ?, ?, ?)
            """
            cursor.execute(sql, (foto_perfil, nome, cpf, minutes))
            conn.commit()
            print(f"Funcionário '{nome}' inserido com sucesso com carga horária de {minutes} minutos.")
            return cursor.lastrowid   # Retorna o ID do novo funcionário
        except sqlite3.IntegrityError as e:
            print(f"Erro ao inserir funcionário '{nome}': CPF já existe.")
            return None
        except sqlite3.Error as e:
            print(f"Erro geral ao inserir funcionário: {e}")
            return None
        finally:
            conn.close()

def get_all_funcionarios():
    """Busca todos os funcionários da tabela funcionarios."""
    conn = create_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, foto_perfil, nome, CPF, carga_horaria FROM funcionarios")
            rows = cursor.fetchall()
            return rows
        except sqlite3.Error as e:
            print(f"Erro ao buscar todos os funcionários: {e}")
            return []
        finally:
            conn.close()

def update_funcionario(id, foto_perfil, nome, cpf, carga_horaria_str):
    """Atualiza os dados de um funcionário existente."""
    conn = create_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            minutes = _convert_to_minutes(carga_horaria_str)
            if minutes is None:
                print(f"Erro ao converter carga horária '{carga_horaria_str}' para minutos para o funcionário com ID {id}.")
                return False

            sql = """
                UPDATE funcionarios
                SET foto_perfil = ?,
                    nome = ?,
                    cpf = ?,
                    carga_horaria = ?
                WHERE id = ?
            """
            cursor.execute(sql, (foto_perfil, nome, cpf, minutes, id))
            conn.commit()
            if cursor.rowcount > 0:
                print(f"Funcionário com ID {id} atualizado com sucesso.")
                return True
            else:
                print(f"Nenhum funcionário encontrado com o ID {id} para atualizar.")
                return False
        except sqlite3.IntegrityError as e:
            print(f"Erro ao atualizar funcionário com ID {id}: CPF '{cpf}' já existe.")
            return False
        except sqlite3.Error as e:
            print(f"Erro geral ao atualizar funcionário com ID {id}: {e}")
            return False
        finally:
            conn.close()

def delete_funcionario(id):
    """Deleta um funcionário da tabela funcionarios com base no ID."""
    conn = create_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            sql = "DELETE FROM funcionarios WHERE id = ?"
            cursor.execute(sql, (id,))
            conn.commit()
            if cursor.rowcount > 0:
                print(f"Funcionário com ID {id} deletado com sucesso.")
                return True
            else:
                print(f"Nenhum funcionário encontrado com o ID {id} para deletar.")
                return False
        except sqlite3.Error as e:
            print(f"Erro geral ao deletar funcionário com ID {id}: {e}")
            return False
        finally:
            conn.close()

def get_funcionario_por_id(id):
    """Busca um funcionário da tabela funcionarios com base no ID."""
    conn = create_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, foto_perfil, nome, cpf, carga_horaria FROM funcionarios WHERE id = ?", (id,))
            row = cursor.fetchone()
            return row
        except sqlite3.Error as e:
            print(f"Erro ao buscar funcionário com ID {id}: {e}")
            return None
        finally:
            conn.close()

if __name__ == '__main__':
    create_table()

    # Exemplos de inserção (para teste)
    insert_funcionario('caminho/para/foto1.jpg', 'João da Silva', '12.345.678/0001-90', '8:48')
    insert_funcionario('caminho/para/foto2.png', 'Maria Souza', '98.765.432/0001-01', '6.5') # Testando com decimal de horas
    insert_funcionario(None, 'Carlos Pereira', '55.555.555/0001-55', '09:15')
    insert_funcionario(None, 'Ana Oliveira', '77.777.777/0001-77', '7') # Testando com horas inteiras
    # Tentativa de inserir com CPF duplicado
    insert_funcionario(None, 'Outro João', '12.345.678/0001-90', '8:00')
    # Tentativa de inserir com formato inválido
    insert_funcionario(None, 'Funcionário Inválido', '11.111.111/0001-11', 'abc')

    # Teste da função get_all_funcionarios
    funcionarios = get_all_funcionarios()
    if funcionarios:
        print("\nLista de Funcionários:")
        for funcionario in funcionarios:
            print(funcionario)
    else:
        print("\nNenhum funcionário encontrado.")

    # Teste da função update_funcionario
    print("\nTestando atualização:")
    update_funcionario(1, 'novo/caminho/foto_joao.jpg', 'João Silva Atualizado', '12.345.678/0001-90', '9:00') # Tentando atualizar um existente
    update_funcionario(3, None, 'Carlos Pereira', '55.555.555/0001-55', '9.25') # Tentando atualizar outro
    update_funcionario(999, None, 'Funcionário Inexistente', '00.000.000/0001-00', '8:00') # Tentando atualizar um inexistente
    update_funcionario(2, 'foto_maria.png', 'Maria Souza', '99.999.999/0001-99', '6:30') # Tentando atualizar com CPF diferente
    update_funcionario(2, 'foto_maria.png', 'Maria Souza', '12.345.678/0001-90', '6:30') # Tentando atualizar com CPF já existente

    # Teste da função delete_funcionario
    print("\nTestando deleção:")
    delete_funcionario(1) # Tentando deletar um existente
    delete_funcionario(999) # Tentando deletar um inexistente
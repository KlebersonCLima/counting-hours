# main.py

import sys
import os

# Adiciona o diretório backend ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app import app
from app.database import create_table

if __name__ == '__main__':
    create_table()  # Garante que a tabela seja criada ao iniciar
    app.run(debug=True, host='127.0.0.1', port=5000)
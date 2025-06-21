# backend/run.py

from backend.app import app, database

if __name__ == '__main__':
    database.create_table() # Garante que a tabela seja criada ao iniciar
    app.run(debug=True)
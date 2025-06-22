# backend/app/__init__.py

from flask import Flask
from flask_cors import CORS
from backend.app.routes.employee_routes import employee_bp

app = Flask(__name__)

# Configuração mais robusta do CORS
CORS(app, 
     origins=["*"],  # Permitir todas as origens para desenvolvimento
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
     expose_headers=["Content-Disposition"],
     supports_credentials=True,
     max_age=3600)  # Cache preflight por 1 hora

# Adicionar headers CORS manualmente para garantir compatibilidade
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

app.register_blueprint(employee_bp, url_prefix='/funcionarios')

from backend.app import database # Importar para garantir que a conexão seja inicializada (opcional, dependendo de onde você chama create_table)
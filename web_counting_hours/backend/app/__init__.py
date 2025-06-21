# backend/app/__init__.py

from flask import Flask
from flask_cors import CORS
from .routes.employee_routes import employee_bp

app = Flask(__name__)
CORS(app) # Habilite o CORS para todas as rotas

app.register_blueprint(employee_bp, url_prefix='/funcionarios')

from . import database # Importar para garantir que a conexão seja inicializada (opcional, dependendo de onde você chama create_table)
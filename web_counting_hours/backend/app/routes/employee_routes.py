# backend/app/routes/employee_routes.py

from flask import jsonify, request, Blueprint
from ..database import get_all_funcionarios, insert_funcionario, delete_funcionario, get_funcionario_por_id, update_funcionario
from ...config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from ..utils import allowed_file
import os
from werkzeug.utils import secure_filename

employee_bp = Blueprint('employees', __name__)

@employee_bp.route('/', methods=['GET'])
def listar_funcionarios():
    funcionarios = get_all_funcionarios()
    return jsonify(funcionarios)

@employee_bp.route('/', methods=['POST'])
def adicionar_funcionario():
    if 'profile_pic' in request.files:
        file = request.files['profile_pic']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            foto_perfil = filepath  # Salva o caminho do arquivo
        else:
            foto_perfil = None
    else:
        foto_perfil = None

    nome = request.form.get('name')
    cpf = request.form.get('cpf') # Certifique-se de usar 'cpf' se você alterou no HTML
    carga_horaria = request.form.get('carga_horaria')

    if not nome or not cpf or not carga_horaria:
        return jsonify({'message': 'Todos os campos são obrigatórios'}), 400

    novo_funcionario_id = insert_funcionario(foto_perfil, nome, cpf, carga_horaria) # Use 'cpf' aqui se alterou no database.py

    if novo_funcionario_id:
        return jsonify({'message': 'Funcionário adicionado com sucesso!', 'id': novo_funcionario_id}), 201
    else:
        return jsonify({'message': 'Erro ao adicionar funcionário.'}), 500

@employee_bp.route('/<int:id>', methods=['DELETE'])
def remover_funcionario(id):
    sucesso = delete_funcionario(id)
    if sucesso:
        return jsonify({'message': f'Funcionário com ID {id} removido com sucesso!'}), 200
    else:
        return jsonify({'message': f'Erro ao remover funcionário com ID {id}. Funcionário não encontrado ou erro no servidor.'}), 404

@employee_bp.route('/<int:id>', methods=['GET'])
def obter_funcionario(id):
    funcionario = get_funcionario_por_id(id)
    if funcionario:
        return jsonify({'id': funcionario[0], 'foto_perfil': funcionario[1], 'nome': funcionario[2], 'cpf': funcionario[3], 'carga_horaria': funcionario[4]})
    else:
        return jsonify({'message': f'Funcionário com ID {id} não encontrado.'}), 404

@employee_bp.route('/<int:id>', methods=['PUT'])
def atualizar_funcionario(id):
    nome = request.form.get('name')
    cpf = request.form.get('cpf')
    carga_horaria = request.form.get('carga_horaria')

    if not nome or not cpf or not carga_horaria:
        return jsonify({'message': 'Todos os campos são obrigatórios para a atualização'}), 400

    # Lógica para lidar com a foto de perfil (se foi atualizada)
    if 'profile_pic' in request.files:
        file = request.files['profile_pic']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            foto_perfil = filepath
        else:
            foto_perfil = request.form.get('old_profile_pic') # Manter a foto antiga se o novo envio for inválido
    else:
        foto_perfil = request.form.get('old_profile_pic') # Manter a foto antiga se não foi enviada uma nova

    sucesso = update_funcionario(id, foto_perfil, nome, cpf, carga_horaria) # Use 'cpf' aqui se alterou no database.py

    if sucesso:
        return jsonify({'message': f'Funcionário com ID {id} atualizado com sucesso!'}), 200
    else:
        return jsonify({'message': f'Erro ao atualizar funcionário com ID {id}.'}), 500
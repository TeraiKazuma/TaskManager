from app import app
from flask import request,jsonify
from flask_login import login_user
from models import db, User
#=====================================
# ルーティング
#====================================
@app.route('/',methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first() # ユーザーの照会

    # ユーザーが存在し、パスワードが一致する場合
    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'ログイン成功'}), 201
    return jsonify({'message': 'ユーザー名またはパスワードが間違っています。'}), 401
    
@app.route('/Signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    

    return jsonify({'message': '新規登録が完了しました'}), 200

@app.route('/Addtask', methods=['POST'])
def addtask():
    data = request.get_json()
    title = data.get('title')
    kind = data.get('kind')
    place = data.get('place')
    nottime = data.get('nottime')
    url = data.get('url')
    memo = data.get('memo')
    date = data.get('date')
    
    
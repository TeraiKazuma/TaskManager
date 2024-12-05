from app import app
from flask import request,jsonify
from flask_login import login_user,current_user,login_required
from models import db, User, Task
import jwt
from datetime import datetime, date, time,timedelta
from dateutil.parser import parse  # ISO 8601形式の解析
from pytz import timezone

SECRET_KEY = 'e97b6ac8773c3942d0ebe2ceabc49f638a25a5f7d4bc2781'

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
        #トークン生成
        token = jwt.encode(
            {#ペイロード
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(hours=1)#有効期限
            },
            SECRET_KEY,#署名に使用する秘密鍵
            algorithm='HS256'#アルゴリズム(ヘッダ)
        )
        return jsonify({'message': 'ログイン成功', 'token': token}), 200

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
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': '認証トークンが必要です'}), 401
    
    token = auth_header.split(' ')[1]
    try:
        # トークンをデコードし、ユーザidを取得
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        
        #クライアントから入力データを取得
        data = request.get_json()
        title = data.get('title')
        kind = data.get('kind')
        place = data.get('place')
        nottime = data.get('nottime')
        url = data.get('url')
        memo = data.get('memo')
        date = data.get('date')
        date_obj = parse(date)  # ISO 8601形式から`datetime`型に変換
        local_datetime = date_obj.astimezone(timezone('Asia/Tokyo'))  # 日本時間に変換
        
        # 日付と時間に分割
        date_part = local_datetime.date()  # `datetime.date`型
        time_part = local_datetime.time()  # `datetime.time`型
        print(f"Received datetime: {date_obj}")
        print(f"Received datetime: {local_datetime}")
        print(f"Extracted date: {date_part}")
        print(f"Extracted time: {time_part}")
        
        if time_part == time(0, 0):  # デフォルトの`00:00:00`の場合
            time_part = None  # データベースに`NULL`として保存する場合
        
        
        #データベースに追加するデータ
        tasks = Task(
                    user_id=user_id,
                    title=title,
                    kind=kind,
                    date=date_part,
                    time=time_part,
                    place=place,
                    notice=nottime,
                    url=url,
                    memo = memo,
                )

        db.session.add(tasks)# データベースに追加
        db.session.commit()#データベースにコミット
    
        return jsonify({'message': 'タスク登録が完了しました'}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'トークンの有効期限が切れています'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': '無効なトークンです'}), 401
    
    
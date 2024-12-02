from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

#==================================================
# モデル
#==================================================
# ユーザー
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    # ユーザーID
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # 名前
    username = db.Column(db.String(100), nullable=False, unique=True)
    # パスワード
    password_hash = db.Column(db.String(200), nullable=False)
    
    #入力したパスワードをハッシュ化
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    #ログイン時のパスワードの認証
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
# タスク
class Task(db.Model):
    __tablename__ = 'tasks' # テーブル名
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)# タスクID
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # user_id
    name = db.Column(db.String(200), nullable=False)    # タスク名
    kind = db.Column(db.String(200))    # タスクの種類
    date = db.Column(db.Date)    # 日付
    time = db.Column(db.DateTime)    # 時間
    place = db.Column(db.String(200))   # 場所
    notice = db.Column(db.Integer)  # 通知時刻
    url = db.Column(db.String(200))     # URL
    memo = db.Column(db.String(200))    # メモ

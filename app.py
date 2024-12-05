import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, User
from flask_cors import CORS
from flask_login import LoginManager

# ==================================================
# インスタンス生成
# ==================================================
# Flaskアプリのインスタンス生成
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # 全てのオリジンを許可

# 乱数を設定
app.config['SECRET_KEY'] = os.urandom(24)
base_dir = os.path.dirname(__file__)
database = 'sqlite:///' + os.path.join(base_dir, 'data.sqlite')
app.config['SQLALCHEMY_DATABASE_URI'] = database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# データベースの設定
db.init_app(app)
migrate = Migrate(app, db)

from views import *

# ==================================================
# 実行
# ==================================================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
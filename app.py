import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import db, User

# ==================================================
# インスタンス生成
# ==================================================
# Flaskアプリのインスタンス生成
app = Flask(__name__)

# 乱数を設定
app.config['SECRET_KEY'] = os.urandom(24)
base_dir = os.path.dirname(__file__)
database = 'sqlite:///' + os.path.join(base_dir, 'data.sqlite')
app.config['SQLALCHEMY_DATABASE_URI'] = database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# データベースの設定
db.init_app(app)
migrate = Migrate(app, db)

# ==================================================
# 実行
# ==================================================
if __name__ == '__main__':
    app.run()
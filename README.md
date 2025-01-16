# expoのインストール(必須)
cmdで　install expo

# 実行
1.src/config.tsの"http://localhost:5000"を実行環境に合わせて変更
  web：localhost,ios+android：ipアドレス
2.app.pyをFlaskの仮想環境で実行
3.'npx expo start'でexpoを実行
4.webの場合：wと入力
  ios+androidの場合：expogo（アプリ）をインストール→同じwifi下でQRコード読み取る
  ※webで使用する場合は開発者ツールから
  body {
    overflow: hidden;　←このチェックを外してください。スクロールできない状態になっています。
  }

# エラー
C:\TaskManager\node_modules\expo-notifications\build\Notifications.types.d.ts:337
type?: SchedulableTriggerInputTypes.TIME_INTERVAL;
ここで型エラー
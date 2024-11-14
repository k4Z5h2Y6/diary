# 個人用生活データ収集Webアプリ

### 説明

私の睡眠時間、仕事時間、喫煙本数、日記、食事、を記録できるようなWebアプリを個人で作成しました。

### リンク

https://diary-seven-rho.vercel.app/

### 技術
- HTML
- CSS
- TypeScript
- React
- Next.js(App Router)
- Supabase
- MUI
- Vercel

### サインアップ方法と操作説明書

![IMG_0380](https://github.com/k4Z5h2Y6/diary/assets/139014943/0f7405a2-0719-4b85-ae60-070c1687d554)

![IMG_0381](https://github.com/k4Z5h2Y6/diary/assets/139014943/9eb823be-8342-453c-8cbd-56522f1da979)

![IMG_0382](https://github.com/k4Z5h2Y6/diary/assets/139014943/766977bd-013d-401c-aa19-22cd1701cbfb)

![IMG_0384](https://github.com/k4Z5h2Y6/diary/assets/139014943/c44f906c-d76b-4d9e-a6b2-42f5e17ca239)

![IMG_0383](https://github.com/k4Z5h2Y6/diary/assets/139014943/d2a376e3-7c79-48bc-bbc2-2731c42cc7d3)

### 補足
- App Routerの理解を深めるために制作。
- ルーティングはApp Routerを採用。
- 個人用で作成しましたが、複数アカウントで利用可能。メールアドレスとパスワードでサインアップ、サインイン、サインアウト可能。
- Apple製品で撮影された写真のデフォルトの拡張子であるheic形式の写真はアップロードできない。プラグインを入れれば対処可能。
- いずれは、収集したデータをチャート形式で確認できるようにしたい。
- スマートフォン対応、レスポンシブ対応。
- カテゴリーは削除不可(今後対応)。
- 当アプリ制作当初はリアルタイム通信で情報をフェッチしていましたが、通信が遅かったためリルタイム通信は廃止。
- クッキーにサインイン情報を保存しているので、毎回サインインしなくて良い。

Setup Instructions / セットアップ手順

1. Install Node.js / Node.js のインストール

Install the LTS (Long Term Support) version of Node.js from:Node.js の LTS（長期サポート）版 を以下からインストールしてください：https://nodejs.org

2. Install Backend Dependencies / バックエンド依存関係のインストール

Open a terminal and run:ターミナルを開いて以下を実行します：

cd backend
npm install

3. Install Frontend Dependencies and Build / フロントエンド依存関係のインストールとビルド

cd frontend
npm install
npm run build

This will generate production build files in:このコマンドにより、以下のフォルダに本番用ビルドファイルが生成されます：

frontend/build

4. Confirm Database Path / データベースパスの確認

Make sure the SQLite database file exists before starting the app:アプリ起動前に、以下の場所に SQLite データベースファイルが存在することを確認してください：

C:\project\SMTScreenVision\src\storage\data\db\database.db

If the file or folders are missing, create them or run your database initialization process.ファイルまたはフォルダが存在しない場合は、手動で作成するかデータベース初期化処理を実行してください。

5. Start the Application / アプリケーションの起動

Run:以下を実行します：

start.bat

The server will start and the application will open automatically in your browser.サーバーが起動し、アプリケーションが自動的にブラウザで開きます。

Additional README Information / 追加情報


1. Environment Requirements / 動作環境

Node.js LTS

Windows OS (required for start.bat)

SQLite (no separate installation required if the DB file exists)

2. Troubleshooting / トラブルシューティング

Port Already in Use / ポートが使用中の場合

Close other applications using port 5000 or change the backend port in the server configuration.ポート 5000 を使用している他のアプリケーションを終了するか、サーバー設定でポート番号を変更してください。

3. Database Errors / データベースエラー

Verify the database file exists at the path listed above and is not set to read‑only.上記パスにデータベースファイルが存在し、読み取り専用になっていないことを確認してください。

4. Frontend Not Updating / フロントエンドが更新されない

Rebuild the frontend:フロントエンドを再ビルドしてください：

cd frontend
npm run build

Then restart the application.その後、アプリケーションを再起動してください。

Rebuilding Everything / 再ビルド手順

If dependencies become corrupted, run:依存関係に問題が発生した場合は以下を実行します：

cd backend && npm install
cd ../frontend && npm install && npm run build

Notes / 注意事項

Do not modify files inside frontend/build manually.frontend/build フォルダ内のファイルを手動で変更しないでください。

The backend serves the compiled frontend in production mode.本番環境ではバックエンドがビルド済みフロントエンドを配信します。

Keep the database file backed up regularly.データベースファイルは定期的にバックアップを取ってください。


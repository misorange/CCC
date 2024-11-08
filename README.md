# CCC's Hack U project

## Table of Contents

- [Overview](#overview)
- [Feature](#feature)
- [Prerequisites](#prerequisites)
- [How to use](#how-to-use)
- [Linking to JSON files](#linking-to-json-files)
- [Directory Configuration](#directory-configuration)
- [How to Participate in Development](#how-to-participate-in-development)

## Overview

このプロジェクトは、SQLiteとNode.jsを使用して構築された、
自分たちがほしいと思った機能をつけたウェブアプリです。
課題管理や行事把握等を効率的に行うことができます。

## Feature

**担当の機能、後で詳細に書いといて**
- ユーザーと共有が可能なタイトル、説明、期限、ステータス付きの課題管理
- タイトル、説明、開始時間と終了時間、場所付きのカレンダーイベント管理
- じかんわりー
- とぅーどぅーりすと
- がくせーどうしのおしえあいひろば

## Prerequisites

- [Node.js](https://nodejs.org/)
- [SQLite3](https://www.sqlite.org/index.html)

## Installation

1. **レポジトリをダウンロードする**

    ```sh
    git clone https://github.com/misorange/CCC.git
    cd CCC
    ```

2. **依存関係をインストール:**

    ```sh
    npm install express sqlite3 body-parser cors
    ```

## How to use

1. **サーバーを起動:**

    サーバーを起動するには、以下のコマンドを実行

    ```sh
    node server.js
    ```

    デフォルトでは、サーバーはポート5000で起動

2. **エンドポイントにアクセス:**

    サーバーが起動したら、以下のエンドポイントを使用してデータを管理できます。

    **ただまだtaskにしか対応できてないので言うてる間にやります**

## Linking to JSON files

このプロジェクトでは、データベースの内容をJSONファイルに書き出したり、JSONファイルからデータベースにデータをインポートしたりする機能を提供しています。

### データベースからJSONファイルへの書き出し

サーバーが起動すると、`write_db_to_JSON`関数が呼び出され、`tasks`テーブルの内容が`data/tasks.json`ファイルに書き出されます。

### JSONファイルからデータベースへのインポート

サーバーが起動すると、`write_JSON_to_db`関数が呼び出され、`data/tasks.json`ファイルの内容がデータベースにインポートされます。この際、以下の操作が行われます：

1. JSONファイルのデータをデータベースに追加
2. データベースに既に存在するデータを更新
3. データベースに存在するが、JSONファイルに存在しないデータを削除


**上に同じくまだtaskのみ対応なのでそれ以外も行けるようにします**

## Directory Configuration

    project-root/
    │
    ├── index.html         # メインのHTMLファイル
    ├── about.html         # 追加のページ（例：Aboutページ）
    ├── schedule.html      # 時間割ページ
    ├── tasks.html         # 課題リストページ
    ├── calendar.html
    │
    ├── css/               # CSSファイルを格納するディレクトリ
    │   ├── styles.css     # メインのスタイルシート
    │   └── schedule.css   # 時間割ページ専用のスタイルシート
    │
    ├── js/                # JavaScriptファイルを格納するディレクトリ
    │   ├── main.js        # メインのJavaScriptファイル
    │   ├── schedule.js    # 時間割ページ専用のJavaScriptファイル
    │   └── tasks.js       # 課題リストページ専用のJavaScriptファイル
    │
    ├── img/               # 画像ファイルを格納するディレクトリ
    │   └── logo.png       # ロゴ画像など
    │
    ├── backend/              # バックエンドのディレクトリ
    │   ├── database.db     # データベースのdbデータ
    │   ├── db.js     # データベースについてのJSデータ
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── server.js     # serverのJSファイル
    │   ├── node_modules/
    │   │   └── ...
    │   ├── models/
    │   │   └── ...
    │   └── data/     # データを格納するディレクトリ
    │       └── ...
    │
    └── README.md          # プロジェクトの概要等を記載するREADMEファイル


## How to Participate in Development
1. **レポジトリをクローン:**

    リポジトリをローカルマシンにクローン

    ```sh
    git clone https://github.com/misorange/CCC.git
    cd CCC
    ```

2. **新しいブランチを作成:**

    新しい機能のためのブランチ作成

    ```sh
    git checkout -b feature/{CREATED FEATURE}
    ```

3. **変更を加える:**

    機能を実装したり、バグを修正
    
4. **変更をコミット:**

    変更をクリアで**詳細な**コミットメッセージとともにコミット

    ```sh
    git commit -m 'add：新機能を追加'
    ```

5. **ブランチにプッシュ:**

    変更をリポジトリの作成したブランチにプッシュ

    ```sh
    git push origin feature/{CREATED FEATURE}
    ```

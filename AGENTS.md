# --------------------------------------------------------------------
#  AGENTS.md  –  oss-catalog frontend (Vue 3 + Vuetify) meta-info
# --------------------------------------------------------------------
version: 1  # ←変更するときは +1
project: oss-catalog-frontend
language: javascript
javascript:
  framework: vue3
  typescript: true
  package_manager: npm
go: {}            # バックエンド用に空で残す（干渉しない）

openapi:
  spec: ../oss-catalog/internal/api/openapi.yaml        # バックエンドと同一ファイルをコピー
  generate:
    client: npm run generate             # package.json で定義
 readonly:
      - ../oss-catalog/               # ← ここを追加
# ---- コマンド ----
scripts:
  setup: |
    npm ci
    npm run generate
  dev: npm run dev
  build: npm run build
  lint: npm run lint                      # eslint/prettier がある場合
  test: npm run test                      # vitest など任意

# ---- ディレクトリ構成 & レイヤ ----
layers:
  - name: api
    path: src/api
    description: openapi-typescript-codegen 生成クライアント
    generated: true
  - name: pages
    path: src/pages
    description: ルーティング単位の Vue コンポーネント
  - name: components
    path: src/components
    description: 再利用 UI コンポーネント
  - name: stores
    path: src/stores
    description: Pinia ストア
  - name: locales
    path: src/locales
    description: vue-i18n 言語ファイル (ja.json など)

# ---- 生成ファイルの編集ルール ----
rules:
  editing:
    generated:
      deny: ["src/api/"]                  # client 再生成の差分で管理
    allow_create_in:
      - src/pages
      - src/components
      - src/stores
      - src/locales
  tests:
    required_coverage: 0.40               # 40% 以上を推奨（任意）
  validation:
    commands:
      - npm run generate                  # 生成して差分ゼロを確認
      - npm run lint                      # Lint で Warning 0
      - npm run type-check || true        # tsc --noEmit (任意)

# ---- UI ガイドライン ----
ui:
  theme:
    use_vuetify: true
    dark_mode: false                      # ダーク/ライト切替しない
  colors:
    in_scope: green
    out_scope: red
    review_needed: amber
  components:
    table: vuetify.data-table
    dialog: vuetify.dialog
  i18n:
    default_locale: ja
    files_pattern: src/locales/*.json

# ---- エクスポート機能 ----
export:
  trigger: kebab                          # プロジェクト行のケバブメニュー
  endpoint: /projects/{projectId}/export
  formats: [csv, spdx-json]
  notify: toast_on_complete               # 非同期 → 完了でトースト

# ---- 認証 ----
auth:
  type: basic
  header_inject: true                     # Axios interceptor で自動付与
  future:
    jwt_ready: true                       # 将来 JWT に切替可能な構成を維持

# ---- 推奨 AI プロンプト例 ----
ai_prompts:
  create_page_oss_list: >
    src/pages/OssListPage.vue を作成し、
    api.ListOssComponents を呼び出して Vuetify DataTable で表示してください。
    ページロード時に useOssStore.fetchList() を呼び出し、
    検索フォームとページネーションを実装します。
  create_dialog_project_detail: >
    src/components/ProjectDetailDialog.vue を実装してください。
    プロジェクト情報の更新フォームと UsageTable タブを含みます。

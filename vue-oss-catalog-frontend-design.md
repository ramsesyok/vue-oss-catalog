# 社内OSSカタログ SPA フロントエンド設計（Vue 3 + TypeScript + Vuetify 3）

> **本書は Phase 1 (OSS/Project CRUD & Export) を Vue 3 SPA で実装するためのガイドです。**
>
> * 決定事項（2025‑07‑21 ユーザ回答）を反映済み
> * AI エージェントがコード生成・補完しやすい粒度で分割／命名
> * 詳細はoss-catalog\internal\api\openapi.yamlおよびoss-catalog/api-design.mdに準拠。

---

## 0. 決定事項 反映サマリ

| # | 決定                                                                   | 実装指針                                                                                                                                     |
| - | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | **ダーク/ライト切替不要**／シンプルテーマ                                              | Vuetify 既定ライトテーマのみ。カラーパレット最小変更（primary = `#1976D2`）。ロゴ無。                                                                                 |
| 2 | **認証** Basic Auth、将来 JWT 視野                                          | Axios Interceptor で `<base64(user:pass)>` 追加。トークンが存在する場合は `Authorization: Bearer …` に自動切替。トークン保存は `localStorage` key=`jwt`.              |
| 3 | **エクスポート** プロジェクト行ケバブメニュー                                            | `v-menu` ▶ `Export ⇒ CSV / SPDX‑JSON`。API 呼出後ダウンロード完了で `v-snackbar` (“エクスポートが完了しました”). 30 秒超は `v-progress-linear indeterminate` で上部バー表示。 |
| 4 | **タグ UI** `v-autocomplete` + 新規作成                                    | `creatable` オプション (`:hide-no-data` + `@update:search` → create)。ドラッグ並替え無。                                                                |
| 5 | **スコープ色** IN=green(success) / OUT=red(error) / REVIEW=amber(warning) | `ScopeStatusChip.vue` で `v-chip :color="map[scopeStatus]"`。                                                                              |
| 6 | **i18n 対応**                                                          | `vue-i18n@next`。`locales/ja.json` を初期ロード。英語 `en.json` 雛形だけ用意。ラベルは `$t('oss.list.title')` 形式で埋め込む。                                        |

---

## 1. 技術スタック & 主要依存

| 分類          | ライブラリ                          | バージョン例                 |
| ----------- | ------------------------------ | ---------------------- |
| ビルド         | Vite                           | ^5.0                   |
| フレームワーク     | Vue 3 (script setup)           | 3.5+                   |
| UI          | Vuetify 3                      | 3.9+                   |
| 状態管理        | Pinia                          | 2.1+                   |
| ルーター        | Vue Router 4                   | 4.3+                   |
| 型生成         | **openapi-typescript-codegen** | 0.24+ (axios client)   |
| HTTP        | axios                          | ^1.6                   |
| i18n        | vue-i18n                       | 9.9+                   |
| Lint/Format | ESLint + Prettier              | 標準 (Airbnb + Prettier) |

---

## 2. ディレクトリ構成

```
vue-oss-catalog/
├─ src/
│  ├─ api/                # openapi 型安全クライアント (generated)
│  ├─ components/
│  │   ├─ oss/            # OssTable, OssDetailDialog 等
│  │   ├─ project/        # ProjectTable, ProjectDetailDialog 等
│  │   └─ common/         # ScopeStatusChip, TagChip
│  ├─ pages/              # ルートビュー
│  │   ├─ OssListPage.vue
│  │   ├─ ProjectListPage.vue
│  │   └─ SettingsPage.vue
│  ├─ stores/
│  │   ├─ useOssStore.ts
│  │   ├─ useProjectStore.ts
│  │   ├─ useTagStore.ts
│  │   └─ useScopePolicyStore.ts
│  ├─ router/index.ts
│  ├─ plugins/
│  │   ├─ vuetify.ts
│  │   └─ i18n.ts
│  ├─ locales/
│  │   ├─ ja.json
│  │   └─ en.json
│  └─ App.vue
├─ public/
├─ vite.config.ts
├─ package.json
└─ scripts/generate-client.mjs
```

### scripts/generate-client.mjs

```js
import { generate } from 'openapi-typescript-codegen';
await generate({
  input: '../backend/internal/api/openapi.yaml',
  output: 'src/api',
  httpClient: 'axios',
  useOptions: true,
  useUnionTypes: true,
});
```

`npm run gen:client` で実行。

---

## 3. UI 詳細

### 3.1 レイアウト

* **NavigationDrawer** (Permanent) 左 240 px

  * OSS 一覧
  * プロジェクト一覧
  * 設定 (タグ / ポリシー)
* **AppBar** 上部固定、右にユーザ名表示。認証成功後ユーザ名をストアへ格納。
* **RouterView** メインコンテンツ。DataTable + Fab(+)新規ボタン

### 3.2 コンポーネント抜粋

| コンポーネント               | 説明                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------- |
| `OssTable.vue`        | Vuetify VDataTable。カラム: name / layers / tags / latestVersion / actions (detail)。検索バー結合。 |
| `OssDetailDialog.vue` | Tabs: 概要フォーム / バージョン一覧 (`VersionTable.vue`)。save/cancel。                                |
| `ProjectTable.vue`    | ケバブメニュー `v-menu` → Export (CSV / SPDX‑JSON)。                                            |
| `ScopeStatusChip.vue` | `:color` マッピング・Tooltip 付与。                                                              |
| `TagAutocomplete.vue` | ラップ `v-autocomplete` (`chips creatable multiple`) + API 検索。                             |

### 3.3 i18n キー例

```json5
{
  "oss": {
    "list": { "title": "OSS一覧", "searchPlaceholder": "検索…" },
    "detail": {
      "tab": { "summary": "概要", "versions": "バージョン" },
      "save": "保存",
      "cancel": "キャンセル"
    }
  },
  "export": { "csv": "CSV", "spdx": "SPDX JSON", "toast": "エクスポートが完了しました" }
}
```

---

## 4. 認証実装

```ts
// src/plugins/axios.ts
import axios from 'axios';
const instance = axios.create({ baseURL: '/api/v1' });
instance.interceptors.request.use((cfg) => {
  const jwt = localStorage.getItem('jwt');
  if (jwt) {
    cfg.headers.Authorization = `Bearer ${jwt}`;
  } else {
    cfg.auth = { username: import.meta.env.VITE_BASIC_USER, password: import.meta.env.VITE_BASIC_PASS };
  }
  return cfg;
});
export default instance;
```

---

## 5. 状態管理 (Pinia)

例: `useOssStore.ts`

```ts
export const useOssStore = defineStore('oss', {
  state: () => ({ list: [], page: 1, size: 50, total: 0, loading: false, filters: { name: '' } }),
  actions: {
    async fetch() {
      this.loading = true;
      const res = await Api.Oss.listOssComponents({ page: this.page, size: this.size, name: this.filters.name });
      this.list = res.data.items;
      this.total = res.data.total;
      this.loading = false;
    },
  },
});
```

---

## 6. エクスポート処理フロー

1. ユーザが「Export > CSV」クリック
2. `ProjectApi.exportProjectArtifacts({ projectId, format: 'csv', scopes: 'IN_SCOPE' })`
3. レスポンス Blob を `URL.createObjectURL` でダウンロード
4. 完了後 `v-snackbar` 表示
5. API 30 秒以上かかる場合はリクエスト中フラグ → `v-progress-linear` を AppBar に表示

---

## 7. AGENTS.md 連携 (frontend section 抜粋)

```yaml
frontend:
  language: vue3
  generate_client: npm run gen:client
  forbidden_paths:
    - src/api/        # generated
  required_tests: 0.50  # vitest coverage ratio (将来)
```

*backend 同様、AIエージェントは `src/api/` を直接編集しない*

---

## 8. 今後の追加検討

| 項目       | 説明                                                           |
| -------- | ------------------------------------------------------------ |
| テスト      | vitest + vue-test-utils。ページ単位 snapshot & store actions mock。 |
| PWA      | オフライン閲覧ニーズが生じた場合検討。                                          |
| アクセシビリティ | Vuetify ARIA 準拠。主要操作はキーボード対応必須。                              |
| 性能       | DataTable バーチャルスクロール (5000 行超) は将来検討。                        |

---

**以上が Phase 1 SPA 設計骨子です。** 追加の要望・修正があればお知らせください。

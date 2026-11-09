# dsh-sidebar-guide-grid

把 DSH 官方右侧边栏 **「开始」引导页** 的入口列表从「单列」改成 **一行两个**，
并按用户要求收紧间距：

| 项目 | 原值 | 新值 |
| --- | --- | --- |
| 容器方向 | 单列（`flex-direction: column`） | 一行两个（`row` + `wrap`，每格 50%） |
| 条目间距 `gap` | 14px | **12px**（减 2px） |
| 卡片上下内边距 | 14px | **7px**（先减 4、再各减 3） |
| 卡片高度 | 56px | 40px（内容决定：图标 24 + 上下内边距 14） |
| 卡片左右内边距 | 20px | 8px（两列变窄后让文字与快捷键放得下） |
| 图标间距 `gap` | 14px | 6px |
| 图标尺寸 | 26px | 24px |
| 快捷键提示 | 1 倍 | `zoom: .8`（否则「浏览器 Ctrl+Alt+T」会把标题挤断） |
| 页面背景 | 透明（露侧栏面板底色） | `var(--dsw-alias-bg-layer-1)`，与卡片同色；空位、行间、左右两侧一律纯白 |
| 格子对齐 | `stretch`（会被拉成整行高） | `flex-start` |

## 怎么做

**纯 CSS 覆盖，不改宿主任何文件。**

- `lib/client.js` 只往 `document.head` 注入一个 `<style id="dsh-sidebar-guide-grid-style">`；
- 选择器全部用宿主写进 DOM 的稳定属性 `[data-sidebar-right-guide]` /
  `[data-sidebar-right-guide-entry]`，**不依赖 CSS Module 哈希类名**（`.p2k40q_*`），
  宿主小版本升级后类名变了照样生效；
- 特异性用「属性写两遍」抬到 (0,2,0)/(0,3,0)，高于宿主原规则 (0,1,0)，
  因此不依赖样式注入顺序，也不需要 `!important`。

## 安装（desktop profile）

```powershell
cd ~/.dsh/profiles/desktop
# package.json: 依赖加 link，bundles 加一项（两者都必需）
# 然后
node "<DeepSeek Harness 安装目录>\resources\runtime\primary-runtime\dependencies\pnpm\bin\pnpm.mjs" install
```

装完 **重启 DSH 桌面端**（客户端 bundle 在启动时打包下发，热更不覆盖 profile 插件）。

## 回滚

任一即可：

1. 设置 → 插件 → 停用 `dsh-sidebar-guide-grid`（`cordis.patch.yml` 里把该行 `disabled: true`）；
2. 从 profile `package.json` 的 `dsh.profile.bundles` 删掉 `dsh-sidebar-guide-grid`；
3. 浏览器里删掉 `<style id="dsh-sidebar-guide-grid-style">` 立刻看到原样（不动文件）。

## 已知取舍

- 两列后每格约 200px（侧栏 451px 时），中文标题最多约 6 个字；更长的会被省略号截断
  （宿主 `.entryTitle` 自带 `text-overflow: ellipsis`）。当前 12 个入口全部完整显示；
- 快捷键提示缩到 0.8 倍以腾出宽度，仍可读；
- 「更多」卡片（宿主在 `sidebar.right.tab.guide.actions` 有注册时出现）也走同一半宽规则。

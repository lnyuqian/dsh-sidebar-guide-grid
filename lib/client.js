/**
 * dsh-sidebar-guide-grid — client half.
 *
 * 目标（用户 2026-11-09 原话）：
 *   「右侧边栏的开始页中列出的所有功能或插件入口，改为一行 2 个入口，
 *     每个入口框上下内边距各减少 4 像素，间距减少 2 像素。」
 *
 * 做法：只注入一段 CSS 覆盖，不碰宿主任何文件。
 *   - 选择器全部走宿主写进 DOM 的**稳定属性**
 *     （`[data-sidebar-right-guide]` / `[data-sidebar-right-guide-entry]`），
 *     不依赖 CSS Module 的哈希类名（如 `.p2k40q_entry`），宿主小版本升级也不会失效；
 *   - 特异性用「属性写两遍」抬高到 (0,2,0)/(0,3,0)，高于宿主原规则 (0,1,0)，
 *     因此不依赖样式注入顺序，也不需要 !important。
 *
 * 还原：停用插件，或删掉 document 里 id 为 dsh-sidebar-guide-grid-style 的 style 标签。
 */

window.__ModuleLoader__.load({
  id: 'dsh-sidebar-guide-grid',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    /** 注入的 style 标签 id（自检 / 手工回滚都靠它）。 */
    var STYLE_ID = 'dsh-sidebar-guide-grid-style'

    /**
     * 覆盖样式。
     * 数值对照（原值 → 新值）：
     *   容器 gap           14px → 12px（间距减 2px）
     *   容器方向           单列 → 一行两个（wrap 两列）
     *   卡片上下 padding   14px → 10px（各减 4px）
     *   卡片左右 padding   20px → 8px 、图标间距 14px → 6px（两列后让文字与快捷键放得下）
     *   卡片 min-height    56px → 48px（随内边距收 8px）
     */
    var CSS = [
      /* —— 容器：单列 → 一行两个；底色跟卡片一致（浅色主题=纯白），
            这样入口没占到的空位不会露出侧栏面板的灰底（用户 2026-11-09 追加要求） —— */
      '[data-sidebar-right-guide][data-sidebar-right-guide]{' +
        'flex-flow:row wrap;align-content:center;align-items:flex-start;' +
        'justify-content:center;gap:12px;padding:0 20px;' +
        'background:var(--dsw-alias-bg-layer-1)}',
      /* 宿主用一个伪元素做底部留白，wrap 布局里它会占掉半格；它也不许再带底色 */
      '[data-sidebar-right-guide][data-sidebar-right-guide]::after{' +
        'content:none;background:transparent}',
      /* —— 顶部罗盘图标独占一行 —— */
      '[data-sidebar-right-guide] > span[aria-hidden="true"]{' +
        'flex:0 0 100%;justify-content:center;margin-bottom:8px;background:transparent}',
      /* —— 每个入口占半列（两列各留 12px 间距的一半）；格子本身永远透明 —— */
      '[data-sidebar-right-guide] > div{' +
        'width:calc(50% - 6px);max-width:calc(50% - 6px);background:transparent}',
      '[data-sidebar-right-guide] > button{' +
        'width:calc(50% - 6px);max-width:calc(50% - 6px);background:transparent}',
      /* —— 入口卡片：铺满格子 + 上下内边距各减 4px —— */
      '[data-sidebar-right-guide] > div > [data-sidebar-right-guide-entry]{' +
        'width:100%;min-height:48px;padding:10px 8px;gap:6px}',
      /* 图标同步收小，给标题留位置 */
      '[data-sidebar-right-guide] > div > [data-sidebar-right-guide-entry] > :first-child{' +
        'width:24px;height:24px}',
      /* 快捷键提示缩到 0.8 倍（用 zoom 才真正让出布局宽度，transform 不改变占位） */
      '[data-sidebar-right-guide] > div > [data-sidebar-right-guide-entry] > :nth-child(3){' +
        'zoom:.8;flex:none}',
      /* —— 兜底：第三方插件经 sidebar.right.tab.guide.entry 插槽塞进来的自定义卡片，
            内部元素不许超出半宽格（用户 2026-11-09：后续新增入口一律按这套排版） —— */
      '[data-sidebar-right-guide] > div > *{max-width:100%}',
      '[data-sidebar-right-guide] > div > * > *{max-width:100%}',
    ].join('')

    /** 把覆盖样式挂到 head；重复调用幂等。 */
    function mount() {
      if (typeof document === 'undefined') return
      var head = document.head
      if (!head) {
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(mount)
        return
      }
      var existing = document.getElementById(STYLE_ID)
      if (existing) {
        if (existing.textContent !== CSS) existing.textContent = CSS
        return
      }
      var tag = document.createElement('style')
      tag.id = STYLE_ID
      tag.dataset.plugin = 'dsh-sidebar-guide-grid'
      tag.textContent = CSS
      head.appendChild(tag)
    }

    /** 不需要任何服务，只动 DOM。 */
    var inject = []

    /** Cordis 入口。 */
    function apply() {
      mount()
    }

    exports.inject = inject
    exports.apply = apply
    exports.internals = { CSS: CSS, STYLE_ID: STYLE_ID, mount: mount }

    return module.exports
  },
})

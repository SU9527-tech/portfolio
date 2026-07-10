/* =========================================================
   项目数据（ES Module，供 Vue 组件 import）
   想增删项目 → 直接改这个数组即可，视图会自动渲染

   每个项目可用字段：
     id          唯一标识（用于 /project/:id 路由）
     title       标题
     date        日期 YYYY-MM-DD
     status      状态（进行中 / 已完成 / 持续更新 …）
     role        你在项目里的角色
     subtitle    一句话副标题（详情页头图大标题下方）
     highlight   一句话亮点（详情页顶部亮点卡片）
     github      源码链接（留空字符串 '' 则不显示源码入口）
     tags        [标签]（用于头图胶囊 + 文末标签 + 首页归档）
     excerpt     首页卡片摘要（一句话）
     sections    正文分区，支持类型：
       { type:'h2', text }           二级标题（自动进入右侧目录）
       { type:'h3', text }           三级标题
       { type:'p',  text }           段落（支持 **加粗**）
       { type:'ul', items:[...] }    无序列表
       { type:'ol', items:[...] }    有序列表
       { type:'code', lang, code }   代码块（深色底，原文展示）
       { type:'blockquote', text }   引用块
       { type:'hr' }                 分隔线

   说明：本项目为个人练手作品集，内容以「真实学习轨迹」为底，
   代码多为示意/最小可运行版本，便于回顾与分享，非生产级实现。
   ========================================================= */
const GH = 'https://github.com/SU9527-tech' // 你的 GitHub 主页；如有独立仓库可替换成具体 repo 地址

export const projects = [
  {
    id: 'shopfloor',
    title: 'ShopFloorClient · 车间现场客户端',
    date: '2026-07-10',
    status: '进行中',
    role: '前端 + 后端雏形',
    subtitle: '车间工位的 Vue 客户端 —— 第一次把前端页面和 C# 后端真正连起来跑通',
    highlight: '第一次把 Vue 前端和 C# 后端真正连起来跑通，做出车间工位的雏形。',
    github: GH,
    tags: ['Vue', 'C#', 'MES', 'Vite'],
    excerpt: '对接 MES 的车间工位客户端雏形：Vue 写前端结构、C# 写数据交互，练手前后端联通。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '在兢美接触 **MES 业务** 后，我一直想自己动手做一个车间工位客户端：工人在工位上能看当前工单、上报产量、报异常。这个仓库是第一次把 **Vue 前端** 和 **C# 后端** 真正连起来跑通的雏形，也是我从「能看懂代码」迈向「能拼出系统」的关键一步。' },
      { type: 'h2', text: '2. 技术选型与思考' },
      { type: 'ul', items: [
        '**前端用 Vue 3 + Vite**：公司技术栈就是 Vue，练这个最贴合实际工作，学了能直接用上。',
        '**后端用 C# WebAPI**：和前端的 Mock 数据先并行开发，后端没就绪也能先推 UI。',
        '**通信先用 HTTP / JSON，暂不上 WebSocket**：工位刷新频率不高，先求稳，把闭环跑通比追实时更重要。',
        '**目标环境是车间触摸屏 + 浏览器**：所以布局要够大、够清晰，适配触屏点击。',
      ] },
      { type: 'h2', text: '3. 核心实现' },
      { type: 'p', text: '前端先用 `fetch` 拉工单列表，用 `v-for` 渲染成卡片；上报产量时把表单数据 POST 回后端接口。' },
      { type: 'h3', text: '工单列表（Vue 片段）' },
      { type: 'code', lang: 'vue', code: '<template>\n  <div class="wo-list">\n    <div class="wo-card" v-for="wo in workOrders" :key="wo.id">\n      <h3>{{ wo.code }}</h3>\n      <p>计划：{{ wo.qty }} 件 · 已完成 {{ wo.done }} 件</p>\n      <button @click="report(wo.id)">上报 +1</button>\n    </div>\n  </div>\n</template>\n\n<script setup>\nimport { ref, onMounted } from "vue";\n\nconst workOrders = ref([]);\n\nasync function load() {\n  const res = await fetch("/api/workorders");\n  workOrders.value = await res.json();\n}\n\nasync function report(id) {\n  await fetch(`/api/workorders/${id}/report`, { method: "POST" });\n  await load(); // 上报后刷新\n}\n\nonMounted(load);\n</script>' },
      { type: 'h3', text: '后端接收（C# WebAPI 雏形）' },
      { type: 'code', lang: 'csharp', code: '[ApiController]\n[Route("api/[controller]")]\npublic class WorkOrderController : ControllerBase\n{\n    // GET /api/workorders\n    [HttpGet]\n    public async Task<IActionResult> GetAll()\n    {\n        var list = await WorkOrderService.GetListAsync();\n        return Ok(new { code = 0, data = list });\n    }\n\n    // POST /api/workorders/{id}/report\n    [HttpPost("{id}/report")]\n    public async Task<IActionResult> Report(int id)\n    {\n        await WorkOrderService.ReportAsync(id);\n        return Ok(new { code = 0, msg = "已上报" });\n    }\n}' },
      { type: 'h2', text: '4. 难点与踩坑' },
      { type: 'ul', items: [
        '**开发环境跨域**：Vite 起的 5173 访问后端 5000 端口被浏览器拦，用 Vite 的 `server.proxy` 把 `/api` 代理到后端，开发期免跨域。',
        '**字段对不齐**：前端以为 `qty`，后端返回 `planQty`，联调半天。教训：先定一份接口字段约定（哪怕写在 README 里）。',
        '**加载态与错误态缺失**：一开始只写了成功分支，网络一抖就白屏。后来补了 `loading / error` 两个状态。',
      ] },
      { type: 'h2', text: '5. 阶段性成果' },
      { type: 'ul', items: [
        '跑通「拉取工单 → 展示 → 上报 → 刷新」最小闭环',
        '前后端联调从「完全懵」到「知道去哪查问题」',
        '对 HTTP 请求、JSON、REST 有了肌肉记忆',
      ] },
      { type: 'h2', text: '6. 总结与思考' },
      { type: 'blockquote', text: '全栈的价值不在于每端都写得多深，而在于能把一条业务线从前端点一下贯通到后端落库。先跑通闭环，再补深度。' },
      { type: 'h2', text: '7. 后续规划' },
      { type: 'ol', items: [
        '接入 MesReportApi 拉真实工单数据，替换 Mock',
        '加上「异常上报」模块（停机 / 缺料 / 质检）',
        '支持扫码枪扫码快速定位工位',
        '把上报结果写进 SQL Server，做简单的产量看板',
      ] },
    ],
  },
  {
    id: 'mesreport',
    title: 'MesReportApi · MES 报表接口',
    date: '2026-07-08',
    status: '进行中',
    role: '后端接口设计',
    subtitle: '第一个按「业务接口」思路拆层的 C# WebAPI，提供工单 / 产量 / 良率查询',
    highlight: '第一个按「业务接口」思路拆层的 C# WebAPI，理解了三层架构的边界。',
    github: GH,
    tags: ['C#', 'WebAPI', 'SQL Server', 'ASP.NET Core'],
    excerpt: '第一个正经的业务 API：用 C# WebAPI 提供报表数据查询接口，练习分层与接口设计。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '做车间客户端需要后端给数据，于是单独拆出一个**报表接口服务**，专门提供工单、产量、良率等查询能力。这是第一个按 **业务接口** 思路设计的 C# WebAPI，重点不是功能多，而是把「分层」和「接口规范」想清楚。' },
      { type: 'h2', text: '2. 技术选型与思考' },
      { type: 'ul', items: [
        '**ASP.NET Core WebAPI**：生态成熟、文档全，公司也用这套。',
        '**EF Core 还是 Dapper？** 先用 EF Core 跑通，复杂报表再考虑 Dapper 手写 SQL 控性能。',
        '**统一返回结构**：所有接口都返回 `{ code, data, msg }`，前端不用为每个接口写不同的解析。',
        '**Swagger**：自动生成接口文档，自己调试和给别人对接都方便。',
      ] },
      { type: 'h2', text: '3. 核心实现' },
      { type: 'p', text: '控制器只负责「收请求、调服务、返结果」，具体查询下沉到 Service 层，SQL 再下沉到 Repository 层。' },
      { type: 'code', lang: 'csharp', code: '[ApiController]\n[Route("api/[controller]")]\npublic class ReportController : ControllerBase\n{\n    private readonly IReportService _svc;\n    public ReportController(IReportService svc) => _svc = svc;\n\n    // GET /api/report/yield?line=A&date=2026-07-08\n    [HttpGet("yield")]\n    public async Task<IActionResult> Yield([FromQuery] string line, [FromQuery] string date)\n    {\n        var data = await _svc.GetYieldAsync(line, date);\n        return Ok(new { code = 0, data, msg = "ok" });\n    }\n}' },
      { type: 'h2', text: '4. 难点与踩坑' },
      { type: 'ul', items: [
        '**SQL 注入意识**：查询参数一律用参数化（`@line`），绝不拼字符串，养成习惯。',
        '**事务边界**：上报产量要同时写两张表，用 `TransactionScope` 包住，避免只写一半。',
        '**返回结构不一致**：早期有的返回 `List`、有的返回 `object`，前端苦不堪言，后来统一成 `{ code, data, msg }`。',
      ] },
      { type: 'h2', text: '5. 收获' },
      { type: 'p', text: '第一次认真区分了 **控制器 / 业务逻辑 / 数据访问** 三层，理解了为什么要把 SQL 关在 DAL 里不往外漏——不是为了装，是为了以后改一处不影响别处。' },
      { type: 'h2', text: '6. 总结与思考' },
      { type: 'blockquote', text: '好的后端不是「能返回数据」，而是「别人接你的接口时不骂人」。统一结构、写好文档、参数化查询，这三件做好了，协作成本立刻降一半。' },
      { type: 'h2', text: '7. 后续规划' },
      { type: 'ol', items: [
        '加 JWT 鉴权，区分内部 / 外部调用',
        '给高频报表加内存缓存，降低数据库压力',
        '把 Swagger 文档接给前端同事联调',
      ] },
    ],
  },
  {
    id: 'webtest',
    title: 'WebTest · Web 开发练习',
    date: '2026-06-15',
    status: '已完成',
    role: 'Web 基础练手',
    subtitle: '把 Web 开发的「最小闭环」跑熟 —— 请求怎么来、路由怎么匹配、页面怎么回',
    highlight: '把 Web 开发的「最小闭环」跑熟，后面项目不再是黑盒。',
    github: GH,
    tags: ['Web', 'C#', 'ASP.NET'],
    excerpt: '摸一遍 Web 前后端基本套路的小试验田，把 HTTP / 路由 / 表单这些概念跑通。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '一个纯练手的小站，目的不是做出产品，而是把 Web 开发的「最小闭环」跑熟：**请求怎么来、路由怎么匹配、页面怎么回**。概念清楚了，后面做 MesReportApi 和 ShopFloorClient 才不会是黑盒。' },
      { type: 'h2', text: '2. 练了什么' },
      { type: 'ul', items: [
        '**GET / POST 区别**：什么时候用查询、什么时候用提交',
        '**路由匹配**：`/home`、`/user/:id` 这类规则怎么写',
        '**表单提交与参数绑定**：前端字段怎么自动映射到后端参数',
        '**静态资源托管**：css / js / 图片放哪、怎么引用',
      ] },
      { type: 'h2', text: '3. 一个最小表单' },
      { type: 'code', lang: 'html', code: '<form method="post" action="/hello">\n  <input name="name" placeholder="你的名字" />\n  <button type="submit">提交</button>\n</form>' },
      { type: 'h2', text: '4. 小结' },
      { type: 'p', text: '这些概念看着简单，但跑通一次之后，脑子里就有了「用户点一下到服务器响应」的完整链路。后面所有 Web 项目都建立在这条链路上。' },
    ],
  },
  {
    id: 'myfirstapi',
    title: 'MyFirstApi · 我的第一个 Web API',
    date: '2026-05-20',
    status: '已完成',
    role: '入门第一步',
    subtitle: '从零建起的 Hello World 级 API —— 确认环境、启动与调试三件事',
    highlight: '确认了开发环境、启动与调试，所有项目的根都在这。',
    github: GH,
    tags: ['C#', 'WebAPI', '入门'],
    excerpt: '从零搭起来的 Hello World 级 API，确认了开发环境、调试与启动方式，算是入门第一步。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '跟着文档从零建了一个 WebAPI 项目，目标很朴素：让浏览器访问一个地址能返回一段 JSON。这一步把 **开发环境、启动、调试** 三件事确认清楚了——这三件事不顺，后面寸步难行。' },
      { type: 'h2', text: '2. 第一个接口' },
      { type: 'code', lang: 'csharp', code: '[ApiController]\n[Route("api/[controller]")]\npublic class HelloController : ControllerBase\n{\n    [HttpGet("hi")]\n    public IActionResult Hi()\n    {\n        return Ok(new { message = "你好，陆工", time = DateTime.Now });\n    }\n}' },
      { type: 'h2', text: '3. 调试技巧' },
      { type: 'ul', items: [
        '在方法里打 **断点**，用浏览器访问接口，看变量值一步步走',
        '用 **Swagger** 页面直接点「Try it out」发请求，比手敲 curl 省事',
        '看输出窗口的 **端口号**，别访问错地址',
      ] },
      { type: 'h2', text: '4. 收获' },
      { type: 'blockquote', text: '环境顺了，心就定了。后面所有项目都建立在这个「能跑起来、能打断点」的基础上。' },
    ],
  },
  {
    id: 'dbconn',
    title: 'DbConnectionTest · 数据库连接测试',
    date: '2026-04-12',
    status: '已完成',
    role: '数据库连通验证',
    subtitle: '踩通连接字符串与异常 —— 确认 C# 能连上 SQL Server 并 CRUD',
    highlight: '踩通连接字符串与异常，确认 C# 能连 SQL Server。',
    github: GH,
    tags: ['C#', 'SQL Server', 'ADO.NET'],
    excerpt: '验证 C# 连 SQL Server 的最小可行代码，搞清连接字符串、异常处理与基础 CRUD。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '后端离不开数据库，所以先用最小代码确认 C# 能连上 **SQL Server**、能查能写。重点不在功能，在 **踩通连接字符串和异常**——这是每个 .NET 后端都要过的第一关。' },
      { type: 'h2', text: '2. 连接片段' },
      { type: 'code', lang: 'csharp', code: 'var connStr = "Server=.;Database=Test;Trusted_Connection=True;";\nusing var conn = new SqlConnection(connStr);\ntry\n{\n    await conn.OpenAsync();\n    Console.WriteLine("连接成功");\n\n    var cmd = new SqlCommand("SELECT COUNT(*) FROM WorkOrder", conn);\n    var n = (int)await cmd.ExecuteScalarAsync();\n    Console.WriteLine($"工单总数：{n}");\n}\ncatch (SqlException ex)\n{\n    Console.WriteLine("连接失败：" + ex.Message);\n}' },
      { type: 'h2', text: '3. 踩坑记录' },
      { type: 'ul', items: [
        '连接字符串里 **实例名写错**，报「找不到服务器」——`.` 代表本机默认实例。',
        '**防火墙没放行端口**（默认 1433），本机能连、别的机器连不上。',
        '把连接放在 `using` 里，方法结束自动关闭，避免 **连接泄漏** 把连接池占满。',
      ] },
      { type: 'h2', text: '4. 一点常识' },
      { type: 'p', text: 'ADO.NET 底层有 **连接池**：每次 `new SqlConnection` 不一定真建新连接，而是从池里取，用完归还。所以放心地「即用即开、用完即关」，反而性能最好。' },
      { type: 'h2', text: '5. 收获' },
      { type: 'blockquote', text: '数据库连接不是「写完就完」，而是「出错能定位」。把连接字符串、异常、连接池这三件事想明白，后面写数据访问层就稳了。' },
    ],
  },
  {
    id: 'winforms',
    title: 'FirstWindowsFormsApp · WinForms 初探',
    date: '2026-03-18',
    status: '已完成',
    role: '桌面应用初探',
    subtitle: '桌面应用第一次体验 —— 拖控件、绑事件，理解 UI 与逻辑怎么搭在一起',
    highlight: '理解了 UI 控件与后台代码分离、事件是连接两者的线。',
    github: GH,
    tags: ['WinForms', 'C#', '桌面'],
    excerpt: '桌面应用的第一次体验，拖控件、绑事件，理解 UI 与逻辑怎么搭在一起。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '在公司有前辈带 **WPF**，但我想先从轻量的 **WinForms** 入手，把「**拖一个按钮、点一下弹个框**」这件最朴素的事跑通，建立桌面开发的直觉，再去看 WPF 的 XAML 就不慌了。' },
      { type: 'h2', text: '2. 做了什么' },
      { type: 'ul', items: [
        '从工具箱拖出 **Button / TextBox / Label**',
        '双击按钮，自动跳到点击事件里写逻辑',
        '把输入框的文本拼成一句话，显示在 Label 上',
      ] },
      { type: 'h2', text: '3. 核心代码' },
      { type: 'code', lang: 'csharp', code: 'private void btnGreet_Click(object sender, EventArgs e)\n{\n    string name = txtName.Text;            // 读取输入框\n    lblResult.Text = $"你好，{name}！";     // 写回标签\n}' },
      { type: 'h2', text: '4. WinForms 与 WPF 的小对比' },
      { type: 'ul', items: [
        'WinForms：拖控件即所见即所得，上手快，适合快速做内部小工具',
        'WPF：用 XAML 描述界面、数据绑定更强，适合复杂界面和长期维护',
        '共同本质：**事件驱动**——用户操作触发事件，代码响应',
      ] },
      { type: 'h2', text: '5. 收获' },
      { type: 'p', text: '理解了「UI 控件」和「后台代码」是分开的两层，**事件是把它们连起来的线**。这个认知后来写 Web 的前端交互也用得上。' },
    ],
  },
  {
    id: 'teamtest',
    title: 'FirstTeamTest · 团队协作练习',
    date: '2026-02-22',
    status: '已完成',
    role: '协作流程练习',
    subtitle: '不写业务，只练怎么和别人一起改同一份代码不打架',
    highlight: '不写业务，只练怎么和别人一起改同一份代码不打架。',
    github: GH,
    tags: ['Git', '协作', 'GitHub'],
    excerpt: '练习 Git 多人协作流程：分支、合并、提交规范，体会团队开发的基本节奏。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '真实工作一定是团队作战，所以单独练了一遍 **Git 协作流程**——不写业务，只练 **怎么和别人一起改同一份代码不打架**。流程顺了，才有资格谈效率。' },
      { type: 'h2', text: '2. 练了什么' },
      { type: 'ol', items: [
        '从 `main` 切出自己的 `feature/xxx` 分支',
        '本地提交，写清楚的 **commit message**',
        '合并回 `main`，并亲手解决一次冲突',
        '用 `.gitignore` 忽略 `bin/`、`obj/` 等产物',
      ] },
      { type: 'h2', text: '3. 常用命令' },
      { type: 'code', lang: 'bash', code: 'git checkout -b feature/xxx      # 开新分支\ngit add .                      # 暂存改动\ngit commit -m "feat: 添加了 xxx" # 提交\nngit checkout main                # 切回主干\ngit merge feature/xxx           # 合并' },
      { type: 'h2', text: '4. 提交信息规范（约定式提交）' },
      { type: 'ul', items: [
        '`feat:` 新功能 · `fix:` 修 bug · `docs:` 文档 · `refactor:` 重构',
        '正文写「做了什么 + 为什么」，不是「改了文件」',
        '示例：`fix: 修复上报产量后未刷新列表的问题`',
      ] },
      { type: 'h2', text: '5. 小结' },
      { type: 'blockquote', text: '提交信息写清楚，是在帮未来的自己和后端的同事。Git 不是备份工具，是团队协作的沟通记录。' },
    ],
  },
  {
    id: 'consoleapp',
    title: 'ConsoleApp1 · 控制台起步',
    date: '2026-01-05',
    status: '已完成',
    role: 'C# 语法起步',
    subtitle: 'C# 语法起步 —— 在黑框框里把变量、循环、方法过一遍',
    highlight: '在黑框框里把变量、循环、方法过一遍，万丈高楼平地起。',
    github: GH,
    tags: ['C#', '基础', '语法'],
    excerpt: '一切的开始：在控制台里跑通变量、循环、方法，把 C# 语法第一遍过完。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '陆工正式学 **C#** 的第一步。没有界面、没有框架，只在黑框框里把 **变量、条件、循环、方法** 这些最基础的语法过一遍。别看它土，所有高级项目都是这些积木堆出来的。' },
      { type: 'h2', text: '2. 练了什么' },
      { type: 'ul', items: [
        '**变量与基本类型**：int / string / bool 怎么声明',
        '**分支**：if / switch 怎么走不同逻辑',
        '**循环**：for / while 重复做事',
        '**方法**：把一段逻辑封装起来，传参、返回值',
      ] },
      { type: 'h2', text: '3. 一段代码' },
      { type: 'code', lang: 'csharp', code: 'for (int i = 1; i <= 5; i++)\n{\n    Console.WriteLine($"第 {i} 次练习");\n}\n\nint Add(int a, int b) => a + b;\nConsole.WriteLine(Add(3, 4)); // 7' },
      { type: 'h2', text: '4. 感慨' },
      { type: 'blockquote', text: '万丈高楼平地起。这个最朴素的 ConsoleApp，是后面所有项目的根——连循环都写不顺，就别急着上框架。' },
    ],
  },
  {
    id: 'test',
    title: 'Test · 综合试验场',
    date: '2025-12-01',
    status: '持续更新',
    role: '安全试错区',
    subtitle: '随手验证各种小想法的地方 —— 算法片段、语法试验、第三方库试用',
    highlight: '草稿本里常常长出真正的作品。',
    github: GH,
    tags: ['C#', '试验区', '算法'],
    excerpt: '随手验证各种小想法的地方：算法片段、语法试验、第三方库试用都丢在这里。',
    sections: [
      { type: 'h2', text: '1. 项目背景' },
      { type: 'p', text: '一个不追求「完成」的仓库，专门用来 **安全地试错**：看到一段有意思的代码就粘进来跑一下，验证完就留着当参考。它不像作品，更像 **草稿本**。' },
      { type: 'h2', text: '2. 里面有什么' },
      { type: 'ul', items: [
        '**算法小片段**：排序、查找、递归练习',
        '**第三方库试用**：装个 NuGet 包跑通最小例子',
        '**语法对照实验**：同一件事的不同写法比对',
        '**随手记的坑**：报错信息 + 解决办法',
      ] },
      { type: 'h2', text: '3. 定位' },
      { type: 'blockquote', text: '它不像作品，更像草稿本。但草稿本里常常长出真正的作品——很多项目的第一个原型，都是从这里的一行测试代码开始的。' },
    ],
  },
]

export function findProject(id) {
  return projects.find((p) => p.id === id) || null
}

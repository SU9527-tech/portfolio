// 技术能力自评矩阵 —— 用于首页「能力雷达图」
// 评分 0-100 为陆工当前阶段的主观自评，刻意保留真实梯度（不夸大），
// 既是作品集的量化展示，也和「学会是目的，项目是手段」的调性一致。
// 想调整只需改这个数组，雷达图会自动重绘。

export const skillRadar = [
  { name: 'Vue / 前端',   value: 70, desc: '看得懂结构、能改能调，独立写还依赖 AI' },
  { name: 'C# / .NET',    value: 55, desc: '基础语法过关，正往 WebAPI / 分层走' },
  { name: 'MES 业务',     value: 60, desc: '跟章工学业务流程，边做边理解' },
  { name: 'SQL Server',   value: 50, desc: 'CRUD 基础，复杂查询待练' },
  { name: '架构 / 分层',  value: 65, desc: 'DeviceMonitor 练过 BLL/DAL/UI 边界' },
  { name: '全栈联通',     value: 55, desc: 'ShopFloor + MesReportApi 跑通最小闭环' },
  { name: '工程协作',     value: 72, desc: 'Git 分支 / 合并 / 提交规范已养成' },
  { name: '工具链 / AI',  value: 85, desc: 'Ollama / Claude Code 部署调度一把好手' },
]

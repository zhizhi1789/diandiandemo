# 点点 Demo — 开发交接文档

> **更新时间**：2026-03-18 20:14  
> **项目路径**：`/Users/user/Documents/点点demo_codewiz/diandian-demo`  
> **当前状态**：M1~M7 ✅ 已完成，**M8 待开发（从这里开始）**

---

## 一、项目概述

这是一个**纯前端 Web 交互 Demo**，模拟"点点"AI 个人生活助理的核心用户流程。模拟 iPhone 尺寸（393×852px），所有数据本地 mock，不接入真实 AI，对话由预编排脚本驱动。

**核心体验**：用户通过与 AI Agent（健身教练/私人助理/营养师）的对话，完成训练计划制定 → 训练执行 → 训练总结 → 主动建议 → 跨 Agent 协同的完整闭环。

## 二、关键参考文档

| 文档 | 路径 | 作用 |
|------|------|------|
| **技术方案（最核心）** | `/Users/user/Documents/点点demo_codewiz/点点Demo技术方案.md` | 完整架构设计、组件规格、Flow 编排、CSS 规范 |
| **PRD** | `/Users/user/Documents/zhizhiwork/点点Demo_PRD.md` | 产品需求、对话脚本、交互逻辑 |
| **PRD 最终版** | `/Users/user/Documents/zhizhiwork/demo prd 最终版.md` | 各 Flow 详细对话脚本（A/B/C/D/E） |
| **视觉规范** | `/Users/user/Documents/zhizhiwork/demo 视觉/点点Demo视觉规范.md` | 配色、字体、圆角、间距等完整 CSS 变量 |
| **训练计划素材** | `/Users/user/Documents/zhizhiwork/demo素材/4 周增肌训练计划模板md.md` | 训练动作数据来源 |
| **卧推笔记素材** | `/Users/user/Documents/zhizhiwork/demo素材/卧推相关小红书帖子.md` | Flow B 动作问答的内容来源 |
| **手环数据素材** | `/Users/user/Documents/zhizhiwork/demo素材/手环运动结果.md` | Flow C 训练总结的数据来源 |
| **机票信息素材** | `/Users/user/Documents/zhizhiwork/demo素材/机票信息.md` | Flow E 机票搜索的数据来源 |

## 三、技术栈

| 维度 | 选型 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | CSS Modules + CSS Variables |
| 状态管理 | Zustand |
| 路由 | React Router v6 |
| 动画 | Framer Motion |
| 图标 | Lucide React |

**依赖已安装完毕**，`npm install` 不需要重新执行。

## 四、当前目录结构

```
diandian-demo/
├── public/favicon.svg
├── src/
│   ├── main.tsx                    ✅ 入口文件
│   ├── App.tsx                     ✅ 路由配置（BrowserRouter）
│   ├── vite-env.d.ts               ✅ Vite 类型声明
│   ├── styles/
│   │   └── global.css              ✅ CSS 变量（40+）+ 全局样式重置
│   ├── types/
│   │   ├── chat.ts                 ✅ ChatMessage, ScriptNode, ChatScript, TriggerType
│   │   └── index.ts                ✅ Agent, Exercise, TrainingPlan, CalendarEvent, NotificationItem 等
│   ├── components/
│   │   ├── AppShell/               ✅ 手机壳容器（状态栏 + 内容区 + Home Indicator）
│   │   ├── NavBar/                 ✅ 顶部导航栏（支持返回/品牌图标）
│   │   ├── BottomTabBar/           ✅ 底部 Tab 栏（首页/通知/我的，支持通知红点）
│   │   ├── ChatBubble/             ✅ 对话气泡（用户右对齐#E6E6E6 / AI左对齐#FFFFFF）
│   │   ├── StructuredCard/         ✅ 结构化卡片容器（rgba白底, 圆角36px, 353px宽）
│   │   ├── OptionButton/           ✅ 选项按钮 + OptionGroup布局容器
│   │   ├── CTAButton/              ✅ CTA按钮（capsule胶囊 / full全宽）
│   │   ├── InputBar/               ✅ 底部输入栏（支持预填充文本点击发送）
│   │   ├── TypingIndicator/        ✅ AI打字指示器（三圆点跳动动画）
│   │   ├── AgentAvatar/            ✅ Agent头像（SVG渐变圆形+首字图标）
│   │   ├── AgentCard/              ✅ Agent列表卡片（头像+名称+描述+最新消息）
│   │   └── NotificationCard/       ✅ 通知卡片（来源Agent+原因+建议+操作按钮）
│   ├── features/
│   │   ├── home/HomePage.tsx       ✅ 3个AgentCard列表，点击进入对话页
│   │   ├── notification/           ✅ 从notificationStore读取并渲染NotificationCard列表
│   │   ├── agent-detail/
│   │   │   ├── AgentDetailPage.tsx  ✅ [M7完成] 接入全部 Flow A/B/C 的 renderCard
│   │   │   ├── ChatFlow.tsx        ✅ 对话流渲染（自动滚动+间距规则+renderCard回调）
│   │   │   ├── ChatFlow.module.css ✅
│   │   │   └── AgentDetailPage.module.css ✅
│   │   ├── flow-a/                 ✅ [M5]
│   │   │   ├── TrainingPlanCard.tsx         ✅ 训练计划卡片（概要+3天动作列表）
│   │   │   ├── TrainingPlanCard.module.css  ✅
│   │   │   ├── CalendarConfirmCard.tsx      ✅ 日历确认卡片（4选项+选中状态）
│   │   │   └── CalendarConfirmCard.module.css ✅
│   │   ├── flow-b/                 ✅ [M6]
│   │   │   ├── TrainingReminderCard.tsx     ✅ 训练前提醒卡（主题/时长/准备事项+CTA）
│   │   │   ├── TrainingReminderCard.module.css ✅
│   │   │   ├── TodayTrainingCard.tsx        ✅ 今日训练卡（进度条/肌群/动作列表/编辑/完成）
│   │   │   ├── TodayTrainingCard.module.css ✅
│   │   │   ├── ExerciseAdviceCard.tsx       ✅ 卧推建议卡（要点/错误/笔记展开/上传mock）
│   │   │   └── ExerciseAdviceCard.module.css ✅
│   │   └── flow-c/                 ✅ [M7]
│   │       ├── DataPermissionCard.tsx       ✅ 数据权限请求卡（3选项+选中锁定）
│   │       ├── DataPermissionCard.module.css ✅
│   │       ├── TrainingSummaryCard.tsx       ✅ 训练总结卡（数据网格+心率区间+体感反馈）
│   │       └── TrainingSummaryCard.module.css ✅
│   ├── data/
│   │   ├── agents.ts               ✅ 3个Agent数据
│   │   ├── user-profile.ts         ✅ 用户资料（小林）
│   │   ├── training-plan.ts        ✅ 完整训练计划（3天×6动作，含targetMuscles/caloriesPerSet/alternatives）
│   │   ├── wearable-data.ts        ✅ 手环运动数据（55min/278kcal/128bpm）
│   │   ├── xhs-notes.ts            ✅ 2条小红书卧推笔记（含完整content数组）
│   │   ├── flight-info.ts          ✅ 机票信息（5/16-17 浦东↔羽田 ¥1891）
│   │   └── scripts/
│   │       ├── welcome-scripts.ts  ✅ 私人助理+营养师的欢迎脚本
│   │       ├── flow-a-script.ts    ✅ Flow A 脚本 + getFitnessCoachFullScript()（合并A+B+C全部节点）
│   │       ├── flow-b-script.ts    ✅ [M6] Flow B 脚本节点（B1~B5）
│   │       └── flow-c-script.ts    ✅ [M7] Flow C 脚本节点（C1~C4）+ 通知推送副作用
│   ├── hooks/
│   │   └── useScriptedChat.ts      ✅ 脚本化对话引擎Hook
│   └── store/
│       ├── chatStore.ts            ✅ 对话消息/Flow/打字状态管理
│       ├── trainingStore.ts        ✅ 训练计划/进度/记录管理
│       ├── calendarStore.ts        ✅ 日历事件管理（含 removeEvent / detectConflict）
│       ├── notificationStore.ts    ✅ 通知列表/未读数管理（含 handleAction）
│       └── demoStore.ts            ✅ 演示阶段控制
├── index.html                      ✅
├── package.json                    ✅ 依赖已安装
├── tsconfig.json                   ✅ 含 @/* 路径别名
└── vite.config.ts                  ✅ 含 @/ 路径 resolve
```

## 五、已完成里程碑摘要

### M5：Flow A — 首次建立训练计划

- 脚本合并方案：`getFitnessCoachFullScript()` 返回完整节点链
- Flow A 节点：`fw-1` → `fw-2` → `A2` → `A3` → `A4` → `A5` → `A5-confirm`
- 组件：`TrainingPlanCard`、`CalendarConfirmCard`
- 副作用：`trainingStore.createPlan()` + `calendarStore.addEvents()`

### M6：Flow B — 训练日执行

- 脚本文件：`flow-b-script.ts` 导出 `flowBNodes`，在 `flow-a-script.ts` 中合并
- 节点串联：`A5-confirm.nextNodeId → 'B1'`
- Flow B 节点：`B1`(训练提醒卡) → `B2`(开始训练) → `B3`(今日训练卡) → `B4`(用户提问) → `B5`(动作建议卡)
- 组件：
  - `TrainingReminderCard`：训练日提醒（主题/时长/动作数/准备事项 + "开始训练"CTA）
  - `TodayTrainingCard`：**最复杂组件**（进度条/肌群标签/卡路里实时计算/动作列表可展开/完成标记/编辑按钮组/完成训练CTA），内含 ProgressBar、ExerciseItem、EditToolbar 三个子组件
  - `ExerciseAdviceCard`：卧推建议（核心要点/常见错误/初学者建议/小红书笔记展开/上传截图mock）
- 副作用：`trainingStore.startTraining()`
- 预填充文本：`'B4': '卧推有什么注意事项？'`

### M7：Flow C — 训练后总结

- 脚本文件：`flow-c-script.ts` 导出 `flowCNodes`，在 `flow-a-script.ts` 中合并
- 节点串联：`B5.nextNodeId → 'C1'`
- Flow C 节点：`C1`(等待"完成训练") → `C2`(数据权限卡) → `C2-confirm`(选择权限) → `C3`(训练总结卡) → `C4`(选择体感→写入记录)
- 组件：
  - `DataPermissionCard`：数据权限请求（"读取运动摘要"标题 + 3选项：允许一次/始终允许/不允许，选中后锁定）
  - `TrainingSummaryCard`：训练总结（2×2数据网格 + 心率区间可视化条 + 体感反馈3选项）
- 副作用（C4）：
  - `trainingStore.saveTrainingRecord()` 保存训练记录
  - `trainingStore.setFeedback()` 保存体感反馈
  - **`notificationStore.addNotification()`** 推送"训练负荷建议"通知 → 为 Flow D 做准备
- **关键**：Flow D 的通知数据已在 C4 的 sideEffects 中自动写入 `notificationStore`，通知页会自动渲染

## 六、完整对话流转链（健身教练）

```
fw-1(欢迎) → fw-2(用户输入目标) 
→ A2(追问时间) → A3(用户回复时间) → A4(训练计划卡) → A5(日历确认卡) → A5-confirm(确认)
→ B1(训练提醒卡) → B2(开始训练) → B3(今日训练卡) → B4(用户提问) → B5(动作建议卡)
→ C1(完成训练按钮) → C2(数据权限卡) → C2-confirm(选择权限) → C3(训练总结卡) → C4(体感反馈→记录+通知)
```

所有节点通过 `getFitnessCoachFullScript()` 合并为一个完整脚本返回。

## 七、已完成模块的关键接口说明

### 7.1 useScriptedChat Hook — `src/hooks/useScriptedChat.ts`

```typescript
function useScriptedChat(script: ChatScript) {
  return {
    messages: ChatMessage[],           // 当前对话消息列表
    isTyping: boolean,                 // AI 是否正在打字
    currentNodeId: string | null,      // 当前等待的脚本节点ID
    sendUserMessage: (text: string) => void,  // 用户发送消息
    handleAction: (actionType, actionId) => void, // 按钮/选项点击（支持灵活匹配）
    executeNode: (nodeId: string, context?) => void, // 直接执行指定节点
    startChat: () => void,             // 启动对话（执行入口节点）
    stopChat: () => void,              // 停止执行（组件卸载时调用）
    appendScript: (script: ChatScript) => void, // 追加脚本（Flow串联，当前未使用）
    setMessages: setter,               // 直接设置消息列表
  };
}
```

核心逻辑：
1. `startChat()` → 执行入口节点 → AI消息逐条发送（间隔800~2000ms）
2. 每条AI消息发送前显示TypingIndicator
3. 节点执行完毕后调用 `sideEffects()` 写入Zustand store
4. `auto` 类型节点自动推进，其他类型等待用户操作
5. 支持 `demoStore.fastForward` 快进模式（跳过延迟）
6. `handleAction` 灵活匹配：trigger 不带 id → 只要类型匹配就执行

### 7.2 AgentDetailPage renderCard 当前处理的 contentType

```typescript
case 'training-plan':     → <TrainingPlanCard plan={cardData.plan} />
case 'calendar-confirm':  → <CalendarConfirmCard ... onSelect={handleAction} />
case 'training-reminder': → <TrainingReminderCard onStartTraining={handleAction} />
case 'today-training':    → <TodayTrainingCard onFinishTraining={handleAction} />
case 'exercise-advice':   → <ExerciseAdviceCard />
case 'data-permission':   → <DataPermissionCard ... onSelect={handleAction} />
case 'training-summary':  → <TrainingSummaryCard ... onFeedbackSelect={handleAction} />

// M8 需新增的 case：
case 'flight-search':     → <FlightSearchCard ... />
```

### 7.3 当前预填充文本映射

```typescript
'fitness-coach': {
  'fw-2': '我是一个完全的初学者...',
  'A3':   '周二、周四早上 9-10 点，周六下午 4-5 点',
  'B4':   '卧推有什么注意事项？',
}
'personal-assistant': {
  'aw-2': '我想在5-6月周末去一次东京，找一下2000以下的机票',
}
```

### 7.4 Store 状态速查

**trainingStore**（`src/store/trainingStore.ts`）：
```typescript
// 已被各 Flow 调用的方法：
createPlan(plan)            // Flow A: A4 副作用
startTraining()             // Flow B: B2 副作用
completeExercise(id)        // Flow B: TodayTrainingCard 交互
addExercise / removeExercise / adjustSets  // Flow B: TodayTrainingCard 编辑
setFeedback(feedback)       // Flow C: TrainingSummaryCard 交互
saveTrainingRecord(record)  // Flow C: C4 副作用
skipSession(date)           // ⬜ Flow E 用（已实现，待调用）
```

**calendarStore**（`src/store/calendarStore.ts`）：
```typescript
addEvents(events)           // Flow A: A5-confirm 副作用（已用）; Flow D: 接受建议时用
removeEvent(eventId)        // ⬜ Flow E 用（已实现，待调用）
detectConflict(date)        // ⬜ Flow E 用（已实现，待调用）
```

**notificationStore**（`src/store/notificationStore.ts`）：
```typescript
addNotification(item)       // Flow C: C4 副作用已自动写入 Flow D 通知
markAsRead(id)              // 通知页已有调用
handleAction(id, actionId)  // 通知页已有调用，点击后设 handled=true
```

### 7.5 mock 数据结构速查

**机票信息** `flight-info.ts`（M8 重点数据）：
```typescript
{
  outbound: { date: '5/16', dayOfWeek: '周六', departureTime: '07:20', departureAirport: '浦东T2', arrivalTime: '10:10', arrivalAirport: '羽田T1' },
  inbound:  { date: '5/17', dayOfWeek: '周日', departureTime: '21:05', departureAirport: '羽田T1', arrivalTime: '23:55', arrivalAirport: '浦东T2' },
  airline: '东方航空', price: 1891, currency: '¥'
}
```

**NotificationItem 类型**（通知卡片数据结构）：
```typescript
interface NotificationItem {
  id: string;
  agentId: string;       // 'fitness-coach' | 'personal-assistant'
  agentName: string;     // 'AI 健身教练' | 'AI 私人助理'
  title: string;
  reason: string;        // "为什么发起"的内容
  suggestion: string;    // "建议"的内容
  confirmText: string;   // "需要你确认：xxx"
  actions: { id: string; label: string; primary?: boolean }[];
  timestamp: number;
  read: boolean;
  handled: boolean;
}
```

## 八、开发里程碑 & 进度

| 阶段 | 内容 | 状态 |
|------|------|------|
| **M1：基础框架** | 项目搭建、CSS 变量、AppShell、路由、Tab 栏 | ✅ 已完成 |
| **M2：通用 UI 组件** | ChatBubble、StructuredCard、OptionButton、CTAButton、InputBar、TypingIndicator、AgentAvatar | ✅ 已完成 |
| **M3：对话引擎** | useScriptedChat Hook、chatStore | ✅ 已完成 |
| **M4：首页 + 通知页 + 对话主界面** | AgentCard列表、NotificationCard、ChatFlow、AgentDetailPage | ✅ 已完成 |
| **M5：Flow A** | 训练计划对话流 + TrainingPlanCard + CalendarConfirmCard + 脚本合并 | ✅ 已完成 |
| **M6：Flow B** | 训练日执行 + TrainingReminderCard + TodayTrainingCard（含编辑） + ExerciseAdviceCard | ✅ 已完成 |
| **M7：Flow C** | 训练总结 + DataPermissionCard + TrainingSummaryCard + 通知推送 | ✅ 已完成 |
| **M8：Flow D + E** | 通知页主动建议 + 私人助理对话 + FlightSearchCard + 冲突检测 | ⬜ **待开发（从这里开始）** |
| **M9：动效 + 调试** | Framer Motion 动画、演示控制器 | ⬜ 待开发 |

## 九、M8 待开发：Flow D + E — 主动建议 & 跨 Agent 协同

M8 包含两个 Flow，分别在**通知页**和**私人助理对话页**展开。

### 9.1 Flow D：主动建议（通知页增强）

#### 当前状态

Flow D 的**数据写入已完成**：Flow C 的 C4 节点 sideEffects 中，`notificationStore.addNotification()` 会自动推送一条"训练负荷建议"通知。用户回到首页点击"通知"Tab 即可看到。

通知页 `NotificationPage.tsx` + `NotificationCard` 组件**已有完整渲染逻辑**，可以正确显示通知内容和操作按钮。

#### 需要补充的功能

1. **通知操作副作用**：当前 `notificationStore.handleAction()` 只将通知标记为 `handled: true`，**但没有执行实际的业务副作用**。需要在通知页（或 NotificationCard 的回调中）增加以下逻辑：

```typescript
// 用户点击"接受建议" → 需要执行以下副作用
if (actionId === 'accept') {
  // 1. 添加一次低强度心肺训练到日历
  calendarStore.addEvents([{
    id: 'cardio-recovery-xxx',
    date: '下一个可用日期',
    time: '17:00',
    title: '低强度心肺恢复 · 30分钟',
    type: 'cardio',
    agentId: 'fitness-coach',
  }]);
  // 2. 标记通知已处理
  notificationStore.handleAction(notificationId, actionId);
}
```

2. **方案选择**（推荐方案 A）：
   - **方案 A**：在 `NotificationPage.tsx` 中，增强 `onAction` 回调，根据 `notification.agentId` + `actionId` 分发业务逻辑
   - **方案 B**：在 `notificationStore.handleAction()` 内部执行副作用（耦合度较高）

3. **底部 Tab 栏红点**：确认 `BottomTabBar` 组件已正确读取 `notificationStore.unreadCount`，在通知 Tab 上显示红点

### 9.2 Flow E：跨 Agent 协同（私人助理对话）

这是 Demo 的收官体验，涉及**私人助理 Agent** 的对话页。

#### 脚本节点编排（参考技术方案 5.5 节）

```
aw-1(私人助理欢迎) → aw-2(用户输入机票需求)
→ E1(AI回复+创建观察任务) → E2(FlightSearchCard 展示机票) → E3(用户确认购买)
→ E4(AI检测到冲突+推送冲突通知到通知页)
```

| 节点 | 触发方式 | AI 回复内容 | 渲染组件 | 副作用 |
|------|----------|------------|----------|--------|
| E1 | `auto(1500ms)` 从 aw-2 接续 | "好的，我帮你创建一个价格观察任务..." | text | — |
| E2 | `auto(2000ms)` | 机票搜索结果 | **FlightSearchCard** | — |
| E3 | `option-select`（确认购买） | "好的，已帮你锁定价格！不过我发现..." | text | — |
| E4 | `auto(1500ms)` | 冲突检测提示 | text | **推送冲突通知** |

#### 串联关键

1. 在 `welcome-scripts.ts` 中，**私人助理的 `aw-2` 节点 `nextNodeId`** 已注释待设置，需要指向 `'E1'`
2. 创建 `src/data/scripts/flow-e-script.ts` 导出 Flow E 节点数组
3. 参照健身教练的方式，创建 `getPersonalAssistantFullScript()` 函数，合并欢迎节点 + Flow E 节点
4. 在 `AgentDetailPage.tsx` 的 `getFullScript()` 中，为 `'personal-assistant'` 返回合并脚本

#### 需要创建的组件

##### FlightSearchCard — `src/features/flow-e/FlightSearchCard.tsx`

机票搜索结果卡，使用 StructuredCard 容器：
- 标题："✈️ 找到1个合适的航班"
- 副标题："满足你的时间和价格要求"
- 去程：日期 + 时间 + 机场（浦东T2 → 羽田T1）
- 回程：日期 + 时间 + 机场（羽田T1 → 浦东T2）
- 底部：航空公司 + 价格（¥1,891）
- 操作按钮：继续观察 / 确认购买
- 数据来源：`data/flight-info.ts`
- 用户点击"确认购买" → `handleAction('option-select', 'confirm-purchase')`

视觉参考（技术方案 5.5 节的 ASCII 图）：
```
┌────────────────────────────────────┐
│  ✈️ 找到1个合适的航班               │
│  满足你的时间和价格要求              │
│                                    │
│  ┌────────────────────────────┐    │
│  │ 5/16 周六                  │    │
│  │ 07:20 浦东T2 → 10:10 羽田T1│    │
│  ├────────────────────────────┤    │
│  │ 5/17 周日                  │    │
│  │ 21:05 羽田T1 → 23:55 浦东T2│    │
│  ├────────────────────────────┤    │
│  │ 东方航空     ¥1,891        │    │
│  └────────────────────────────┘    │
│                                    │
│  ┌──────────┐  ┌──────────────┐   │
│  │ 继续观察  │  │ 确认购买      │   │
│  └──────────┘  └──────────────┘   │
└────────────────────────────────────┘
```

#### 脚本文件创建

新建 `src/data/scripts/flow-e-script.ts`：

```typescript
import type { ScriptNode } from '@/types';
import { flightInfo } from '@/data/flight-info';
import { useNotificationStore } from '@/store/notificationStore';

export const flowENodes: ScriptNode[] = [
  // E1: AI 回复创建价格观察任务
  {
    id: 'E1',
    trigger: { type: 'auto', delayMs: 1500 },
    messages: [
      {
        id: 'E1-m1', role: 'ai', contentType: 'text',
        text: '好的！我帮你创建一个价格观察任务，搜索 5-6 月周末上海到东京的机票，价格 ≤2000 元。',
        timestamp: 0, agentId: 'personal-assistant',
      },
      {
        id: 'E1-m2', role: 'ai', contentType: 'text',
        text: '正在搜索中... 找到了一个不错的选择 ✈️',
        timestamp: 0, agentId: 'personal-assistant',
      },
    ],
    nextNodeId: 'E2',
  },

  // E2: 展示 FlightSearchCard
  {
    id: 'E2',
    trigger: { type: 'auto', delayMs: 2000 },
    messages: [
      {
        id: 'E2-m1', role: 'ai', contentType: 'flight-search',
        text: '', cardData: { flight: flightInfo },
        timestamp: 0, agentId: 'personal-assistant',
      },
    ],
    nextNodeId: 'E3',
  },

  // E3: 等待用户选择（确认购买/继续观察）
  {
    id: 'E3',
    trigger: { type: 'option-select' },
    messages: [
      {
        id: 'E3-m1', role: 'ai', contentType: 'text',
        text: '好的，已帮你锁定这个价格！东京之旅值得期待 🗼',
        timestamp: 0, agentId: 'personal-assistant',
      },
      {
        id: 'E3-m2', role: 'ai', contentType: 'text',
        text: '不过我注意到 5/16（周六）你有一个训练计划安排。让我帮你协调一下... 📅',
        timestamp: 0, agentId: 'personal-assistant',
      },
    ],
    nextNodeId: 'E4',
  },

  // E4: 自动推送冲突通知
  {
    id: 'E4',
    trigger: { type: 'auto', delayMs: 1500 },
    messages: [
      {
        id: 'E4-m1', role: 'ai', contentType: 'text',
        text: '我已经通知了你的健身教练关于行程冲突的事。你可以在通知页查看并确认调整方案 👆',
        timestamp: 0, agentId: 'personal-assistant',
      },
    ],
    sideEffects: () => {
      // 推送冲突通知到通知页
      useNotificationStore.getState().addNotification({
        id: `notify-conflict-${Date.now()}`,
        agentId: 'personal-assistant',
        agentName: 'AI 私人助理',
        title: '行程冲突提醒',
        reason: '发现你的东京出行（5/16-17）与周六训练计划冲突',
        suggestion: '是否取消这次训练或换个时间？',
        confirmText: '需要你确认：调整训练日程',
        actions: [
          { id: 'cancel-training', label: '取消本次训练', primary: true },
          { id: 'reschedule', label: '换个时间' },
        ],
        timestamp: Date.now(),
        read: false,
        handled: false,
      });
    },
  },
];
```

#### AgentDetailPage 修改

1. 在 `getFullScript()` 中增加私人助理分支：

```typescript
import { getPersonalAssistantFullScript } from '@/data/scripts/flow-e-script';

function getFullScript(agentId: string): ChatScript | null {
  if (agentId === 'fitness-coach') return getFitnessCoachFullScript();
  if (agentId === 'personal-assistant') return getPersonalAssistantFullScript();
  return getWelcomeScript(agentId);
}
```

2. 在 `renderCard` 中新增 `flight-search` case：

```typescript
case 'flight-search': {
  const flight = message.cardData?.flight;
  if (!flight) return null;
  return (
    <FlightSearchCard
      flight={flight}
      onSelect={(optionId) => handleAction('option-select', optionId)}
    />
  );
}
```

#### 通知页副作用增强

在 `NotificationPage.tsx` 中增强 `onAction` 回调：

```typescript
const handleNotificationAction = (notificationId: string, actionId: string) => {
  const notification = notifications.find((n) => n.id === notificationId);
  if (!notification) return;

  // Flow D：健身教练的训练负荷建议
  if (notification.agentId === 'fitness-coach' && actionId === 'accept') {
    calendarStore.addEvents([{
      id: `cardio-${Date.now()}`,
      date: '下一个可用日期', // 计算具体日期
      time: '17:00',
      title: '低强度心肺恢复 · 30分钟',
      type: 'cardio',
      agentId: 'fitness-coach',
    }]);
  }

  // Flow E：私人助理的行程冲突
  if (notification.agentId === 'personal-assistant' && actionId === 'cancel-training') {
    // 移除冲突的训练日历事件
    // calendarStore.removeEvent(冲突事件ID);
    // trainingStore.skipSession('冲突日期');
  }

  // 统一标记为已处理
  handleAction(notificationId, actionId);
};
```

### 9.3 getPersonalAssistantFullScript 创建

参照健身教练的合并方案，在 `flow-e-script.ts` 中导出合并函数：

```typescript
import { personalAssistantWelcomeScript } from './welcome-scripts';

export function getPersonalAssistantFullScript(): ChatScript {
  return {
    id: 'personal-assistant-full',
    flowName: '私人助理完整脚本',
    agentId: 'personal-assistant',
    entryNodeId: 'aw-1',
    nodes: [
      // 欢迎节点（aw-1 不变）
      personalAssistantWelcomeScript.nodes[0],
      // aw-2 指向 Flow E 入口
      {
        ...personalAssistantWelcomeScript.nodes[1],
        nextNodeId: 'E1',
      },
      // Flow E 节点
      ...flowENodes,
    ],
  };
}
```

### 9.4 M8 开发步骤汇总

建议按以下顺序开发：

| 步骤 | 任务 | 文件 |
|------|------|------|
| 1 | 创建 FlightSearchCard 组件 + CSS | `src/features/flow-e/FlightSearchCard.tsx` + `.module.css` |
| 2 | 创建 Flow E 脚本 + 合并函数 | `src/data/scripts/flow-e-script.ts` |
| 3 | 修改 AgentDetailPage：`getFullScript` 加私人助理分支 + `renderCard` 加 `flight-search` | `src/features/agent-detail/AgentDetailPage.tsx` |
| 4 | 增强通知页：Flow D/E 通知操作的业务副作用 | `src/features/notification/NotificationPage.tsx` |
| 5 | TypeScript 类型检查 + 构建验证 | `npx tsc --noEmit && npx vite build` |

### 9.5 已有接口 & Store 方法速查（M8 需用到）

以下方法 **已全部实现**，M8 开发时直接调用即可：

| Store | 方法 | 用途 |
|-------|------|------|
| `calendarStore` | `addEvents(events)` | Flow D 接受建议时添加心肺训练 |
| `calendarStore` | `removeEvent(eventId)` | Flow E 取消冲突训练 |
| `calendarStore` | `detectConflict(date)` | Flow E 检测日期冲突 |
| `trainingStore` | `skipSession(date)` | Flow E 跳过冲突训练 |
| `notificationStore` | `addNotification(item)` | Flow E 推送冲突通知（在 E4 sideEffects 中） |
| `notificationStore` | `handleAction(id, actionId)` | 通知页点击操作按钮 |

### 9.6 chat.ts 类型参考

`MessageContentType` 中 **`'flight-search'` 已提前定义**，无需修改类型文件：
```typescript
export type MessageContentType =
  | 'text'
  | 'structured-card'
  | 'training-plan'
  | 'calendar-confirm'
  | 'training-reminder'
  | 'today-training'
  | 'exercise-advice'
  | 'data-permission'
  | 'training-summary'
  | 'flight-search'     // ✅ 已定义
  | 'conflict-alert'
  | 'image';
```

## 十、关键设计决策

1. **所有 CSS 变量已在 `global.css` 中定义**，组件开发时直接使用 `var(--xxx)` 即可
2. **路径别名**：`@/` 映射到 `src/`
3. **样式方案**：CSS Modules（`.module.css`）
4. **用户名**：以技术方案为准，使用"小林"
5. **营养师 Agent**：只在首页展示卡片 + 进入后显示欢迎消息，不编排对话 Flow
6. **预填充文本**：所有需要用户输入的地方，InputBar 通过 `prefilledText` prop 预设文本，用户点击即发送
7. **脚本合并方案**：同一个 Agent 的所有 Flow 节点合并到一个完整脚本中返回，而非运行时串联
8. **handleAction 灵活匹配**：trigger 中 `buttonId`/`optionId` 为可选字段，不指定则匹配任意同类操作
9. **cardData 传参**：结构化卡片的数据通过 `ChatMessage.cardData` 传递，renderCard 回调中解构使用
10. **Flow D 通知预写入**：M7 的 C4 sideEffects 已将 Flow D 通知写入 notificationStore，无需额外触发
11. **通知页已有渲染逻辑**：NotificationCard 组件可正确渲染任何 NotificationItem 数据，M8 只需增强操作回调

## 十一、验证方式

```bash
cd /Users/user/Documents/点点demo_codewiz/diandian-demo

# TypeScript 类型检查（M7完成后 0 错误）
npx tsc --noEmit

# 构建（M7完成后正常通过，1655 modules）
npx vite build

# 启动开发服务器
npm run dev
```

## 十二、注意事项

1. 技术方案文档（`/Users/user/Documents/点点demo_codewiz/点点Demo技术方案.md`）是最核心的参考：**5.4 节**有 Flow D 的通知卡片设计，**5.5 节**有 Flow E 的完整编排和 FlightSearchCard 设计
2. PRD 最终版（`/Users/user/Documents/zhizhiwork/demo prd 最终版.md`）第 248-310 行有 Flow D+E 的对话脚本
3. 所有对话内容为预编排脚本，用户只能按预设路径操作
4. Demo 演示顺序：首页 → 健身教练 → Flow A→B→C → 通知页 Flow D → 私人助理 → Flow E → 通知页冲突处理
5. 私人助理的脚本合并方案与健身教练一致：创建 `getPersonalAssistantFullScript()` 合并欢迎+Flow E
6. `welcome-scripts.ts` 中的私人助理 `aw-2` 节点的 `nextNodeId` 是空的，需要由合并函数设置为 `'E1'`
7. Flow D 的通知数据已经在 M7 完成时自动写入，M8 **不需要重新写入**，只需要增强通知操作的副作用
8. `flight-info.ts` 中的机票数据已完整就绪，FlightSearchCard 直接使用即可
9. `calendarStore.removeEvent()` 和 `trainingStore.skipSession()` 已实现但从未被调用，Flow E 冲突处理时需要使用
10. 冲突通知推送后，通知页 Tab 会自动显示红点（依赖 `unreadCount > 0`），已有逻辑无需修改

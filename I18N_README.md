# 多语言支持说明

本项目已添加中英文多语言支持。

## 实现方式

使用 React Context 实现客户端国际化方案，语言偏好保存在浏览器 localStorage 中。

## 文件结构

```
├── messages/
│   ├── en.json          # 英文翻译
│   └── zh.json          # 中文翻译
├── contexts/
│   └── language-context.tsx   # 语言上下文
└── components/
    └── language-switcher.tsx  # 语言切换组件
```

## 如何使用

### 1. 在组件中使用翻译

```tsx
import { useLanguage } from "@/contexts/language-context"

function MyComponent() {
  const { t } = useLanguage()
  
  return <div>{t("settings.title")}</div>
}
```

### 2. 带参数的翻译

在 JSON 文件中使用 `{param}` 占位符：

```json
{
  "message": "Hello {name}, you have {count} messages"
}
```

使用时传递参数：

```tsx
t("message", { name: "John", count: 5 })
```

### 3. 切换语言

使用 `LanguageSwitcher` 组件，它已经添加在聊天面板的顶部。

或者在代码中手动切换：

```tsx
const { setLocale } = useLanguage()
setLocale("zh") // 切换到中文
setLocale("en") // 切换到英文
```

## 添加新语言

1. 在 `messages/` 目录下创建新的语言文件，如 `ja.json`
2. 在 `contexts/language-context.tsx` 中导入并添加到 messages 对象
3. 更新 `Locale` 类型定义
4. 在 `components/language-switcher.tsx` 中添加新语言选项

## 当前已国际化的组件

- ChatPanel (聊天面板头部导航)
- SettingsDialog (设置对话框)

## 待国际化的组件

可以继续为以下组件添加翻译：

- ChatInput (聊天输入框)
- HistoryDialog (历史记录对话框)
- SaveDialog (保存对话框)
- ResetWarningModal (重置警告对话框)
- ButtonWithTooltip (工具提示按钮)
- 其他UI组件

## 翻译文件结构

翻译文件采用嵌套结构，按功能模块组织：

```json
{
  "nav": {
    "editor": "编辑器",
    "about": "关于"
  },
  "chat": {
    "send": "发送",
    "placeholder": "让AI帮你..."
  },
  "settings": {
    "title": "设置",
    "cancel": "取消"
  }
}
```

## 注意事项

1. 语言偏好自动保存在 localStorage
2. 首次访问时默认使用英文
3. 刷新页面后保持用户选择的语言
4. 所有翻译 key 使用点分隔的路径格式，如 `settings.title`

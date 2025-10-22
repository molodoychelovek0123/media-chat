export { default as ChatContainer } from './ChatContainer'
export { default as MessageList } from './MessageList'
export { default as MessageInput } from './MessageInput'
export { default as AgentStatus } from './AgentStatus'

// Базовые компоненты сообщений
export { default as UserMessage } from './UserMessage'
export { default as AgentMessage } from './AgentMessage'

// Специализированные компоненты для типов сообщений агента
export { default as TextMessage } from './TextMessage'
export { default as CollapsibleReasoning } from './CollapsibleReasoning'
export { default as FormMessage } from './FormMessage'
export { default as ImageMessage } from './ImageMessage'
export { default as LinksGallery } from './LinksGallery'
export { default as TableMessage } from './TableMessage'
export { default as MapMessage } from './MapMessage'
export { default as ProgressMessage } from './ProgressMessage'

// Компоненты для интерактивных элементов
export { default as ButtonGroup } from './ButtonGroup'
export { default as QuickReplies } from './QuickReplies'

// Устаревшие компоненты (для обратной совместимости)
export { default as TextMessageBubble } from './TextMessageBubble'
export { default as FileMessageBubble } from './FileMessageBubble'
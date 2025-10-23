import React, { createContext, useReducer, ReactNode, useCallback, useEffect } from 'react'
import { Message, TextMessage, FileMessage } from '@/types/chat'
import { ChatState } from '@/types/common'
import { useAgent } from '@/hooks/useAgent'
import { AgentAction } from '@/types/agent'

interface ChatContextType {
  state: ChatState
  sendMessage: (content: string) => Promise<void>
  uploadFile: (file: File) => Promise<void>
  clearMessages: () => void
  setAgentTyping: (isTyping: boolean) => void
  handleAgentAction: (action: AgentAction) => void
}

export const ChatContext = createContext<ChatContextType>({} as ChatContextType)

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { messageId: string; status: Message['status'] } }

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  isTyping: false
}

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      }
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: []
      }
    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        messages: state.messages.map((msg: Message) =>
          msg.id === action.payload.messageId
            ? { ...msg, status: action.payload.status }
            : msg
        )
      }
    default:
      return state
  }
}

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }: ChatProviderProps) => {
  const [state, dispatch] = useReducer(chatReducer, initialState, () => {
    // Восстановление состояния из localStorage
    try {
      const savedState = localStorage.getItem('chat-state')
      if (savedState) {
        const parsed = JSON.parse(savedState)
        return {
          ...initialState,
          messages: parsed.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }
      }
    } catch (error) {
      console.error('Failed to restore chat state from localStorage:', error)
    }
    return initialState
  })

  const { agentService, processAgentResponse, setScenarioTheme } = useAgent()

  // Сохранение состояния в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem('chat-state', JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save chat state to localStorage:', error)
    }
  }, [state])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: TextMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      content: content.trim(),
      timestamp: new Date(),
      sender: 'user',
      status: 'sent',
      format: 'plain'
    }

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Отправка сообщения агенту
      const response = await agentService.sendMessage(content)

      console.log('Agent response:', response) // Отладка

      // Обработка ответа агента с поддержкой всех типов сообщений
      const agentMessage = processAgentResponse(response)

      if (agentMessage) {
        dispatch({ type: 'ADD_MESSAGE', payload: agentMessage })

        // Если есть действия (кнопки), создаем дополнительное сообщение с кнопками
        if (response.actions && response.actions.length > 0) {
          console.log('Creating button message with actions:', response.actions) // Отладка
          const buttonMessage = {
            id: `buttons-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'button-group' as const,
            buttons: response.actions.map((action, index) => ({
              id: `btn-${index}`,
              label: action.label,
              action: action.payload,
              variant: 'primary' as const
            })),
            timestamp: new Date(),
            sender: 'agent' as const,
            status: 'sent' as const,
            layout: 'horizontal' as const
          }
          dispatch({ type: 'ADD_MESSAGE', payload: buttonMessage })
        }
      } else {
        // Создаем стандартное текстовое сообщение
        const fallbackMessage: TextMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'text',
          content: response.message,
          timestamp: new Date(),
          sender: 'agent',
          status: 'sent',
          format: 'plain'
        }
        dispatch({ type: 'ADD_MESSAGE', payload: fallbackMessage })
      }

      // Обновляем тему при выборе режима
      if (content.toLowerCase().includes('ммб') || content.toLowerCase().includes('кб')) {
        setScenarioTheme('green')
      }
    } catch (error) {
      const errorMessage: TextMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.',
        timestamp: new Date(),
        sender: 'agent',
        status: 'error',
        format: 'plain'
      }
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage })
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [agentService, processAgentResponse, setScenarioTheme])

  const uploadFile = useCallback(async (file: File) => {
    const fileMessage: FileMessage = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'file',
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      mimeType: file.type,
      timestamp: new Date(),
      sender: 'user',
      status: 'sending'
    }

    dispatch({ type: 'ADD_MESSAGE', payload: fileMessage })

    try {
      // Имитация загрузки файла
      await new Promise(resolve => setTimeout(resolve, 1000))

      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { messageId: fileMessage.id, status: 'sent' }
      })

      // Отправка информации о файле агенту
      const response = await agentService.sendMessage(`Пользователь загрузил файл: ${file.name}`)

      const agentMessage = processAgentResponse(response)

      if (agentMessage) {
        dispatch({ type: 'ADD_MESSAGE', payload: agentMessage })
      } else {
        const fallbackMessage: TextMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'text',
          content: response.message,
          timestamp: new Date(),
          sender: 'agent',
          status: 'sent',
          format: 'plain'
        }
        dispatch({ type: 'ADD_MESSAGE', payload: fallbackMessage })
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { messageId: fileMessage.id, status: 'error' }
      })
      dispatch({ type: 'SET_ERROR', payload: 'Ошибка при загрузке файла' })
    }
  }, [agentService, processAgentResponse])

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }, [])

  const setAgentTyping = useCallback((isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping })
  }, [])

  const handleAgentAction = useCallback(async (action: any) => {
    console.log('handleAgentAction received:', action) // Отладка

    // Обработка действий агента (кнопки, ссылки и т.д.)
    let actionText = 'Выбрано действие'
    let messageToSend = action

    if (typeof action === 'object' && action.label) {
      actionText = `Выбрано: ${action.label}`
      messageToSend = action.label
    } else if (typeof action === 'string') {
      actionText = `Выбрано: ${action}`
      messageToSend = action
    }

    const actionMessage: TextMessage = {
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      content: actionText,
      timestamp: new Date(),
      sender: 'user',
      status: 'sent',
      format: 'plain'
    }

    dispatch({ type: 'ADD_MESSAGE', payload: actionMessage })

    // Отправка действия агенту
    await sendMessage(messageToSend)
  }, [sendMessage])

  const value = {
    state,
    sendMessage,
    uploadFile,
    clearMessages,
    setAgentTyping,
    handleAgentAction
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}
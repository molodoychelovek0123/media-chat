import { useContext, useCallback } from 'react'
import { ChatContext } from '@/contexts/ChatContext'
import { Message, TextMessage, FileMessage } from '@/types/chat'
import { AgentAction } from '@/types/agent'

export const useChat = () => {
  const context = useContext(ChatContext)
  
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }

  const { 
    state, 
    sendMessage, 
    uploadFile, 
    clearMessages, 
    setAgentTyping, 
    handleAgentAction 
  } = context

  // Вспомогательные методы для работы с сообщениями
  const addMessage = useCallback((message: Message) => {
    // Этот метод уже реализован через sendMessage и uploadFile
    console.log('Use sendMessage or uploadFile instead of addMessage')
  }, [])

  const getMessagesBySender = useCallback((sender: 'user' | 'agent') => {
    return state.messages.filter((msg: Message) => msg.sender === sender)
  }, [state.messages])

  const getLastMessage = useCallback(() => {
    return state.messages.length > 0 ? state.messages[state.messages.length - 1] : null
  }, [state.messages])

  const hasUnreadMessages = useCallback(() => {
    return state.messages.some((msg: Message) => msg.status === 'delivered' && msg.sender === 'agent')
  }, [state.messages])

  const markMessageAsRead = useCallback((messageId: string) => {
    // Этот функционал будет реализован в будущем
    console.log('Mark message as read:', messageId)
  }, [])

  const retryMessage = useCallback(async (messageId: string) => {
    const message = state.messages.find((msg: Message) => msg.id === messageId)
    if (!message) return

    if (message.type === 'text' && message.sender === 'user') {
      await sendMessage(message.content)
    }
  }, [state.messages, sendMessage])

  // Методы для работы с файлами
  const getFileMessages = useCallback(() => {
    return state.messages.filter((msg: Message) => msg.type === 'file') as FileMessage[]
  }, [state.messages])

  const downloadFile = useCallback((fileMessage: FileMessage) => {
    const link = document.createElement('a')
    link.href = fileMessage.fileUrl
    link.download = fileMessage.fileName
    link.click()
  }, [])

  // Методы для работы с состоянием чата
  const resetChat = useCallback(() => {
    clearMessages()
    // Дополнительные действия по сбросу состояния
  }, [clearMessages])

  const exportChatHistory = useCallback(() => {
    const chatData = {
      messages: state.messages,
      exportedAt: new Date().toISOString(),
      totalMessages: state.messages.length
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [state.messages])

  // Методы для интеграции с агентом
  const simulateAgentTyping = useCallback((duration: number = 2000) => {
    setAgentTyping(true)
    setTimeout(() => setAgentTyping(false), duration)
  }, [setAgentTyping])

  const sendQuickReply = useCallback(async (text: string) => {
    const quickMessage: TextMessage = {
      id: `quick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      content: text,
      timestamp: new Date(),
      sender: 'user',
      status: 'sent',
      format: 'plain'
    }

    // Добавляем сообщение и сразу отправляем агенту
    await sendMessage(text)
  }, [sendMessage])

  return {
    // Состояние
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    isTyping: state.isTyping,
    
    // Основные методы
    sendMessage,
    uploadFile,
    clearMessages,
    handleAgentAction,
    
    // Вспомогательные методы
    addMessage,
    getMessagesBySender,
    getLastMessage,
    hasUnreadMessages,
    markMessageAsRead,
    retryMessage,
    
    // Методы для файлов
    getFileMessages,
    downloadFile,
    
    // Методы управления состоянием
    resetChat,
    exportChatHistory,
    
    // Методы для агента
    simulateAgentTyping,
    sendQuickReply,
    setAgentTyping
  }
}
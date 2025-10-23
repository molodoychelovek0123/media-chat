import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { AgentService, AgentResponse, CoffeeShopScenario } from '@/types/agent'
import { MockAgentService } from '@/services/agent/MockAgentService'
import { Message } from '@/types/chat'
import { useTheme } from './ThemeContext'

interface AgentContextType {
  agentService: AgentService
  currentScenario: CoffeeShopScenario
  updateScenarioData: (data: Partial<CoffeeShopScenario['userData']>) => void
  setScenarioTheme: (theme: string) => void
  processAgentResponse: (response: AgentResponse) => Message | null
}

export const AgentContext = createContext<AgentContextType>({} as AgentContextType)

interface AgentProviderProps {
  children: ReactNode
}

export const AgentProvider: React.FC<AgentProviderProps> = ({ children }) => {
  const { setBusinessMode, toggleTheme } = useTheme()
  const [currentScenario, setCurrentScenario] = useState<CoffeeShopScenario>({
    currentStep: 0,
    userData: {},
    theme: 'purple'
  })

  const agentService = new MockAgentService({
    responseDelay: 300, // 200-500ms как в требованиях
    typingDuration: 1500,
    errorRate: 0.05,
    onThemeChange: (theme) => {
      // Автоматически переключаем тему при выборе бизнес-режима
      toggleTheme(theme)
      setBusinessMode(theme === 'green')
    }
  })

  const updateScenarioData = useCallback((data: Partial<CoffeeShopScenario['userData']>) => {
    setCurrentScenario(prev => ({
      ...prev,
      userData: {
        ...prev.userData,
        ...data
      }
    }))
  }, [])

  const setScenarioTheme = useCallback((theme: string) => {
    if (theme === 'green' || theme === 'purple') {
      setCurrentScenario(prev => ({
        ...prev,
        theme: theme
      }))
      // Обновляем тему в сервисе агента и в ThemeContext
      if (agentService instanceof MockAgentService) {
        agentService.setTheme(theme)
      }
      toggleTheme(theme)
      setBusinessMode(theme === 'green')
    }
  }, [agentService, toggleTheme, setBusinessMode])

  const processAgentResponse = useCallback((response: AgentResponse): Message | null => {
    console.log('Processing agent response:', response); // Отладка
    
    if (response.metadata?.messageData) {
      console.log('Using messageData from metadata:', response.metadata.messageData); // Отладка
      return response.metadata.messageData as Message
    }

    // Создаем стандартное текстовое сообщение
    const textMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      content: response.message,
      timestamp: new Date(),
      sender: 'agent',
      status: 'sent',
      format: 'plain'
    } as Message
    
    console.log('Created fallback text message:', textMessage); // Отладка
    return textMessage;
  }, [])

  const value = {
    agentService,
    currentScenario,
    updateScenarioData,
    setScenarioTheme,
    processAgentResponse
  }

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  )
}

export const useAgent = () => {
  const context = useContext(AgentContext)
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider')
  }
  return context
}
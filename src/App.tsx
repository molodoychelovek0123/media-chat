import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ChatProvider } from '@/contexts/ChatContext'
import { AgentProvider } from '@/contexts/AgentContext'
import Layout from '@/components/layout/Layout'
import { GlobalStyles } from '@/styles/globals'

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AgentProvider>
        <ChatProvider>
          <GlobalStyles />
          <Layout />
        </ChatProvider>
      </AgentProvider>
    </ThemeProvider>
  )
}

export default App
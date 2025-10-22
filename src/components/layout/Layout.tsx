import React from 'react'
import { useTheme } from '@contexts/ThemeContext'
import Header from './Header'
import ChatContainer from '../chat/ChatContainer'
import AgentStatus from '../chat/AgentStatus'

const Layout: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div 
      className="full-screen" 
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary
      }}
    >
      <Header />
      <main className="flex flex-col h-full" style={{ paddingTop: '60px' }}>
        <ChatContainer />
        <AgentStatus />
      </main>
    </div>
  )
}

export default Layout
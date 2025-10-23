import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-family: 'SB Sans Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
  }

  /* SDDS Serv Theme Variables */
  .sdds-serv-standard {
    /* Standard theme variables will be applied via CSS custom properties */
  }

  .sdds-serv-business {
    /* Business theme variables will be applied via CSS custom properties */
  }

  /* Utility classes */
  .full-screen {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .gpu-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
  }

  .theme-transition {
    transition: background-color var(--theme-transition, 0.3s ease),
                color var(--theme-transition, 0.3s ease),
                border-color var(--theme-transition, 0.3s ease);
  }

  .form-transition {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-lift {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-1px);
    }
  }

  .scale-press {
    transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:active {
      transform: scale(0.98);
    }
  }

  /* Typography classes */
  .sdds-heading-1 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .sdds-heading-2 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .sdds-paragraph {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* Component classes */
  .sdds-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .sdds-button--primary {
    background-color: var(--theme-primary, #8B5CF6);
    color: #FFFFFF;
    
    &:hover:not(:disabled) {
      background-color: var(--theme-primary-dark, #7C3AED);
    }
  }

  .sdds-button--secondary {
    background-color: var(--theme-surface, #FFFFFF);
    color: var(--theme-text-primary, #1F2937);
    border: 1px solid var(--theme-border, #E5E7EB);
    
    &:hover:not(:disabled) {
      background-color: var(--theme-background, #F9FAFB);
    }
  }

  .sdds-button--icon {
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .sdds-textarea {
    font-family: inherit;
    font-size: 0.875rem;
    resize: none;
    outline: none;
    
    &::placeholder {
      color: var(--theme-text-secondary, #6B7280);
    }
    
    &:focus {
      outline: none;
    }
  }

  .sdds-input-file {
    display: none;
  }

  .sdds-dropzone-overlay {
    position: absolute;
    z-index: 10;
  }

  .sdds-dropzone-card {
    border-radius: 0.5rem;
  }

  .sdds-dropzone-icon {
    font-size: 1.5rem;
  }

  .sdds-input-container {
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
  }

  .sdds-textarea-container {
    position: relative;
    flex: 1;
  }

  .sdds-input-hint {
    position: absolute;
    pointer-events: none;
  }

  .sdds-button-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sdds-button-text {
    font-weight: 500;
  }

  .sdds-shortcut {
    font-size: 0.75rem;
  }

  .sdds-spinner {
    border: 2px solid;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .sdds-input-info {
    font-size: 0.75rem;
  }

  /* Chat specific classes */
  .sdds-chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
  }

  .sdds-chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .sdds-chat-messages {
    flex: 1;
    overflow-y: auto;
  }

  .sdds-chat-input-area {
    border-top: 1px solid var(--theme-border, #E5E7EB);
    background-color: var(--theme-surface, #FFFFFF);
  }

  .sdds-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .sdds-card {
    border-radius: 0.5rem;
    padding: 1.5rem;
    text-align: center;
  }

  /* Animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-bounce {
    animation: bounce 1s infinite;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .sdds-input-container {
      flex-direction: column;
      align-items: stretch;
    }
    
    .sdds-button--icon {
      align-self: flex-start;
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Focus styles for accessibility */
  button:focus-visible,
  textarea:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--theme-primary, #8B5CF6);
    outline-offset: 2px;
  }
`
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const isValidMessage = (message: string): boolean => {
  return message.trim().length > 0 && message.trim().length <= 1000
}

export const isValidFile = (file: File): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize
}

export const validateBusinessName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Название бизнеса не может быть пустым' }
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'Название бизнеса должно содержать минимум 2 символа' }
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Название бизнеса не может превышать 100 символов' }
  }
  
  return { isValid: true }
}
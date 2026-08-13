import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
 
export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

// Utility function to get current user role
export const getCurrentUserRole = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    
    const payload = decodeToken(token)
    // Return the role if it's USER or ADMIN
    return (payload?.role === 'USER' || payload?.role === 'ADMIN') ? payload.role : null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

// Utility function to check if current user is a regular user
export const isUser = () => {
  return getCurrentUserRole() === 'USER'
}

// Utility function to check if current user is an admin
export const isAdmin = () => {
  return getCurrentUserRole() === 'ADMIN'
}

// Utility function to validate user token
export const isValidUserToken = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    const payload = decodeToken(token)
    const currentTime = Date.now() / 1000
    
    // Accept both USER and ADMIN roles
    return (payload?.role === 'USER' || payload?.role === 'ADMIN') && payload?.exp > currentTime
  } catch (error) {
    return false
  }
}

// Utility function to check if token is expired
export const isTokenExpired = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return true
    
    const payload = decodeToken(token)
    const currentTime = Date.now() / 1000
    
    return !payload?.exp || payload?.exp < currentTime
  } catch (error) {
    return true
  }
}

// Utility function to clear auth tokens
export const clearAuthTokens = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  // Dispatch event to notify components of auth state change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-state-changed'))
  }
}

// Utility function to set auth tokens
export const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('token', accessToken)
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
  // Dispatch event to notify components of auth state change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-state-changed'))
  }
}

// Export for use in api.js (without dispatching event to avoid duplicate events)
export const setAuthTokensWithoutEvent = (accessToken, refreshToken) => {
  localStorage.setItem('token', accessToken)
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

// Export for use in api.js (without dispatching event to avoid duplicate events)
export const clearAuthTokensWithoutEvent = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}
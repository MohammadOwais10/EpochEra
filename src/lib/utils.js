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
    // Only return role if it's USER
    return payload?.role === 'USER' ? payload.role : null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

// Utility function to check if current user is a regular user
export const isUser = () => {
  return getCurrentUserRole() === 'USER'
}

// Utility function to validate user token
export const isValidUserToken = () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    const payload = decodeToken(token)
    const currentTime = Date.now() / 1000
    
    return payload?.role === 'USER' && payload?.exp > currentTime
  } catch (error) {
    return false
  }
}
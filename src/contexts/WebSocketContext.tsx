import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuth } from './AuthContext'

// Type for the notification message
interface InvitationNotification {
  type: string
}

interface WebSocketContextType {
  isConnected: boolean
  subscribeToInvitations: (callback: (message: InvitationNotification) => void) => () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { session, user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef<Client | null>(null)
  const invitationCallbacksRef = useRef<Set<(message: InvitationNotification) => void>>(new Set())

  useEffect(() => {
    // Only connect if we have a session and user
    if (!session?.access_token || !user?.id) {
      return
    }

    // Create STOMP client
    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_SPRINGBOOT_ENDPOINT}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${session.access_token}`
      },
      debug: (str) => {
        console.log('STOMP:', str)
      },
      reconnectDelay: 5000, // Auto-reconnect every 5 seconds
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected')
        setIsConnected(true)

        // Subscribe to user's invitation channel
        client.subscribe(`/user/${user.id}/invitations`, (message) => {
          const payload: InvitationNotification = JSON.parse(message.body)
          console.log('Received invitation notification:', payload)
          
          // Notify all subscribers
          invitationCallbacksRef.current.forEach(callback => callback(payload))
        })
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
        setIsConnected(false)
      }
    })

    client.activate()
    clientRef.current = client

    // Cleanup
    return () => {
      client.deactivate()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [session?.access_token, user?.id])

  const subscribeToInvitations = (callback: (message: InvitationNotification) => void) => {
    invitationCallbacksRef.current.add(callback)
    
    // Return unsubscribe function
    return () => {
      invitationCallbacksRef.current.delete(callback)
    }
  }

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribeToInvitations }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}
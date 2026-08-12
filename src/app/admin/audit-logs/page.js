'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listAdminAuditLogs } from '@/lib/api'

export default function AuditLogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchData = async () => {
      try {
        const result = await listAdminAuditLogs()
        setLogs(result.success ? (result.data?.data || result.data || []) : [])
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load audit logs')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (error) return <div className="p-8 text-red-400">{error}</div>

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        {logs.length === 0 ? (
          <p className="p-6 text-zinc-500">No audit logs found.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {logs.map((log, i) => (
              <li key={i} className="p-4">
                <p className="text-zinc-300 font-medium">{log.action}</p>
                <p className="text-zinc-500 text-sm">{log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}</p>
                {log.details && <pre className="text-xs text-zinc-600 mt-2">{JSON.stringify(log.details, null, 2)}</pre>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

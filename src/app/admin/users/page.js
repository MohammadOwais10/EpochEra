'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listUsers, updateUserStatus } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
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
        const result = await listUsers()
        setUsers(result.success ? (result.data?.data || result.data || []) : [])
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleStatus = async (id, status) => {
    try {
      await updateUserStatus(id, { status })
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)))
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Update failed')
    }
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (error) return <div className="p-8 text-red-400">{error}</div>

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-zinc-500">No users found.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-zinc-800">
                  <td className="p-4">{u.firstName} {u.lastName}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.username}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4">{u.status}</td>
                  <td className="p-4 flex gap-2">
                    <Button size="sm" onClick={() => router.push(`/admin/users/${u.id}`)} variant="primary" className="rounded-full">View</Button>
                    <Button size="sm" onClick={() => handleStatus(u.id, 'ACTIVE')} variant="primary" className="rounded-full">Activate</Button>
                    <Button size="sm" onClick={() => handleStatus(u.id, 'BLOCKED')} variant="outline" className="rounded-full">Block</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

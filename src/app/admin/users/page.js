'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { listUsers, updateUserStatus } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Users, Search, Shield, Clock, CheckCircle, XCircle, Edit, Eye } from 'lucide-react'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[#B48811]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-20 h-20 border-4 border-[#B48811]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#B48811] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#EBD197] rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-center mt-6">
        <p className="text-white font-semibold text-lg mb-1">Loading Users</p>
        <p className="text-slate-400 text-sm">Please wait...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-slate-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="primary">Try Again</Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Users Management</h1>
            <p className="text-slate-400 text-sm">Manage user accounts and permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total: {users.length}</span>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 transition-all"
          />
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 border-[#B48811]/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="p-4 text-slate-400 font-medium">Name</th>
                  <th className="p-4 text-slate-400 font-medium">Email</th>
                  <th className="p-4 text-slate-400 font-medium">Username</th>
                  <th className="p-4 text-slate-400 font-medium">Role</th>
                  <th className="p-4 text-slate-400 font-medium">Status</th>
                  <th className="p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-slate-500 text-center">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{u.firstName?.[0]}{u.lastName?.[0]}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.firstName} {u.lastName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{u.email}</td>
                      <td className="p-4 text-slate-300">{u.username}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs font-medium text-slate-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {u.status === 'ACTIVE' ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 text-sm font-medium">Active</span>
                            </>
                          ) : u.status === 'BLOCKED' ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 text-sm font-medium">Blocked</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-[#EBD197]" />
                              <span className="text-[#EBD197] text-sm font-medium">Pending</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => router.push(`/admin/users/${u.id}`)} 
                            variant="outline" 
                            className="rounded-full flex items-center gap-1 hover:bg-slate-700/50"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          {u.status !== 'ACTIVE' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStatus(u.id, 'ACTIVE')} 
                              variant="primary" 
                              className="rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0"
                            >
                              Activate
                            </Button>
                          )}
                          {u.status === 'ACTIVE' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStatus(u.id, 'BLOCKED')} 
                              variant="outline" 
                              className="rounded-full hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                            >
                              Block
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

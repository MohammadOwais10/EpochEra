'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  listAdminMiningSocialVerifications,
  approveAdminMiningSocialVerification,
  rejectAdminMiningSocialVerification,
  revokeAdminMiningSocialVerification,
} from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Shield, CheckCircle, XCircle, ExternalLink, Users, AlertCircle, Ban } from 'lucide-react'

export default function AdminMiningSocialVerifications() {
  const router = useRouter()
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState(null)
  const [rejectionNote, setRejectionNote] = useState('')
  const [rejectingId, setRejectingId] = useState(null)
  const [revokingId, setRevokingId] = useState(null)

  const limit = 10

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    fetchData()
  }, [router, page, statusFilter])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await listAdminMiningSocialVerifications({
        page,
        limit,
        status: statusFilter,
      })
      const payload = result.success ? result.data : { data: [], total: 0 }
      setData(payload.data || [])
      setTotal(payload.total || 0)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setActionId(id)
    setError('')
    try {
      const result = await approveAdminMiningSocialVerification(id)
      if (!result.success) throw new Error(result.error?.message || 'Failed')
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to approve')
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async (id) => {
    if (!rejectionNote.trim()) {
      setError('Rejection note is required')
      return
    }
    setActionId(id)
    setError('')
    try {
      const result = await rejectAdminMiningSocialVerification(id, { note: rejectionNote })
      if (!result.success) throw new Error(result.error?.message || 'Failed')
      setRejectingId(null)
      setRejectionNote('')
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to reject')
    } finally {
      setActionId(null)
    }
  }

  const handleRevoke = async (id) => {
    if (!rejectionNote.trim()) {
      setError('Revoke note is required')
      return
    }
    setActionId(id)
    setError('')
    try {
      const result = await revokeAdminMiningSocialVerification(id, { note: rejectionNote })
      if (!result.success) throw new Error(result.error?.message || 'Failed')
      setRevokingId(null)
      setRejectionNote('')
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to revoke')
    } finally {
      setActionId(null)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-[#B48811]/10 text-[#EBD197] border-[#B48811]/20',
      APPROVED: 'bg-green-500/10 text-green-400 border-green-500/20',
      REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.PENDING}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading social verifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#B48811]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#B48811]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Mining Social Verifications</h1>
              <p className="text-slate-400 text-sm">Review user screenshot submissions</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {['PENDING', 'APPROVED', 'REJECTED', ''].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => { setStatusFilter(s); setPage(1) }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-4">
            {data.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">No social verifications found</p>
              </Card>
            ) : (
              data.map((item) => (
                <Card key={item.id} className="p-6 border border-slate-700/50 hover:border-[#B48811]/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusBadge(item.status)}
                        <span className="text-slate-400 text-sm">{item.platform}</span>
                      </div>
                      <p className="text-white font-medium mb-1">
                        {item.user?.firstName} {item.user?.lastName}
                      </p>
                      <p className="text-slate-400 text-sm mb-1">{item.user?.email}</p>
                      <p className="text-slate-500 text-xs mb-3">@{item.user?.username}</p>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm items-center">
                        <a
                          href={item.socialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#EBD197] hover:text-[#BB9B49]"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {item.platform === 'TWITTER' ? 'Twitter/X' : item.platform === 'FACEBOOK' ? 'Facebook Page' : 'Social Page'}
                        </a>
                        <a
                          href={item.screenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#EBD197] hover:text-[#BB9B49]"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Screenshot
                        </a>
                      </div>

                      {item.adminNote && (
                        <p className="mt-3 text-red-400 text-sm">Note: {item.adminNote}</p>
                      )}
                    </div>

                    {item.status === 'PENDING' && (
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        {rejectingId === item.id ? (
                          <>
                            <textarea
                              value={rejectionNote}
                              onChange={(e) => setRejectionNote(e.target.value)}
                              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                              placeholder="Rejection note..."
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleReject(item.id)}
                                disabled={actionId === item.id}
                                variant="outline"
                                size="sm"
                                className="flex-1 rounded-full"
                              >
                                {actionId === item.id ? '...' : <><XCircle className="w-4 h-4 mr-1" /> Reject</>}
                              </Button>
                              <Button
                                onClick={() => { setRejectingId(null); setRejectionNote('') }}
                                variant="secondary"
                                size="sm"
                                className="rounded-full"
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleApprove(item.id)}
                              disabled={actionId === item.id}
                              variant="primary"
                              size="sm"
                              className="rounded-full"
                            >
                              {actionId === item.id ? '...' : <><CheckCircle className="w-4 h-4 mr-1" /> Approve</>}
                            </Button>
                            <Button
                              onClick={() => { setRejectingId(item.id); setRejectionNote('') }}
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {item.status === 'APPROVED' && (
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        {revokingId === item.id ? (
                          <>
                            <textarea
                              value={rejectionNote}
                              onChange={(e) => setRejectionNote(e.target.value)}
                              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                              placeholder="Reason for revoking approval (e.g. user unfollowed)..."
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleRevoke(item.id)}
                                disabled={actionId === item.id}
                                variant="outline"
                                size="sm"
                                className="flex-1 rounded-full"
                              >
                                {actionId === item.id ? '...' : <><Ban className="w-4 h-4 mr-1" /> Revoke</>}
                              </Button>
                              <Button
                                onClick={() => { setRevokingId(null); setRejectionNote('') }}
                                variant="secondary"
                                size="sm"
                                className="rounded-full"
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Button
                            onClick={() => { setRevokingId(item.id); setRejectionNote('') }}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            <Ban className="w-4 h-4 mr-1" /> Revoke Approval
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-between mt-6">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="secondary"
                size="sm"
                className="rounded-full"
              >
                Previous
              </Button>
              <p className="text-slate-400 text-sm">
                Page {page} of {Math.ceil(total / limit)}
              </p>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / limit)}
                variant="secondary"
                size="sm"
                className="rounded-full"
              >
                Next
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

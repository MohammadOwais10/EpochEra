import axios from 'axios';
import { setAuthTokensWithoutEvent, clearAuthTokensWithoutEvent } from './utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Helper function to set auth tokens and dispatch event
const setAuthTokensWithEvent = (accessToken, refreshToken) => {
  setAuthTokensWithoutEvent(accessToken, refreshToken);
  // Dispatch event to notify components of auth state change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-state-changed'));
  }
};

// Helper function to clear auth tokens and dispatch event
const clearAuthTokensWithEvent = () => {
  clearAuthTokensWithoutEvent();
  // Dispatch event to notify components of auth state change
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-state-changed'));
  }
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
          // Token is expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken && !config._retry) {
            try {
              const response = await api.post('/auth/refresh', { refreshToken });
              if (response.data.success) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                setAuthTokensWithEvent(accessToken, newRefreshToken);
                config.headers.Authorization = `Bearer ${accessToken}`;
                return config;
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              clearAuthTokensWithEvent();
              window.location.href = '/signin';
              return Promise.reject(refreshError);
            }
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function formatApiError(error) {
  if (!error) return 'Something went wrong';
  if (error.details) {
    const parts = [];
    if (error.details.fieldErrors) {
      for (const [field, messages] of Object.entries(error.details.fieldErrors)) {
        if (Array.isArray(messages) && messages.length) {
          parts.push(`${field}: ${messages.join(', ')}`);
        }
      }
    }
    if (error.details.formErrors?.length) {
      parts.push(error.details.formErrors.join(', '));
    }
    if (parts.length) return parts.join('; ');
  }
  return error.message || 'Something went wrong';
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Handle 401 errors that weren't caught by request interceptor
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        clearAuthTokensWithEvent();
        window.location.href = '/signin';
      }
    }
    
    if (err.response?.data?.error) {
      err.response.data.error.message = formatApiError(err.response.data.error);
    } else if (!err.response && err.request) {
      err.message = 'Network error — is the backend running?';
    } else if (!err.message) {
      err.message = 'Something went wrong';
    }
    return Promise.reject(err);
  },
);

// Helper that returns the backend's { success, data } envelope directly
const get = (path) => api.get(path).then((res) => res.data);
const post = (path, data) => api.post(path, data).then((res) => res.data);
const patch = (path, data) => api.patch(path, data).then((res) => res.data);
const del = (path) => api.delete(path).then((res) => res.data);

/* ============================================================
   AUTH
   ============================================================ */
export const login = (email, password) => post('/auth/login', { email, password });
export const register = (data) => post('/auth/register', data);
export const logout = (refreshToken) => post('/auth/logout', { refreshToken });
export const refresh = (refreshToken) => post('/auth/refresh', { refreshToken });
export const verifyEmail = (email, otp) => post('/auth/verify-email', { email, otp });
export const resendVerification = (email) => post('/auth/resend-verification', { email });
export const forgotPassword = (email) => post('/auth/forgot-password', { email });
export const verifyResetOtp = (email, otp) => post('/auth/verify-reset-otp', { email, otp });
export const resetPassword = (email, otp, newPassword) => post('/auth/reset-password', { email, otp, newPassword });
export const getUserById = (_id = null) => get('/auth/me');

// Export the api instance for direct use if needed
export default api;

/* ============================================================
   DASHBOARD
   ============================================================ */
export const getDashboard = () => get('/dashboard');

/* ============================================================
   MEMBERSHIP
   ============================================================ */
export const getMyMembership = () => get('/membership/me');
export const purchaseMembership = (data) => post('/membership/purchase', data);
export const getMembershipHistory = () => get('/membership/history');

/* ============================================================
   MLM
   ============================================================ */
export const getMySponsor = () => get('/mlm/my-sponsor');
export const getMyDirectReferrals = () => get('/mlm/my-direct-referrals');
export const getMlmTree = () => get('/mlm/tree');
export const getMlmGeneration = (level) => get(`/mlm/generation/${level}`);
export const getMlmStatistics = () => get('/mlm/statistics');

/* ============================================================
   WALLETS
   ============================================================ */
export const getUsdWallet = () => get('/wallet/usd');
export const getWalletWidgetA = () => get('/wallet/widget-a');
export const getWalletWidgetB = () => get('/wallet/widget-b');
export const getWalletTransactions = () => get('/wallet/transactions');

/* ============================================================
   WIDGET A
   ============================================================ */
export const getWidgetABalance = () => get('/widget-a/balance');
export const getWidgetATransactions = () => get('/widget-a/transactions');

/* ============================================================
   WIDGET B
   ============================================================ */
export const getWidgetBConfig = () => get('/widget-b/config');
export const getWidgetBBalance = () => get('/widget-b/balance');
export const getWidgetBPurchases = () => get('/widget-b/purchases');
export const purchaseWidgetB = (data) => post('/widget-b/purchase', data);
export const getWidgetBSellRequests = () => get('/widget-b/sell-requests');
export const createWidgetBSell = (data) => post('/widget-b/sell', data);
export const getWidgetBSellRequest = (id) => get(`/widget-b/sell-requests/${id}`);
export const cancelWidgetBSellRequest = (id) => post(`/widget-b/sell-requests/${id}/cancel`);

/* ============================================================
   UPLOADS
   ============================================================ */
export const uploadScreenshot = (file) => {
  const data = new FormData();
  data.append('screenshot', file);
  return api.post('/uploads/screenshot', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

/* ============================================================
   MINING
   ============================================================ */
export const getMiningContent = () => get('/mining/content');
export const getMiningStatus = () => get('/mining/status');
export const getMiningSocialLinks = () => get('/mining/social-links');
export const getMySocialVerifications = () => get('/mining/social-verifications');
export const submitSocialVerification = (data) => post('/mining/social-verifications', data);
export const mine = (data) => post('/mining/mine', data);
export const getMiningHistory = () => get('/mining/history');

// Admin mining social verifications
export const listAdminMiningSocialVerifications = (params = {}) => {
  const q = new URLSearchParams();
  if (params.status) q.set('status', params.status);
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  const qs = q.toString();
  return get(`/admin/mining/social-verifications${qs ? `?${qs}` : ''}`);
};
export const approveAdminMiningSocialVerification = (id) => patch(`/admin/mining/social-verifications/${id}/approve`);
export const rejectAdminMiningSocialVerification = (id, data) => patch(`/admin/mining/social-verifications/${id}/reject`, data);
export const revokeAdminMiningSocialVerification = (id, data) => patch(`/admin/mining/social-verifications/${id}/revoke`, data);

/* ============================================================
   PAYMENTS
   ============================================================ */
export const getDepositWallet = () => get('/payments/deposit-wallet');
export const verifyDeposit = (data) => post('/payments/verify-deposit', data);
export const paymentWebhook = (data) => post('/payments/webhook', data);

/* ============================================================
   TICKETS
   ============================================================ */
export const createTicket = (data) => post('/tickets', data);
export const getMyTickets = () => get('/tickets');
export const getTicket = (id) => get(`/tickets/${id}`);
export const sendTicketMessage = (id, data) => post(`/tickets/${id}/messages`, data);
export const getAdminTickets = (params = '') => get(`/tickets/admin/all${params ? `?${params}` : ''}`);
export const updateTicketStatus = (id, data) => patch(`/tickets/${id}/status`, data);

/* ============================================================
   ADMIN
   ============================================================ */
export const getAdminDashboard = () => get('/admin/dashboard');
export const listUsers = (params = '') => get(`/admin/users${params ? `?${params}` : ''}`);
export const getUser = (id) => get(`/admin/users/${id}`);
export const getAdminUserDetails = (id) => get(`/admin/users/${id}/details`);
export const updateUserStatus = (id, data) => patch(`/admin/users/${id}/status`, data);

export const getAdminMlmConfig = () => get('/admin/mlm/config');
export const updateAdminMlmConfig = (generation, data) => patch(`/admin/mlm/config/${generation}`, data);
export const getAdminUserTree = (userId) => get(`/admin/mlm/user/${userId}/tree`);

export const getAdminWidgetBConfig = () => get('/admin/widget-b/config');
export const updateAdminWidgetBConfig = (data) => patch('/admin/widget-b/config', data);
export const listAdminSellRequests = (query = '') => get(`/admin/widget-b/sell-requests${query ? `?${query}` : ''}`);
export const getAdminSellRequest = (id) => get(`/admin/widget-b/sell-requests/${id}`);
export const approveSellRequest = (id) => patch(`/admin/widget-b/sell-requests/${id}/approve`);
export const rejectSellRequest = (id, data) => patch(`/admin/widget-b/sell-requests/${id}/reject`, data);
export const processingSellRequest = (id) => patch(`/admin/widget-b/sell-requests/${id}/processing`);
export const completeSellRequest = (id, data) => patch(`/admin/widget-b/sell-requests/${id}/complete`, data);

export const createAdminMiningContent = (data) => post('/admin/mining/content', data);
export const listAdminMiningContent = () => get('/admin/mining/content');
export const updateAdminMiningContent = (id, data) => patch(`/admin/mining/content/${id}`, data);
export const deleteAdminMiningContent = (id) => del(`/admin/mining/content/${id}`);

export const listAdminWalletTransactions = (query = '') => get(`/admin/wallet/transactions${query ? `?${query}` : ''}`);
export const adjustAdminWallet = (data) => post('/admin/wallet/adjust', data);

export const getAdminDepositWallet = () => get('/admin/deposit-wallet');
export const setAdminDepositWallet = (data) => patch('/admin/deposit-wallet', data);

export const listAdminAuditLogs = (query = '') => get(`/admin/audit-logs${query ? `?${query}` : ''}`);

/* ============================================================
   LEGACY / PLACEHOLDERS
   ============================================================ */
export const sendOTPforTransactionPassword = async () => ({
  success: true,
  message: 'Transaction OTP not yet implemented',
});

export const createTransactionPassword = async (data) => ({
  success: true,
  message: 'Create transaction password not yet implemented',
});

export const checkTransactionPassword = async (data) => ({
  success: true,
  valid: true,
  message: 'Check transaction password not yet implemented',
});

// Export the api instance for direct use if needed
export { api };

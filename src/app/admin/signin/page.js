import SignInPage from '@/components/auth/SignInPage'

export const metadata = {
  title: 'Admin Sign In - EpochEra',
}

export default function AdminSignIn() {
  return (
    <SignInPage
      title="Admin Sign In"
      subtitle="Sign in to the EpochEra admin panel"
    />
  )
}

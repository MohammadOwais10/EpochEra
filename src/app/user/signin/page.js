import SignInPage from '@/components/auth/SignInPage'

export const metadata = {
  title: 'User Sign In - EpochEra',
}

export default function UserSignIn() {
  return (
    <SignInPage
      title="User Sign In"
      subtitle="Sign in to your EpochEra account"
    />
  )
}

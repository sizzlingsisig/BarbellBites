import { useState } from 'react'
import { Button, Stack, Text, Title, TextInput, Alert } from '@mantine/core'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import { forgotPasswordRequest } from '../api/authApi'
import { notifyError } from '../services/notify'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await forgotPasswordRequest(email)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Password reset request failed', err)
      notifyError({
        title: 'Request Failed',
        message: 'Unable to process your request at this time.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyles = {
    input: {
      backgroundColor: 'rgba(255,255,255,0.04)',
      color: '#FAFBFB',
      border: '1px solid rgba(255,255,255,0.09)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: 'inset 0 1px 0 rgba(250,251,251,0.04)',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
  }

  return (
    <AuthLayout>
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Title
            order={1}
            style={{
              color: 'rgba(250,251,251,0.95)',
              fontWeight: 800,
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            Reset Password
          </Title>
          <Text
            size="sm"
            style={{ color: 'rgba(250,251,251,0.45)', lineHeight: 1.6 }}
          >
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </div>

        {isSubmitted ? (
          <Alert
            radius="md"
            styles={{
              root: {
                background: 'rgba(7,157,132,0.1)',
                border: '1px solid rgba(0,200,150,0.25)',
                backdropFilter: 'blur(12px)',
              },
              message: {
                color: 'rgba(250,251,251,0.9)',
                fontWeight: 500,
                fontSize: '0.9rem',
                lineHeight: 1.5,
              },
            }}
          >
            If an account with that email exists, a password reset link has been sent. Please check your inbox.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <div>
                <Text
                  size="xs"
                  style={{
                    color: 'rgba(250,251,251,0.55)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  Email address
                </Text>
                <TextInput
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  required
                  disabled={isLoading}
                  variant="filled"
                  size="md"
                  radius="md"
                  styles={inputStyles}
                />
              </div>

              <Button
                type="submit"
                loading={isLoading}
                fullWidth
                size="lg"
                radius="md"
                className="font-bold tracking-widest uppercase text-sm relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-px mt-4"
                styles={{
                  root: {
                    background: 'linear-gradient(135deg, rgba(7,157,132,0.25) 0%, rgba(0,200,150,0.15) 100%)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0,200,150,0.35)',
                    color: '#1DDFBD',
                    boxShadow: 'inset 0 1px 0 rgba(250,251,251,0.06)',
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                Send Reset Link
              </Button>
            </Stack>
          </form>
        )}

        {/* Back to login footer */}
        <Text
          size="sm"
          className="text-center"
          style={{ color: 'rgba(250,251,251,0.35)' }}
        >
          Remembered your password?{' '}
          <Link
            to="/login"
            style={{
              color: 'rgba(250,251,251,0.75)',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1DDFBD')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,251,251,0.75)')}
          >
            Back to sign in
          </Link>
        </Text>
      </Stack>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
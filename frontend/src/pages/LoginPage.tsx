import { useState } from 'react'
import { Button, Stack, Text, Title, TextInput, PasswordInput, Alert } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AuthLayout from '../layouts/AuthLayout'

function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      console.error('Login failed', err)
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
      <form onSubmit={handleSubmit}>
        <Stack gap="xl">

          {/* Header */}
          <div>
            <Text
              size="xs"
              style={{
                color: 'var(--color-white-ui)',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
            </Text>
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
              Welcome back
            </Title>
            <Text
              size="sm"
              style={{ color: 'rgba(250,251,251,0.45)', lineHeight: 1.6 }}
            >
              Enter your details to access your macro-tracked recipe vault.
            </Text>
          </div>

          {/* Error */}
          {error && (
            <Alert
              radius="md"
              styles={{
                root: {
                  background: 'rgba(255,60,60,0.07)',
                  border: '1px solid rgba(255,80,80,0.25)',
                  backdropFilter: 'blur(12px)',
                },
                message: {
                  color: 'rgba(255,160,160,0.9)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Fields */}
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Text
                  size="xs"
                  style={{
                    color: 'rgba(250,251,251,0.55)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Password
                </Text>
                <Link
                  to="/forgot-password"
                  style={{
                    color: 'rgba(0,200,150,0.7)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#1DDFBD')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,200,150,0.7)')}
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                disabled={isLoading}
                variant="filled"
                size="md"
                radius="md"
                styles={{
                  ...inputStyles,
                  innerInput: {
                    color: '#FAFBFB',
                  },
                }}
              />
            </div>
          </Stack>

          {/* Divider */}
          <div
            className="h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
          />

          {/* Submit */}
          <Stack gap="md">
            <Button
              type="submit"
              loading={isLoading}
              fullWidth
              size="lg"
              radius="md"
              className="font-bold tracking-widest uppercase text-sm relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-px"
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
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5), inset 0 2px 6px rgba(0,0,0,0.35)'
                e.currentTarget.style.borderColor = 'rgba(0,200,150,0.55)'
              }}
              onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.borderColor = ''
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.borderColor = ''
              }}
            >
              Sign In
            </Button>

            {/* Footer */}
            <Text
              size="sm"
              className="text-center"
              style={{ color: 'rgba(250,251,251,0.35)' }}
            >
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: 'rgba(250,251,251,0.75)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1DDFBD')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,251,251,0.75)')}
              >
                Sign up
              </Link>
            </Text>
          </Stack>

        </Stack>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
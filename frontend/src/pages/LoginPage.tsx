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

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <div>
            <Title order={1} className="text-paper font-bold text-3xl sm:text-[2.15rem] lg:text-[2.35rem] mb-2 leading-tight">
              Welcome back
            </Title>
            <Text className="text-paper/70 text-sm leading-relaxed max-w-sm">
              Enter your details to access your macro-tracked recipe vault.
            </Text>
          </div>

          {error && (
            <Alert
              radius="md"
              styles={{
                root: {
                  background: 'linear-gradient(to right, #000000, #04585B)',
                  border: '1px solid #079D84',
                },
                message: {
                  color: '#FFFFFF',
                  fontWeight: 600,
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Stack gap="sm">
            <TextInput
              label={<span className="text-paper/85 font-semibold text-sm mb-1 inline-block">Email address</span>}
              placeholder="chef@barbellbites.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              disabled={isLoading}
              variant="filled"
              size="md"
              radius="md"
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                  transition: 'all 0.3s ease',
                  '&:focus': {
                    border: '1px solid #0CCEB0',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 0 0 3px rgba(12, 206, 176, 0.2)',
                  },
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.4)',
                  },
                },
              }}
            />

            <div>
              <PasswordInput
                label={<span className="text-paper/85 font-semibold text-sm mb-1 inline-block">Password</span>}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                disabled={isLoading}
                variant="filled"
                size="md"
                radius="md"
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                    transition: 'all 0.3s ease',
                    '&:focus': {
                      border: '1px solid #0CCEB0',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 0 0 3px rgba(12, 206, 176, 0.2)',
                    },
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                  innerInput: {
                    color: '#FFFFFF',
                  },
                }}
              />
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-brand-500 hover:text-brand-400 text-sm font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
          </Stack>

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="lg"
            radius="md"
            className="mt-3 font-bold tracking-wide uppercase text-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
            styles={{
              root: {
                backgroundImage: 'linear-gradient(135deg, #050707 0%, #0A4F46 45%, #0CCEB0 100%)',
                border: '1px solid rgba(12, 206, 176, 0.45)',
                color: '#FFFFFF',
              },
            }}
          >
            Sign In
          </Button>

          <div className="text-center mt-2">
            <Text size="sm" className="text-paper/60">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-paper hover:text-brand-500 font-semibold ml-1 transition-colors">
                Sign up
              </Link>
            </Text>
          </div>
        </Stack>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
import { useState } from 'react';
import { Button, Stack, Text, Title, TextInput, PasswordInput } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AuthLayout from '../layouts/AuthLayout';

const inputStyles = {
  input: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#FAFBFB',
    border: '1px solid rgba(255,255,255,0.09)',
    boxShadow: 'inset 0 1px 0 rgba(250,251,251,0.04)',
    transition: 'all 0.2s ease',
    '&:focus': {
      border: '1px solid rgba(0,200,150,0.5)',
      background: 'rgba(255,255,255,0.06)',
      boxShadow: '0 0 0 3px rgba(0,200,150,0.10), inset 0 1px 0 rgba(250,251,251,0.04)',
    },
    '&::placeholder': {
      color: 'rgba(250,251,251,0.25)',
    },
  },
  innerInput: {
    color: '#FAFBFB',
  },
}

function SignupPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  const Label = ({ children }: { children: string }) => (
    <span style={{ color: 'rgba(250,251,251,0.7)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.04em', marginBottom: 4, display: 'inline-block' }}>
      {children}
    </span>
  )

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">

          {/* Header */}
          <div>
            <Text
              size="xs"
              style={{ color: '#00c896', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}
            >
              Get Started
            </Text>
            <Title
              order={1}
              style={{
                color: '#FAFBFB',
                fontWeight: 800,
                fontSize: 'clamp(1.6rem, 4vw, 2.25rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              Create your account
            </Title>
            <Text style={{ color: 'rgba(250,251,251,0.45)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Join Barbell Bites and start building your macro-friendly recipe vault.
            </Text>
          </div>

          {/* Error */}
          {error && (
            <div
              className="relative rounded-xl px-4 py-3 overflow-hidden"
              style={{
                background: 'rgba(255,80,80,0.08)',
                border: '1px solid rgba(255,80,80,0.25)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                className="absolute top-0 left-6 right-6 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,80,80,0.4), transparent)' }}
              />
              <Text style={{ color: 'rgba(255,160,160,0.9)', fontSize: '0.82rem', fontWeight: 600 }}>
                {error}
              </Text>
            </div>
          )}

          {/* Fields */}
          <Stack gap="sm">
            <TextInput
              label={<Label>Full name</Label>}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
              disabled={isLoading}
              variant="filled"
              size="md"
              radius="md"
              styles={inputStyles}
            />
            <TextInput
              label={<Label>Email address</Label>}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              disabled={isLoading}
              variant="filled"
              size="md"
              radius="md"
              styles={inputStyles}
            />
            <PasswordInput
              label={<Label>Password</Label>}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
              disabled={isLoading}
              variant="filled"
              size="md"
              radius="md"
              styles={inputStyles}
            />
          </Stack>

          {/* Submit */}
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            size="lg"
            radius="md"
            className="mt-1 font-bold tracking-widest uppercase text-sm relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-px"
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
            Create Account
          </Button>

          {/* Footer link */}
          <div className="text-center">
            <Text size="sm" style={{ color: 'rgba(250,251,251,0.4)' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#1DDFBD',
                  fontWeight: 700,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#00c896' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#1DDFBD' }}
              >
                Sign in
              </Link>
            </Text>
          </div>

        </Stack>
      </form>
    </AuthLayout>
  );
}

export default SignupPage;
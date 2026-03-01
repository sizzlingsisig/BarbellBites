import { useState } from 'react'
import { Button, Stack, Text, Title, TextInput, PasswordInput, Alert, Group, Loader, UnstyledButton } from '@mantine/core'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import heroImage from '../resources/Login.jpg'

function AuthPage() {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState('EN')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      console.error("Login failed", err)
    }
  }

  return (
    <main className="min-h-screen flex bg-ink font-sans selection:bg-brand-500 selection:text-ink relative">
      
      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full p-6 sm:p-8 flex justify-between items-center z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <Text className="text-paper font-black uppercase tracking-[0.15em] text-xl">
            Barbell <span className="text-brand-500">Bites</span>
          </Text>
        </div>
        
        <div className="pointer-events-auto">
          <UnstyledButton 
            onClick={() => setLanguage(language === 'EN' ? 'ES' : 'EN')}
            className="flex items-center gap-2 text-paper/70 hover:text-paper transition-colors text-sm font-medium bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
          >
            <span>🌐</span> {language}
          </UnstyledButton>
        </div>
      </header>

      {/* LEFT COLUMN (Auth) */}
      <section className="w-full lg:w-[60%] flex items-center justify-center px-4 sm:px-8 lg:px-12 py-32 lg:py-0 relative z-10">
        
        {/* FORM CONTAINER */}
        <div className="w-full max-w-md lg:max-w-[85%] xl:max-w-[800px]">
          <form onSubmit={handleSubmit}>
            <Stack gap="xl">
              
              <div>
                <Title order={1} className="text-paper font-bold text-3xl sm:text-4xl lg:text-5xl mb-2">
                  Welcome back
                </Title>
                <Text className="text-paper/60 text-sm sm:text-base">
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
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <Stack gap="md">
                <TextInput
                  label={<span className="text-paper/80 font-medium text-sm mb-1 inline-block">Email address</span>}
                  placeholder="chef@barbellbites.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  required
                  disabled={isLoading}
                  variant="filled"
                  size="lg"
                  radius="md"
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:focus': {
                        border: '1px solid #0CCEB0',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                  }}
                />

                <div>
                  <PasswordInput
                    label={<span className="text-paper/80 font-medium text-sm mb-1 inline-block">Password</span>}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    required
                    disabled={isLoading}
                    variant="filled"
                    size="lg"
                    radius="md"
                    styles={{
                      input: {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:focus': {
                          border: '1px solid #0CCEB0',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.3)',
                        },
                      },
                      innerInput: {
                        color: '#FFFFFF',
                      }
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
                size="xl" 
                radius="md"
                className="mt-4 font-bold transition-all duration-300 shadow-[0_0_20px_rgba(12,206,176,0.2)] hover:shadow-[0_0_30px_rgba(12,206,176,0.4)] hover:brightness-110"
                styles={{
                  root: {
                    backgroundImage: 'linear-gradient(to right, #000000, #0CCEB0)',
                    border: '1px solid rgba(12, 206, 176, 0.3)',
                    color: '#FFFFFF'
                  }
                }}
              >
                Sign In
              </Button>

              <div className="text-center mt-2">
                <Text size="sm" className="text-paper/60">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-paper hover:text-brand-500 font-semibold ml-1 transition-colors">
                    Sign up
                  </Link>
                </Text>
              </div>
              
            </Stack>
          </form>
        </div>
      </section>

{/* RIGHT COLUMN (Hero) */}
      <section className="hidden lg:flex lg:w-[40%] relative bg-ink overflow-hidden border-l border-white/5 items-center justify-center">
        
        {/* Full-height background image */}
        <img 
          src={heroImage} 
          alt="Barbell Bites Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* ULTRA-LARGE GLASS CARD */}
        <div className="relative z-10 w-[85%] max-w-2xl p-12 xl:p-16 rounded-[2rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col min-h-[75vh]">
          
          <div>
            <Title order={3} className="text-paper font-black text-5xl mb-6 leading-tight">
              Fuel Your True Potential.
            </Title>
            
            {/* Increased bottom margin to mb-24 for a huge gap */}
            <Text className="text-paper/90 text-3xl leading-relaxed mb-24">
              Join thousands of athletes who hit their daily protein and calorie targets effortlessly. 
              Our community-curated recipe vault is verified for nutritional accuracy to keep your meal prep dialed in. 
              Stop guessing your macros and start eating for your goals.
            </Text>
          </div>

          {/* Added mt-auto to push this entire block to the bottom of the card */}
          <Stack gap="2rem" className="mt-auto">
            
            {/* GOAL 1 */}
            <Group align="flex-start" wrap="nowrap" gap="xl">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-brand-500 text-3xl mt-1">
                🎯
              </div>
              <div className="text-left">
                <Text className="text-paper font-bold text-2xl mb-2">Hit Your Macros</Text>
                <Text className="text-paper/70 text-2xl leading-relaxed">
                  Precision tracking for your exact protein and calorie targets.
                </Text>
              </div>
            </Group>

            {/* GOAL 2 */}
            <Group align="flex-start" wrap="nowrap" gap="xl">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-brand-500 text-3xl mt-1">
                🍳
              </div>
              <div className="text-left">
                <Text className="text-paper font-bold text-2xl mb-2">Savor Your Prep</Text>
                <Text className="text-paper/70 text-2xl leading-relaxed">
                  Discover delicious, lifter-approved meals to replace bland chicken and rice.
                </Text>
              </div>
            </Group>

            {/* GOAL 3 */}
            <Group align="flex-start" wrap="nowrap" gap="xl">
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-brand-500 text-3xl mt-1">
                📈
              </div>
              <div className="text-left">
                <Text className="text-paper font-bold text-2xl mb-2">Fuel Your Gains</Text>
                <Text className="text-paper/70 text-2xl leading-relaxed">
                  Optimize your nutrition to lift heavier, recover faster, and build muscle.
                </Text>
              </div>
            </Group>
            
          </Stack>
          
        </div>
      </section>
    </main>
  )
}

export default AuthPage
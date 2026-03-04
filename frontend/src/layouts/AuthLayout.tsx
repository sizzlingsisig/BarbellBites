import type { ReactNode } from 'react';
import { Title, Text } from '@mantine/core';
import heroImage from '../resources/Login.jpg';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen font-sans selection:bg-(--color-primary-teal) selection:text-(--color-near-black) overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-deep-surface) 0%, var(--color-card-slate) 40%, var(--color-border-slate) 100%)' }}
    >
      {/* Glassmorphic ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 h-150 w-150 rounded-full opacity-20"
          style={{ background: 'var(--orb-top-left)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute top-1/2 -right-60 h-125 w-125 rounded-full opacity-15"
          style={{ background: 'var(--orb-right)', filter: 'blur(100px)' }}
        />
        <div
          className="absolute -bottom-20 left-1/3 h-100 w-100 rounded-full opacity-10"
          style={{ background: 'var(--orb-bottom)', filter: 'blur(90px)' }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 200, 150, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 150, 0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Logo */}
      <div className="absolute left-6 top-6 z-20">
        <Text className="font-black uppercase tracking-[0.15em] text-xl"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          Barbell <span className="text-brand-500">Bites</span>
        </Text>
      </div>

      <div className="relative z-10 container mx-auto px-0 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          {/* Left: Form slot */}
          <div className="flex items-center justify-center px-4 sm:px-8 py-8">
            <div className="w-full max-w-sm lg:max-w-md">
              {/* Glass card wrapping children */}
              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'var(--glass-fill-subtle)',
                  backdropFilter: 'var(--blur-glass-form)',
                  WebkitBackdropFilter: 'var(--blur-glass-form)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-glass-form)',
                }}
              >
                {children}
              </div>
            </div>
          </div>

          {/* Right: Hero Panel */}
          <div className="hidden lg:flex relative overflow-hidden items-center justify-center"
            style={{ borderLeft: '1px solid var(--glass-inner-highlight)' }}
          >
            {/* Background image */}
            <img
              src={heroImage}
              alt="Barbell Bites Hero"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark glass overlay on image */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(6, 14, 11, 0.72)', backdropFilter: 'var(--blur-image-overlay)' }}
            />
            {/* Teal ambient glow inside panel */}
            <div
              className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none"
              style={{ background: 'var(--hero-floor-glow)' }}
            />

            {/* Glass content card */}
            <div
              className="relative z-10 w-[90%] max-w-2xl rounded-3xl p-10 xl:p-12"
              style={{
                background: 'var(--glass-fill-base)',
                backdropFilter: 'var(--blur-glass-hero)',
                WebkitBackdropFilter: 'var(--blur-glass-hero)',
                border: '1px solid var(--glass-border-raised)',
                boxShadow: 'var(--shadow-glass-hero)',
              }}
            >
              {/* Top frosted accent bar */}
              <div
                className="absolute top-0 left-8 right-8 h-px"
                style={{ background: 'var(--card-accent-line)' }}
              />

              <Text
                className="font-black uppercase tracking-[0.15em] text-xl mb-6"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
              </Text>

              <Title
                order={2}
                className="font-bold text-4xl xl:text-5xl leading-tight mb-6"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                Fuel Your True{' '}
                <span style={{ color: 'var(--color-glow-teal)' }}>Potential.</span>
              </Title>

              <Text
                className="text-lg xl:text-xl leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Join thousands of athletes who hit their daily protein and calorie targets effortlessly. Our community-curated recipe vault is verified for nutritional accuracy so you can stop guessing your macros and start eating for your goals.
              </Text>

              {/* Bottom stats row — decorative glass pills */}
              <div className="mt-8 flex gap-3 flex-wrap">
                {['10k+ Athletes', 'Macro Verified', 'Daily Targets'].map((label) => (
                  <span
                    key={label}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide"
                    style={{
                      background: 'rgba(0,200,150,0.10)',
                      border: '1px solid rgba(0,200,150,0.25)',
                      color: 'var(--color-white-ui)',
                      backdropFilter: 'var(--blur-stat-pill)',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
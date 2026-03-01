import type { ReactNode } from 'react';
import { Title, Text } from '@mantine/core';
import heroImage from '../resources/Login.jpg';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-ink font-sans selection:bg-brand-500 selection:text-ink">
      {/* Left: Slot for form */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-sm lg:max-w-md">
          {children}
        </div>
      </section>

      {/* Right: Hero Panel with image */}
      <section className="hidden lg:flex flex-1 relative overflow-hidden border-l border-white/5 items-center justify-center bg-ink">
        <img src={heroImage} alt="Barbell Bites Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />

        <div className="relative z-10 w-[90%] max-w-3xl rounded-4xl border border-white/15 bg-black/70 p-10 xl:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.75)]">
          <Text className="text-paper/80 text-sm font-semibold mb-5 tracking-wide uppercase">Barbell Bites</Text>
          <Title order={2} className="text-paper font-bold text-4xl xl:text-5xl leading-tight mb-6">
            Fuel Your True Potential.
          </Title>
          <Text className="text-paper text-lg xl:text-xl leading-relaxed">
            Join thousands of athletes who hit their daily protein and calorie targets effortlessly. Our community-curated recipe vault is verified for nutritional accuracy so you can stop guessing your macros and start eating for your goals.
          </Text>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;

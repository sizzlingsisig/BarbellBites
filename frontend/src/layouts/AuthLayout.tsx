import type { ReactNode } from 'react';
import { Title, Text } from '@mantine/core';
import heroImage from '../resources/Login.jpg';

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-(--color-near-black) font-sans selection:bg-(--color-primary-teal) selection:text-(--color-near-black)">
      <div className="container mx-auto px-0 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: Slot for form */}
          <div className="flex items-center justify-center px-4 sm:px-8 py-8">
            <div className="w-full max-w-sm lg:max-w-md">
              {children}
            </div>
          </div>
          {/* Right: Hero Panel with image */}
          <div className="hidden lg:flex relative overflow-hidden border-l border-(--color-border-slate) items-center justify-center bg-(--color-card-slate)">
            <img src={heroImage} alt="Barbell Bites Hero" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-(--color-deep-surface)/80" />
            <div className="relative z-10 w-[90%] max-w-3xl rounded-4xl border border-(--color-border-slate) bg-(--color-deep-surface)/80 p-10 xl:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.75)]">
              <Text className="text-(--color-chrome-gray) text-sm font-semibold mb-5 tracking-wide uppercase">Barbell Bites</Text>
              <Title order={2} className="text-(--color-white-ui) font-bold text-4xl xl:text-5xl leading-tight mb-6">
                Fuel Your True Potential.
              </Title>
              <Text className="text-(--color-white-ui) text-lg xl:text-xl leading-relaxed">
                Join thousands of athletes who hit their daily protein and calorie targets effortlessly. Our community-curated recipe vault is verified for nutritional accuracy so you can stop guessing your macros and start eating for your goals.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;

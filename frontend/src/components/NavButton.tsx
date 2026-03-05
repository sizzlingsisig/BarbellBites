import { Button } from '@mantine/core'
import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

interface NavButtonProps {
  to: string
  icon: ReactNode
  label: string
  variant?: 'primary' | 'ghost'
}

function NavButton({ to, icon, label, variant = 'ghost' }: NavButtonProps) {
  return (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      {({ isActive }: { isActive: boolean }) => (
        <Button
          fullWidth
          leftSection={icon}
          className="relative overflow-hidden transition-all duration-150 active:scale-[0.97] active:translate-y-px"
          styles={{
            root: {
              background: isActive
                ? variant === 'primary'
                  ? 'linear-gradient(135deg, rgba(0,200,150,0.25) 0%, rgba(0,200,150,0.15) 100%)'
                  : 'rgba(0,200,150,0.08)'
                : variant === 'primary'
                  ? 'linear-gradient(135deg, rgba(7,157,132,0.18) 0%, rgba(0,200,150,0.10) 100%)'
                  : 'rgba(255,255,255,0.04)',
              color: isActive
                ? '#1DDFBD'
                : variant === 'primary'
                  ? 'rgba(29,223,189,0.75)'
                  : 'rgba(255,255,255,0.55)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
              textTransform: 'uppercase' as const,
              transition: 'all 0.2s ease',
              border: isActive
                ? '1px solid rgba(0,200,150,0.5)'
                : variant === 'primary'
                  ? '1px solid rgba(0,200,150,0.25)'
                  : '1px solid rgba(255,255,255,0.08)',
              boxShadow: isActive
                ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.3)'
                : 'inset 0 1px 0 rgba(255,255,255,0.05)',
            },
          }}
          onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = 'scale(0.97) translateY(1px)'
            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5), inset 0 2px 6px rgba(0,0,0,0.35)'
            e.currentTarget.style.borderColor = 'rgba(0,200,150,0.55)'
          }}
          onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = ''
            e.currentTarget.style.borderColor = ''
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = ''
            e.currentTarget.style.borderColor = ''
          }}
        >
          {label}
        </Button>
      )}
    </NavLink>
  )
}

export default NavButton
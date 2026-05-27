import { cn } from '@/lib/utils'
import { SVGProps } from 'react'

export function Spinner({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn('h-5 w-5 animate-spin text-primary-600', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-200', className)}
      {...props}
    />
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-neutral-100 p-3">
          <Icon className="h-8 w-8 text-neutral-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-neutral-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred. Please try again.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-3">
        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500 max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function LoadingState({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner className="h-8 w-8" />
      <p className="mt-3 text-sm text-neutral-500">{text}</p>
    </div>
  )
}

export function Divider({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('h-px w-full bg-neutral-200 my-6', className)} {...props} />
}

export function Avatar({
  src,
  initials,
  className,
  size = 'md',
}: {
  src?: string
  initials?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
  }
  return (
    <div className={cn('relative rounded-full overflow-hidden bg-primary-100 flex items-center justify-center font-medium text-primary-700', sizeClasses[size], className)}>
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  )
}

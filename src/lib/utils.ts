import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatSalary(min: number, max?: number): string {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  })
  if (max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }
  return `${formatter.format(min)}+`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    applied: 'bg-blue-100 text-blue-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    interview: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    offered: 'bg-emerald-100 text-emerald-800',
    saved: 'bg-purple-100 text-purple-800',
  }
  return colors[status] || 'bg-neutral-100 text-neutral-800'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Unified color mapping utilities for AetherOS.
 * Replaces duplicate style strings and fragile color replaces.
 */

export type Severity = 'critical' | 'high' | 'error' | 'warning' | 'medium' | 'degraded' | 'low' | 'info' | 'monitoring' | 'success' | 'healthy' | 'resolved' | 'active';

export function getSeverityColor(severity: string): { text: string; bg: string; border: string; raw: string; badge: string } {
  const sev = severity.toLowerCase();
  switch (sev) {
    case 'critical':
    case 'high':
    case 'error':
      return {
        text: 'text-error',
        bg: 'bg-error/10',
        border: 'border-error/20',
        raw: '#ef4444',
        badge: 'bg-error/15 text-error border-error/25',
      };
    case 'warning':
    case 'medium':
    case 'degraded':
      return {
        text: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        raw: '#f59e0b',
        badge: 'bg-warning/15 text-warning border-warning/25',
      };
    case 'low':
    case 'info':
    case 'monitoring':
      return {
        text: 'text-info',
        bg: 'bg-info/10',
        border: 'border-info/20',
        raw: '#0ea5e9',
        badge: 'bg-info/15 text-info border-info/25',
      };
    case 'success':
    case 'healthy':
    case 'resolved':
    case 'active':
      return {
        text: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/20',
        raw: '#22c55e',
        badge: 'bg-success/15 text-success border-success/25',
      };
    default:
      return {
        text: 'text-white/60',
        bg: 'bg-white/5',
        border: 'border-white/10',
        raw: '#71717a',
        badge: 'bg-white/10 text-white/60 border-white/15',
      };
  }
}

export function getGradientByColor(colorClass: string): string {
  if (colorClass.includes('success') || colorClass.includes('22c55e')) {
    return 'from-success/10 to-success/5 border-success/20';
  }
  if (colorClass.includes('warning') || colorClass.includes('f59e0b')) {
    return 'from-warning/10 to-warning/5 border-warning/20';
  }
  if (colorClass.includes('error') || colorClass.includes('destructive') || colorClass.includes('ef4444')) {
    return 'from-error/10 to-error/5 border-error/20';
  }
  if (colorClass.includes('info') || colorClass.includes('electric-blue') || colorClass.includes('0ea5e9')) {
    return 'from-[#0ea5e9]/10 to-[#0ea5e9]/5 border-[#0ea5e9]/20';
  }
  if (colorClass.includes('purple') || colorClass.includes('8b5cf6')) {
    return 'from-[#8b5cf6]/10 to-[#8b5cf6]/5 border-[#8b5cf6]/20';
  }
  return 'from-white/5 to-white/0 border-white/10';
}

export function getStatusDot(severity: string): string {
  const sev = severity.toLowerCase();
  switch (sev) {
    case 'critical': case 'high': case 'error': return 'bg-error animate-pulse';
    case 'warning': case 'medium': case 'degraded': return 'bg-warning animate-pulse';
    case 'low': case 'info': case 'monitoring': return 'bg-info';
    case 'success': case 'healthy': case 'resolved': case 'active': return 'bg-success';
    default: return 'bg-white/30';
  }
}

export function getChartColor(index: number): string {
  const chartColors = ['#0ea5e9', '#06b6d4', '#8b5cf6', '#22c55e', '#f59e0b'];
  return chartColors[index % chartColors.length];
}

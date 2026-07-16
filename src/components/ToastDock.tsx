export type ToastPriority = 'undo' | 'found' | 'fact';

export interface ToastItem {
  id: string;
  priority: ToastPriority;
  content: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

interface ToastDockProps {
  toasts: ToastItem[];
  /** inline = flows in layout (game screen); fixed = bottom dock (other screens) */
  variant?: 'inline' | 'fixed';
}

const PRIORITY_ORDER: ToastPriority[] = ['undo', 'found', 'fact'];

export function ToastDock({ toasts, variant = 'fixed' }: ToastDockProps) {
  if (toasts.length === 0) return null;

  const sorted = [...toasts].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
  );
  const primary = sorted[0];

  return (
    <div className={`toast-dock toast-dock-${variant}`} role="status" aria-live="polite">
      <div className={`toast-dock-primary toast-${primary.priority}`} key={primary.id}>
        {primary.content}
        {primary.action && (
          <button className="btn btn-glass toast-action-btn" onClick={primary.action.onClick}>
            {primary.action.label}
          </button>
        )}
      </div>
    </div>
  );
}
export type ToastPriority = 'undo' | 'found' | 'fact';

export interface ToastItem {
  id: string;
  priority: ToastPriority;
  content: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

interface ToastDockProps {
  toasts: ToastItem[];
}

const PRIORITY_ORDER: ToastPriority[] = ['undo', 'found', 'fact'];

export function ToastDock({ toasts }: ToastDockProps) {
  if (toasts.length === 0) return null;

  const sorted = [...toasts].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority),
  );
  const primary = sorted[0];
  const secondary = sorted[1];

  return (
    <div className="toast-dock">
      <div className={`toast-dock-primary toast-${primary.priority}`} key={primary.id}>
        {primary.content}
        {primary.action && (
          <button className="btn btn-glass toast-action-btn" onClick={primary.action.onClick}>
            {primary.action.label}
          </button>
        )}
      </div>
      {secondary && secondary.priority === 'fact' && (
        <div className={`toast-dock-secondary toast-${secondary.priority}`} key={secondary.id}>
          {secondary.content}
        </div>
      )}
    </div>
  );
}
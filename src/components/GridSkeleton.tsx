interface GridSkeletonProps {
  size?: number;
}

export function GridSkeleton({ size = 10 }: GridSkeletonProps) {
  return (
    <div className="grid-skeleton">
      <div
        className="grid-skeleton-board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {Array.from({ length: size * size }).map((_, i) => (
          <div key={i} className="grid-skeleton-cell" style={{ animationDelay: `${(i % size) * 40}ms` }} />
        ))}
      </div>
      <p className="grid-skeleton-label">Preparing puzzle…</p>
    </div>
  );
}
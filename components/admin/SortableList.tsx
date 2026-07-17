"use client";

import { useState } from "react";

// Minimal HTML5 drag-and-drop reorder — no external lib. Renders each item via
// `children(item)` and calls onReorder(newOrderIds) after a drop.
export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  children,
}: {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  children: (item: T) => React.ReactNode;
}) {
  const [order, setOrder] = useState(items);
  const [dragId, setDragId] = useState<string | null>(null);

  // Keep local order in sync if the server list changes length/identity.
  if (
    items.length !== order.length ||
    items.some((it, i) => order[i]?.id !== it.id && !order.find((o) => o.id === it.id))
  ) {
    setOrder(items);
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = order.findIndex((o) => o.id === dragId);
    const to = order.findIndex((o) => o.id === targetId);
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next);
    setDragId(null);
    onReorder(next.map((o) => o.id));
  }

  return (
    <ul className="space-y-2">
      {order.map((item) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => setDragId(item.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(item.id)}
          className={[
            "rounded-2xl transition-shadow",
            dragId === item.id ? "opacity-50" : "",
          ].join(" ")}
        >
          {children(item)}
        </li>
      ))}
    </ul>
  );
}

export function DragHandle() {
  return (
    <span
      className="cursor-grab select-none text-frame active:cursor-grabbing"
      aria-hidden
      title="برای جابه‌جایی بکشید"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="6" r="1.6" />
        <circle cx="15" cy="6" r="1.6" />
        <circle cx="9" cy="12" r="1.6" />
        <circle cx="15" cy="12" r="1.6" />
        <circle cx="9" cy="18" r="1.6" />
        <circle cx="15" cy="18" r="1.6" />
      </svg>
    </span>
  );
}

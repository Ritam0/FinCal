import { useRef, useState } from 'react';

/**
 * Below `md`, renders children as a horizontally swipeable, scroll-snapped row
 * with dot pagination. At `md` and up, falls back to a normal responsive grid.
 *
 * Wrap each child in a fragment-friendly div — this component only supplies
 * the scroll/snap/grid mechanics, not card styling.
 *
 * @param {{ children: React.ReactNode[], gridClassName?: string }} props
 */
export default function SwipeCarousel({ children, gridClassName = 'md:grid-cols-2 lg:grid-cols-3' }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = Array.isArray(children) ? children : [children];
  const count = items.length;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || count === 0) return;
    const first = el.children[0];
    if (!first) return;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    const stride = first.offsetWidth + gap;
    const index = stride > 0 ? Math.round(el.scrollLeft / stride) : 0;
    setActiveIndex(Math.min(Math.max(index, 0), count - 1));
  };

  const scrollToIndex = (i) => {
    const el = scrollRef.current;
    const card = el?.children[i];
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex md:grid ${gridClassName} gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-pl-4 md:scroll-pl-0`}
      >
        {items.map((child, i) => (
          <div
            key={child.key ?? i}
            className="min-w-[86%] xs:min-w-[320px] sm:min-w-[340px] md:min-w-0 shrink-0 md:shrink snap-start md:snap-align-none"
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="flex md:hidden justify-center gap-1.5 mt-3">
          {items.map((child, i) => (
            <button
              key={child.key ?? i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to card ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === activeIndex ? 'w-5 bg-accent-600' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

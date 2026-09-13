/**
 * Shared glass-card shell: translucent surface, blur, soft border and shadow.
 * Padding/spacing is left to the caller so every card can compose its own layout.
 */
export default function Card({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component
      className={`rounded-3xl bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/40 shadow-xl shadow-slate-200/40 dark:shadow-black/30 transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

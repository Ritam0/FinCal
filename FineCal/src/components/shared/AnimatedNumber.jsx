import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { formatINR } from '../../utils/format';

/**
 * Tweens a currency value from its previous displayed number to the new one.
 * Continues smoothly from whatever is currently on screen, so rapid updates
 * (e.g. dragging a slider) chain without visible jumps.
 */
export default function AnimatedNumber({ value, className }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const [display, setDisplay] = useState(safeValue);
  const displayRef = useRef(safeValue);

  useEffect(() => {
    const controls = animate(displayRef.current, safeValue, {
      duration: 0.5,
      ease: 'easeOut',
      onUpdate: (v) => {
        displayRef.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeValue]);

  return <span className={className}>{formatINR(display)}</span>;
}

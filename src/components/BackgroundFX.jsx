import { useMemo } from 'react';

const CONFETTI_COUNT = 22;
const COLORS = ['#00d4aa', '#ffc845'];

function BackgroundFX() {
  const pieces = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: COLORS[i % 2],
      isDot: i % 3 === 0,
      duration: `${3 + Math.random() * 3}s`,
      delay: `${Math.random() * -6}s`,
    }));
  }, []);

  return (
    <div className="fx-layer" aria-hidden="true">
      <div className="fx-orb fx-orb-gold" />
      <div className="fx-orb fx-orb-teal" />
      {pieces.map((p) => (
        <span
          key={p.id}
          className={p.isDot ? 'fx-confetti fx-confetti-dot' : 'fx-confetti'}
          style={{
            left: p.left,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default BackgroundFX;
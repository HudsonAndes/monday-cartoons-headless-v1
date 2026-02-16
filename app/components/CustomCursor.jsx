import {useState, useEffect} from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({x: -100, y: -100});
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({x: e.clientX, y: e.clientY});
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  return (
    <div
      className="cursor-dot"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${clicking ? 0.6 : 1})`,
      }}
    />
  );
}

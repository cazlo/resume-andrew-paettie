import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import ZoomEngine from './engine';
import { PALETTES } from './palette';
import { FORMULAS } from './formulas';
import './Mandelbrot.css';

/*
 * /mandelbrot — a continuously zooming escape-time renderer.
 *
 * This component owns nothing but the DOM and the controls; all of the
 * rendering, pacing and steering lives in ZoomEngine, which runs off
 * requestAnimationFrame and a pool of workers. React only re-renders when the
 * engine pushes a stats snapshot, a few times a second.
 */

const DETAIL_OPTIONS = [
  { id: 'fast', hint: 'small frames, many of them' },
  { id: 'sharp', hint: 'full device resolution' },
  { id: 'ultra', hint: 'supersampled, downscaled on blit' },
];

const formatMagnitude = value => {
  if (!Number.isFinite(value)) return '--';
  if (value < 1000) return `${value.toFixed(1)}x`;
  const exp = Math.floor(Math.log10(value));
  return `${(value / 10 ** exp).toFixed(2)}e${exp}x`;
};

// Show as many decimals as the current zoom actually resolves, and no more:
// trailing garbage digits would imply precision the doubles do not have.
const formatCoord = (value, magnification) => {
  if (!Number.isFinite(value)) return '--';
  const digits = Math.min(17, Math.max(6, Math.round(Math.log10(Math.max(1, magnification))) + 5));
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}`;
};

const Readout = ({ label, value, wide }) => (
  <div className={wide ? 'Mandelbrot-readout Mandelbrot-readout--wide' : 'Mandelbrot-readout'}>
    <span className="Mandelbrot-readoutLabel">{label}</span>
    <span className="Mandelbrot-readoutValue">{value}</span>
  </div>
);

Readout.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  wide: PropTypes.bool,
};

Readout.defaultProps = { wide: false };

export default function Mandelbrot() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [ui, setUi] = useState({
    running: true,
    autopilot: true,
    zoomRate: 0.32,
    detail: 'sharp',
    formulaId: FORMULAS[0].id,
    paletteId: PALETTES[0].id,
  });

  const update = useCallback(partial => {
    setUi(prev => ({ ...prev, ...partial }));
    if (engineRef.current) engineRef.current.setOptions(partial);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new ZoomEngine(canvas, { onStats: setStats });
    engineRef.current = engine;

    // Visitors who asked for reduced motion get the opening frame, held.
    const reduced =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      engine.setOptions({ running: false });
      setUi(prev => ({ ...prev, running: false }));
    }
    engine.start();

    const observer = new ResizeObserver(() => engine.resize());
    observer.observe(canvas);

    // Pointer coordinates arrive in CSS pixels; the engine works in the
    // canvas's device pixels.
    const toDevice = event => {
      const rect = canvas.getBoundingClientRect();
      const sx = canvas.width / (rect.width || 1);
      const sy = canvas.height / (rect.height || 1);
      return { x: (event.clientX - rect.left) * sx, y: (event.clientY - rect.top) * sy };
    };

    const stopAutopilot = () => {
      engine.setOptions({ autopilot: false });
      setUi(prev => (prev.autopilot ? { ...prev, autopilot: false } : prev));
    };

    // Registered directly so the wheel listener can be non-passive and keep
    // the gesture from scrolling the page instead of zooming.
    const onWheel = event => {
      event.preventDefault();
      const { x, y } = toDevice(event);
      const step = event.deltaMode === 1 ? event.deltaY * 18 : event.deltaY;
      engine.zoomAt(x, y, Math.exp(-step * 0.0016));
      stopAutopilot();
    };

    let dragging = null;
    const onPointerDown = event => {
      dragging = { id: event.pointerId, ...toDevice(event) };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = event => {
      if (!dragging || dragging.id !== event.pointerId) return;
      const { x, y } = toDevice(event);
      if (Math.abs(x - dragging.x) + Math.abs(y - dragging.y) > 1) {
        engine.panBy(x - dragging.x, y - dragging.y);
        stopAutopilot();
        dragging = { ...dragging, x, y };
      }
    };
    const onPointerUp = event => {
      if (dragging && dragging.id === event.pointerId) canvas.releasePointerCapture(event.pointerId);
      dragging = null;
    };

    const onDoubleClick = event => {
      const { x, y } = toDevice(event);
      engine.focusAt(x, y);
      engine.setOptions({ autopilot: true, running: true });
      setUi(prev => ({ ...prev, autopilot: true, running: true }));
    };

    const onKeyDown = event => {
      if (event.target !== document.body) return;
      const keys = {
        ' ': () => {
          setUi(prev => {
            engine.setOptions({ running: !prev.running });
            return { ...prev, running: !prev.running };
          });
        },
        a: () => {
          setUi(prev => {
            engine.setOptions({ autopilot: !prev.autopilot });
            return { ...prev, autopilot: !prev.autopilot };
          });
        },
        j: () => engine.warp(),
        r: () => engine.reset(),
        x: () => engine.juliaHere(),
      };
      const action = keys[event.key.toLowerCase()] || keys[event.key];
      if (action) {
        event.preventDefault();
        action();
      }
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('dblclick', onDoubleClick);
    window.addEventListener('keydown', onKeyDown);

    const previousTitle = document.title;
    document.title = 'Mandelbrot Drive';
    // Retires the site-wide sunset and grid backdrop for as long as this page
    // is up; see Mandelbrot.css.
    document.body.classList.add('Mandelbrot-page');

    return () => {
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('keydown', onKeyDown);
      observer.disconnect();
      document.body.classList.remove('Mandelbrot-page');
      document.title = previousTitle;
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const magnification = stats ? stats.magnification : 1;

  return (
    <div className="Mandelbrot">
      <canvas className="Mandelbrot-canvas" ref={canvasRef} />
      <div className="Mandelbrot-crt" aria-hidden="true" />

      <header className="Mandelbrot-header">
        <div>
          <h1 className="Mandelbrot-title">{stats ? stats.formula : 'Mandelbrot'} Drive</h1>
          <p className="Mandelbrot-subtitle">
            {stats ? stats.mode : 'BOOTING'} <span className="Mandelbrot-sep">//</span> sector{' '}
            {stats ? stats.seed : '--'} <span className="Mandelbrot-sep">//</span> locked on{' '}
            {stats ? stats.target : '--'}
          </p>
        </div>
        <Link className="Mandelbrot-back" to="/">
          &lsaquo; back to resume
        </Link>
      </header>

      <section className="Mandelbrot-hud" aria-label="renderer telemetry">
        <Readout label="re" value={stats ? formatCoord(stats.cx, magnification) : '--'} wide />
        <Readout label="im" value={stats ? formatCoord(stats.cy, magnification) : '--'} wide />
        <Readout label="zoom" value={formatMagnitude(magnification)} />
        <Readout label="iter" value={stats ? stats.maxIter : '--'} />
        <Readout label="fps" value={stats ? stats.fps.toFixed(0) : '--'} />
        <Readout label="frame" value={stats ? `${stats.frameMs.toFixed(0)}ms` : '--'} />
        <Readout label="grid" value={stats ? stats.resolution : '--'} wide />
        <Readout label="sample" value={stats ? `${stats.sampling.toFixed(2)}x` : '--'} />
        <Readout label="threads" value={stats ? stats.workers || 'main' : '--'} />
        {stats && stats.param && (
          <Readout
            label="constant c"
            value={`${stats.param.re.toFixed(4)}${stats.param.im >= 0 ? '+' : ''}${stats.param.im.toFixed(4)}i`}
            wide
          />
        )}
        <div className="Mandelbrot-depth" title="descent toward the double-precision floor">
          <span className="Mandelbrot-readoutLabel">depth</span>
          <div className="Mandelbrot-depthTrack">
            <div className="Mandelbrot-depthFill" style={{ width: `${((stats ? stats.depth : 0) * 100).toFixed(1)}%` }} />
          </div>
        </div>
      </section>

      <footer className="Mandelbrot-controls">
        <div className="Mandelbrot-controlRow">
          <Button
            variant="outlined"
            size="small"
            onClick={() => update({ running: !ui.running })}
            aria-pressed={ui.running}
          >
            {ui.running ? 'hold' : 'resume'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            color={ui.autopilot ? 'primary' : 'secondary'}
            onClick={() => update({ autopilot: !ui.autopilot })}
            aria-pressed={ui.autopilot}
          >
            autopilot {ui.autopilot ? 'on' : 'off'}
          </Button>
          <Button variant="outlined" size="small" onClick={() => engineRef.current.warp()}>
            warp
          </Button>
          <Button variant="outlined" size="small" onClick={() => engineRef.current.reset()}>
            reset
          </Button>
          {stats && stats.canJulia && (
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => engineRef.current.juliaHere()}
              title="the Julia set for the point in the middle of this view"
            >
              {stats.formulaId === 'julia' ? 'back to mandelbrot' : 'julia here'}
            </Button>
          )}
        </div>

        <div className="Mandelbrot-controlRow">
          <ToggleButtonGroup
            size="small"
            exclusive
            /* Read from the engine, not local state: "julia here" switches the
               formula without going through the toggle. */
            value={stats ? stats.formulaId : ui.formulaId}
            onChange={(event, value) => value && update({ formulaId: value })}
            aria-label="fractal"
          >
            {FORMULAS.map(formula => (
              <ToggleButton key={formula.id} value={formula.id} aria-label={formula.name}>
                {formula.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <div className="Mandelbrot-controlRow">
          <span className="Mandelbrot-readoutLabel">detail</span>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={ui.detail}
            onChange={(event, value) => value && update({ detail: value })}
            aria-label="detail level"
          >
            {DETAIL_OPTIONS.map(option => (
              <ToggleButton key={option.id} value={option.id} aria-label={option.hint} title={option.hint}>
                {option.id}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <div className="Mandelbrot-controlRow">
          <span className="Mandelbrot-readoutLabel">rate</span>
          <Slider
            size="small"
            min={0.08}
            max={0.9}
            step={0.02}
            value={ui.zoomRate}
            onChange={(event, value) => update({ zoomRate: value })}
            aria-label="zoom rate"
            sx={{ width: 120 }}
          />
          <ToggleButtonGroup
            size="small"
            exclusive
            value={ui.paletteId}
            onChange={(event, value) => value && update({ paletteId: value })}
            aria-label="palette"
          >
            {PALETTES.map(palette => (
              <ToggleButton key={palette.id} value={palette.id} aria-label={palette.name}>
                {palette.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <p className="Mandelbrot-hint">
          scroll to zoom &middot; drag to pan &middot; double-click to steer the dive &middot; space holds, a toggles
          autopilot, j warps, x jumps to the julia set here, r resets
        </p>
      </footer>
    </div>
  );
}

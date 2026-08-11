import assignBands, { tileCounts } from './bandAssignment';
import heroTech from '../heroTech';
import { ROWS, ROW_BAND_STEP } from './GridBackground';

const geometryFor = columns => ({ rows: ROWS, columns, bandStep: ROW_BAND_STEP });

// A wide desktop, a laptop, and a phone.
const VIEWPORT_COLUMNS = [20, 14, 4];

describe('assignBands', () => {
  it('gives every band a technology', () => {
    const geometry = geometryFor(14);
    const assignment = assignBands(heroTech, geometry);

    expect(assignment).toHaveLength(ROW_BAND_STEP * (ROWS - 1) + 14);
    assignment.forEach(index => {
      expect(heroTech[index]).toBeDefined();
    });
  });

  it('shows the most-used technologies more often than the least-used', () => {
    const counts = tileCounts(heroTech, geometryFor(14));

    expect(counts.get('AWS')).toBeGreaterThan(counts.get('InfluxDB'));
    expect(counts.get('OS Admin')).toBeGreaterThan(counts.get('Rust'));
    expect(counts.get('Docker')).toBeGreaterThan(counts.get('ArgoCD'));
  });

  it('never lets a lighter technology outnumber a heavier one', () => {
    VIEWPORT_COLUMNS.forEach(columns => {
      const counts = tileCounts(heroTech, geometryFor(columns));
      const byWeight = [...heroTech].sort((a, b) => b.weight - a.weight);

      byWeight.forEach((heavier, i) => {
        byWeight.slice(i + 1).forEach(lighter => {
          if (heavier.weight > lighter.weight) {
            expect(counts.get(heavier.key)).toBeGreaterThanOrEqual(counts.get(lighter.key));
          }
        });
      });
    });
  });

  it('never puts the same technology on neighbouring bands', () => {
    VIEWPORT_COLUMNS.forEach(columns => {
      const assignment = assignBands(heroTech, geometryFor(columns));
      assignment.slice(1).forEach((index, i) => {
        expect(index).not.toBe(assignment[i]);
      });
    });
  });

  it('keeps the heaviest technologies on screen even when bands are scarce', () => {
    // A phone has fewer bands than technologies, so some have to drop off.
    const counts = tileCounts(heroTech, geometryFor(4));
    const heaviest = [...heroTech].sort((a, b) => b.weight - a.weight).slice(0, 5);

    heaviest.forEach(tile => {
      expect(counts.get(tile.key)).toBeGreaterThan(0);
    });
  });
});

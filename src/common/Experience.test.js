import { Experience, Interval } from './Experience';

const currentYear = new Date().getFullYear();

describe('Experience.toTimeline', () => {
  it('marks an open interval as ongoing', () => {
    expect(new Experience([new Interval(2017, null)]).toTimeline()).toBe('2017 - current');
  });

  it('marks an interval started this year as ongoing rather than a bare year', () => {
    expect(new Experience([new Interval(currentYear, null)]).toTimeline()).toBe(`${currentYear} - current`);
  });

  it('renders a single past year on its own', () => {
    expect(new Experience([new Interval(2015, 2015)]).toTimeline()).toBe('2015');
  });

  it('joins multiple intervals', () => {
    expect(new Experience([new Interval(2014, 2017), new Interval(2019, 2022)]).toTimeline()).toBe(
      '2014 - 2017, 2019 - 2022',
    );
  });
});

describe('Experience.lastUsed', () => {
  it('reports the current year for an open interval', () => {
    expect(new Experience([new Interval(2021, null)]).lastUsed()).toBe(currentYear);
  });
});

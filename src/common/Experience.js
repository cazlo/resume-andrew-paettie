// eslint-disable-next-line max-classes-per-file
export class Experience {
  constructor(intervals = []) {
    this.intervals = intervals;
  }

  toNumber() {
    const intervalSum = this.intervals?.reduce((sum, interval) => sum + (interval.endYear - interval.startYear), 0);
    return intervalSum;
    // if (intervalSum < 1) return intervalSum;
    // return Math.ceil(intervalSum);
  }

  lastUsed() {
    return Math.floor(
      this.intervals?.reduce((prevMax, current) => {
        if (current.endYear > prevMax) {
          return current.endYear;
        }
        return prevMax;
      }, 0),
    );
  }

  toTimeline() {
    const currentYear = new Date().getFullYear();
    return this.intervals
      .reduce((prev, current) => {
        if (current.startYear === current.endYear) {
          prev.push(`${current.startYear}`);
        } else if (current.endYear === currentYear) {
          prev.push(`${current.startYear} - current`);
        } else {
          prev.push(`${current.startYear} - ${current.endYear}`);
        }

        return prev;
      }, [])
      .join(', ');
  }
}

export class Interval {
  constructor(startYear, endYear) {
    this.startYear = startYear;
    if (!endYear) {
      this.endYear = new Date().getFullYear();
    } else {
      this.endYear = endYear;
    }
  }
}

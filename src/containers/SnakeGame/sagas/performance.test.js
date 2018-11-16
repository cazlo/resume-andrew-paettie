/* eslint-disable no-console */
import * as Promise from 'bluebird';
import _ from 'lodash';

import { PERFECT_SCORE, playGame } from './testHelper';
import Format from '../util/Format'

const gamesToSimulate = 20;
describe(`Performance criteria (${gamesToSimulate} games)`, () => {
  let results = [];
  let scores = [];
  beforeAll(async () => {
    results = await Promise.map(new Array(gamesToSimulate), playGame, {concurrency:4});
    scores = results.map(s => s.score)
  }, 600000);

  it("averages over 50 score", async () => {
    const avg = _.sum(scores)/gamesToSimulate;
    expect(avg).toBeGreaterThanOrEqual(50);
    console.log(`avg: ${avg}`);
    const avgD = (_.sum(results.map(r=>r.duration))/gamesToSimulate).toFixed(0);
    console.log(`avgDuration: ${Format.formatDuration(avgD)}`)
  });

  it("min is at least 2 (the worst game possible if there is input)", async () => {
    const min = _.min(scores);
    expect(min).toBeGreaterThanOrEqual(2);
    console.log(`min: ${min}`)
  });

  it("max is less than perfect score", async () => {
    const max = _.max(scores);
    expect(max).toBeLessThanOrEqual(PERFECT_SCORE);
    console.log(`max: ${max}`)
  });

});


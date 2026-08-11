/*
 * Worker shell around the escape-time kernel.
 *
 * One message in describes a band of a frame, one message out carries the
 * finished pixels. Both typed arrays are transferred rather than copied, so a
 * completed band costs the main thread a pointer hand-off instead of a few
 * megabytes of structured clone.
 */

import { renderBand } from './renderer';

// `self` is the worker's global scope. The lint rule that restricts it exists
// to catch window-vs-self confusion in page code; here it is the only handle
// there is.
/* eslint-disable no-restricted-globals */
const scope = self;

scope.onmessage = event => {
  const job = event.data;
  const started = performance.now();
  const { rgba, coarse, coarseW, coarseRows } = renderBand(job);
  scope.postMessage(
    {
      jobId: job.jobId,
      y0: job.y0,
      y1: job.y1,
      rgba: rgba.buffer,
      coarse: coarse.buffer,
      coarseW,
      coarseRows,
      elapsed: performance.now() - started,
    },
    [rgba.buffer, coarse.buffer],
  );
};

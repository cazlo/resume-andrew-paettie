import { createAction } from '@reduxjs/toolkit';

import Action from './Action';

export const startPathFind = createAction(Action.START_PATH_FIND);
export const finishPathFind = createAction(Action.FINISH_PATH_FIND);
export const pathNotFound = createAction(Action.PATH_NOT_FOUND);
export const ignoringStaleResult = createAction(Action.IGNORE_STALE_RESULT);

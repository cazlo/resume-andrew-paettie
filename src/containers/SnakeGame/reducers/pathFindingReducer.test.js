import Action from '../actions/Action';
import { setGreedySolverState } from '../actions/pathFindingAction';
import reducer from './pathFindingReducer';

describe('path finding solver state', () => {
  it('stores recovery progress and clears it on reset or algorithm change', () => {
    const recovery = { mode: 'recovery', recoveryPath: [{ x: 1, y: 2 }] };
    let state = reducer(undefined, { type: '@@INIT' });

    state = reducer(state, setGreedySolverState(recovery));
    expect(state.greedySolverState).toEqual(recovery);

    state = reducer(state, { type: Action.RESET });
    expect(state.greedySolverState).toBeNull();

    state = reducer(state, setGreedySolverState(recovery));
    state = reducer(state, { type: Action.SET_ALGORITHM, algorithm: Action.ALGORITHMS.hamiltonian });
    expect(state.greedySolverState).toBeNull();
  });
});

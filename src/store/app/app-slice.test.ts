import { CITIES, SortType } from '@/const';
import { appActions, appSlice } from './app-slice';

describe('App Slice', () => {
  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const expectedState = {
      activeId: 'test-123',
      activeSort: SortType.LowToHigh,
      randomCity: CITIES[0].name,
    };

    const result = appSlice.reducer(expectedState, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };
    const result = appSlice.reducer(undefined, emptyAction);

    const cityNames = CITIES.map((city) => city.name);

    expect(result.activeId).toBeNull();
    expect(result.activeSort).toBe(SortType.Popular);
    expect(cityNames).toContain(result.randomCity);
  });

  it('should set activeId with "setActiveId" action', () => {
    const initialState = {
      activeId: null,
      activeSort: SortType.Popular,
      randomCity: CITIES[0].name,
    };
    const expectedId = 'test-456';

    const result = appSlice.reducer(
      initialState,
      appActions.setActiveId(expectedId),
    );

    expect(result.activeId).toBe(expectedId);
  });

  it('should set activeSort with "setActiveSort" action', () => {
    const initialState = {
      activeId: null,
      activeSort: SortType.Popular,
      randomCity: CITIES[0].name,
    };
    const expectedSort = SortType.HighToLow;

    const result = appSlice.reducer(
      initialState,
      appActions.setActiveSort(expectedSort),
    );

    expect(result.activeSort).toBe(expectedSort);
  });

  it('should change randomCity with "setRandomCity" action', () => {
    const initialState = {
      activeId: null,
      activeSort: SortType.Popular,
      randomCity: CITIES[0].name,
    };

    const result = appSlice.reducer(initialState, appActions.setRandomCity());
    const cityNames = CITIES.map((city) => city.name);

    expect(cityNames).toContain(result.randomCity);
  });
});

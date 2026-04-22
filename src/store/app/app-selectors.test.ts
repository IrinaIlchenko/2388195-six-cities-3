import { CITIES, SortType } from '@/const';
import { selectActiveId, selectActiveSort, selectRandomCity } from './app-slice';

describe('App selectors', () => {
  const state = {
    app: {
      activeId: 'test-id-123',
      activeSort: SortType.TopRated,
      randomCity: CITIES[0].name,
    }
  };

  it('should return activeId from state', () => {
    const { activeId } = state.app;
    const result = selectActiveId(state);
    expect(result).toBe(activeId);
  });

  it('should return activeSort from state', () => {
    const { activeSort } = state.app;
    const result = selectActiveSort(state);
    expect(result).toBe(activeSort);
  });

  it('should return randomCity from state', () => {
    const { randomCity } = state.app;
    const result = selectRandomCity(state);
    expect(result).toBe(randomCity);
  });
});

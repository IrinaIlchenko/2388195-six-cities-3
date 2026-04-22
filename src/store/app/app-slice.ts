import { CITIES, SortType } from '@/const';
import { CityName, ListOffer } from '@/types/offer';
import getRandomCity from '@/util';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AppState {
  activeId: ListOffer['id'] | null;
  activeSort: SortType;
  randomCity: CityName;
}

const initialState: AppState = {
  activeId: null,
  activeSort: SortType.Popular,
  randomCity: getRandomCity(CITIES),
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveId(state, action: PayloadAction<ListOffer['id'] | null>) {
      state.activeId = action.payload;
    },
    setActiveSort(state, action: PayloadAction<SortType>) {
      state.activeSort = action.payload;
    },
    setRandomCity(state) {
      state.randomCity = getRandomCity(CITIES);
    },
  },
  selectors: {
    selectActiveId: (state: AppState) => state.activeId,
    selectActiveSort: (state: AppState) => state.activeSort,
    selectRandomCity: (state: AppState) => state.randomCity,
  },
});

export const appActions = { ...appSlice.actions };
export const { selectActiveId, selectActiveSort, selectRandomCity } =
  appSlice.selectors;

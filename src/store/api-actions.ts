import {createAsyncThunk} from "@reduxjs/toolkit";
import offersFetcher from "../api/offersFetch.ts";
import {AxiosInstance} from "axios";
import {AppDispatch, RootState} from "./index.ts";
import {setPlaces} from "./action.ts";

export const fetchOffersAction = createAsyncThunk<void, void,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>(
  'data/fetchOffers',
  async (_, {dispatch, extra: api}) => {
    const data = await offersFetcher(api);
    dispatch(setPlaces(data));
  }
)

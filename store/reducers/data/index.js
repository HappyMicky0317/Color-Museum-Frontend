import { RECEIVED_DATA } from "../../actions";

const initialState = {
  allReceivedData: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVED_DATA:
      return { ...state, allReceivedData: action.payload };
    default:
      return state;
  }
};

export default reducer;

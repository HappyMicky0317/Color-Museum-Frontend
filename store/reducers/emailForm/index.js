import {
  EMAILFORM,
  INDIVIDUAL
} from "../../actions";

const initialState = {
  emailData: '',
  individualPage: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EMAILFORM:
      return { ...state, emailData: action.payload };
    case INDIVIDUAL:
      return { ...state, individualPage: action.payload }
    default:
      return state;
  }
};

export default reducer;

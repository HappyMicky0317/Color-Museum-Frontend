import {
  ERROR_OFF,
  ERROR_ON,
  MESSAGEOBJ,
  SLIDE_OFF,
  SLIDE_ON,
  SUCCESS_OFF,
  SUCCESS_ON,
} from "../../actions";

const initialState = {
  success: false,
  error: false,
  messageObj: null,
  slide: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGEOBJ:
      return { ...state, messageObj: action.payload };
    case SUCCESS_ON:
      const newSuccess = { ...state, ...action.payload };
      newSuccess.success = true;
      return newSuccess;
    case SUCCESS_OFF:
      const newSuccessOff = { ...state, ...action.payload };
      newSuccessOff.success = false;
      return newSuccessOff;
    case ERROR_ON:
      const newError = { ...state, ...action.payload };
      newError.error = true;
      return newError;
    case ERROR_OFF:
      const newErrorOff = { ...state, ...action.payload };
      newErrorOff.error = false;
      return newErrorOff;
    case SLIDE_ON:
      const newSlideOn = { ...state, ...action.payload };
      newSlideOn.slide = true;
      return newSlideOn;
    case SLIDE_OFF:
      const newSlideOff = { ...state, ...action.payload };
      newSlideOff.slide = false;
      return newSlideOff;
    default:
      return state;
  }
};

export default reducer;

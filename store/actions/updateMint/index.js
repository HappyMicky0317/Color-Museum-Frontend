import {
  ERROR_OFF,
  ERROR_ON,
  MESSAGEOBJ,
  SLIDE_OFF,
  SLIDE_ON,
  SUCCESS_OFF,
  SUCCESS_ON,
} from "../";

export const MessageObj = (payload) => ({
  type: MESSAGEOBJ,
  payload: payload,
});
export const SuccessOn = () => ({
  type: SUCCESS_ON,
});
export const SuccessOff = () => ({
  type: SUCCESS_OFF,
});
export const ErrorOn = () => ({
  type: ERROR_ON,
});
export const ErrorOff = () => ({
  type: ERROR_OFF,
});
export const SlideOn = () => ({
  type: SLIDE_ON,
});
export const SlideOff = () => ({
  type: SLIDE_OFF,
});

import { RECEIVED_DATA } from "../";

export const ReceivedData = (payload) => ({
  type: RECEIVED_DATA,
  payload: payload,
});

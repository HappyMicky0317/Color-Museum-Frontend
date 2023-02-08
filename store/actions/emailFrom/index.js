import {
    EMAILFORM,
    INDIVIDUAL
} from "../";

export const EmailForm = (payload) => ({
    type: EMAILFORM,
    payload: payload,
});

export const Individual = (payload) => ({
    type: INDIVIDUAL,
    payload: payload,
}); 

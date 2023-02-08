import { HYDRATE } from "next-redux-wrapper";
import {
  WARNING_ON,
  WARNING_OFF,
  VIOLETED_ON,
  VIOLETED_OFF,
  COLORSALREADYMINTED,
  COLORMINTED_ON,
  COLORMINTED_OFF,
  NAMEISCLEAN_ON,
  NAMEISCLEAN_OFF,
  NAMEUSED_ON,
  NAMEUSED_OFF,
  DESCRIPTIONISCLEAN_ON,
  DESCRIPTIONISCLEAN_OFF,
  ISMINTING_ON,
  ISMINTING_OFF,
  SUBSCRIBED_OFF,
  SUBSCRIBED_ON,
} from "../../actions";

const initialState = {
  warning: false,
  subscribed: false,
  violeted: false,
  isNameClean: false,
  isDescriptionClean: false,
  nameUsed: false,
  alreadyMintedColors: null,
  colorAlreadyMinted: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.user };
    case WARNING_ON:
      const newWarningOn = { ...state, ...action.payload };
      newWarningOn.warning = true;
      return newWarningOn;
    case WARNING_OFF:
      const newWarningOff = { ...state, ...action.payload };
      newWarningOff.warning = false;
    case SUBSCRIBED_ON:
      const newSubscribedOn = { ...state, ...action.payload };
      newSubscribedOn.subscribed = true;
      return newSubscribedOn;
    case SUBSCRIBED_OFF:
      const newSubscribedOff = { ...state, ...action.payload };
      newSubscribedOff.subscribed = false;
      return newSubscribedOff;
    case VIOLETED_ON:
      const newVioletedOn = { ...state, ...action.payload };
      newVioletedOn.violeted = true;
      return newVioletedOn;
    case VIOLETED_OFF:
      const newVioletedOff = { ...state, ...action.payload };
      newVioletedOff.violeted = false;
      return newVioletedOff;
    case COLORSALREADYMINTED:
      const newColorsAlreadyMinted = { ...state };
      newColorsAlreadyMinted.alreadyMintedColors = action.payload;
      return newColorsAlreadyMinted;
    case COLORMINTED_ON:
      const newColorMintedOn = { ...state, ...action.payload };
      newColorMintedOn.colorAlreadyMinted = true;
      return newColorMintedOn;
    case COLORMINTED_OFF:
      const newColorMintedOff = { ...state, ...action.payload };
      newColorMintedOff.colorAlreadyMinted = false;
      return newColorMintedOff;
    case ISMINTING_ON:
      const newIsMintingOn = { ...state, ...action.payload };
      newIsMintingOn.isMinting = true;
      return newIsMintingOn;
    case ISMINTING_OFF:
      const newIsMintingOff = { ...state, ...action.payload };
      newIsMintingOff.isMinting = false;
      return newIsMintingOff;
    case NAMEUSED_ON:
      const newNameOn = { ...state, ...action.payload };
      newNameOn.nameUsed = true;
      return newNameOn;
    case NAMEUSED_OFF:
      const newNameOff = { ...state, ...action.payload };
      newNameOff.nameUsed = false;
      return newNameOff;
    case NAMEISCLEAN_ON:
      const newNameIsCleanOn = { ...state, ...action.payload };
      newNameIsCleanOn.isNameClean = true;
      return newNameIsCleanOn;
    case NAMEISCLEAN_OFF:
      const newNameIsCleanOff = { ...state, ...action.payload };
      newNameIsCleanOff.isNameClean = false;
      return newNameIsCleanOff;
    case DESCRIPTIONISCLEAN_ON:
      const newDescriptionIsCleanOn = { ...state, ...action.payload };
      newDescriptionIsCleanOn.isDescriptionClean = true;
      return newDescriptionIsCleanOn;
    case DESCRIPTIONISCLEAN_OFF:
      const newDescriptionIsCleanOff = { ...state, ...action.payload };
      newDescriptionIsCleanOff.isDescriptionClean = false;
      return newDescriptionIsCleanOff;
    default:
      return state;
  }
};

export default reducer;

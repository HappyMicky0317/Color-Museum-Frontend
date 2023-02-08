import { HYDRATE } from "next-redux-wrapper";
import {
  TOGGLECLICKED,
  HIDEHEADERLOGO,
  FULLWIDTHPAGE,
  LOCALSTORAGECHANGE,
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
  LOGIN_ON,
  LOGIN_OFF,
  ADD_EMAIL_ON,
  ADD_EMAIL_OFF,
  LOGOUT_OFF,
  LOGOUT_ON,
} from "../../actions";

const initialState = {
  toggle: false,
  hideHeaderLogo: false,
  fullWidthPage: false,
  localStorageChange: false,
  warning: false,
  violeted: false,
  isNameClean: false,
  isDescriptionClean: false,
  nameUsed: false,
  alreadyMintedColors: null,
  colorAlreadyMinted: false,
  loginComponent: false,
  addEmail: false,
  logout: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.user };
    case TOGGLECLICKED:
      const newToggle = { ...state, ...action.payload };
      newToggle.toggle = !newToggle.toggle;
      return newToggle;
    case HIDEHEADERLOGO:
      const hideLogo = { ...state, ...action.payload };
      hideLogo.hideHeaderLogo = !hideLogo.hideHeaderLogo;
      return hideLogo;
    case FULLWIDTHPAGE:
      const fullWidth = { ...state, ...action.payload };
      fullWidth.fullWidthPage = !fullWidth.fullWidthPage;
      return fullWidth;
    case LOCALSTORAGECHANGE:
      const newLocalStorage = { ...state, ...action.payload };
      newLocalStorage.localStorageChange = !newLocalStorage.localStorageChange;
      return newLocalStorage;
    case WARNING_ON:
      const newWarningOn = { ...state, ...action.payload };
      newWarningOn.warning = true;
      return newWarningOn;
    case WARNING_OFF:
      const newWarningOff = { ...state, ...action.payload };
      newWarningOff.warning = false;
      return newWarningOff;
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
    case LOGIN_ON:
      const loginComponentTrue = { ...state, ...action.payload };
      loginComponentTrue.loginComponent = true;
      return loginComponentTrue;
    case LOGIN_OFF:
      const loginComponentFalse = { ...state, ...action.payload };
      loginComponentFalse.loginComponent = false;
      return loginComponentFalse;
    case ADD_EMAIL_ON:
      const addEmailTrue = { ...state, ...action.payload };
      addEmailTrue.addEmail = true;
      return addEmailTrue;
    case ADD_EMAIL_OFF:
      const addEmailFalse = { ...state, ...action.payload };
      addEmailFalse.addEmail = false;
      return addEmailFalse;
    case LOGOUT_ON:
      const logoutTrue = { ...state, ...action.payload };
      logoutTrue.logout = true;
      return logoutTrue;
    case LOGOUT_OFF:
      const logoutFalse = { ...state, ...action.payload };
      logoutFalse.logout = false;
      return logoutFalse;
    default:
      return state;
  }
};

export default reducer;

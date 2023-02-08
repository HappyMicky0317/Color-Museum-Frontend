import {
  TOGGLECLICKED,
  HIDEHEADERLOGO,
  FULLWIDTHPAGE,
  LOCALSTORAGECHANGE,
  COLORCHANGE,
  WARNING_OFF,
  WARNING_ON,
  BLACKLISTEDHEX,
  VIOLETED_ON,
  VIOLETED_OFF,
  COLORSALREADYMINTED,
  COLORMINTED_ON,
  COLORMINTED_OFF,
  NAMEUSED_ON,
  NAMEUSED_OFF,
  NAMEISCLEAN_ON,
  NAMEISCLEAN_OFF,
  NAMECHANGE,
  BLACKLISTEDNAME,
  DESCRIPTIONCHANGE,
  DESCRIPTIONISCLEAN_ON,
  DESCRIPTIONISCLEAN_OFF,
  CONNECTEDADDRESS,
  WEB3,
  HEXTONUMBER,
  GASPRICE,
  PRICETOMINT,
  ISMINTING_ON,
  ISMINTING_OFF,
  TRANSACTIONHASH,
  SUBSCRIBED_OFF,
  SUBSCRIBED_ON,
  ONCHAINORDER_TOGGLE,
  LOGIN_ON,
  LOGIN_OFF,
  ADD_EMAIL_ON,
  ADD_EMAIL_OFF,
  LOGOUT_ON,
  LOGOUT_OFF,
} from "../";

export const Toggle = () => ({
  type: TOGGLECLICKED,
});
export const HideHeaderLogo = () => ({
  type: HIDEHEADERLOGO,
});
export const FullWidthPage = () => ({
  type: FULLWIDTHPAGE,
});
export const LocalStorage = () => ({
  type: LOCALSTORAGECHANGE,
});
export const ColorChange = (payload) => ({
  type: COLORCHANGE,
  payload: payload,
});
export const NameChange = (payload) => ({
  type: NAMECHANGE,
  payload: payload,
});
export const DescriptionChange = (payload) => ({
  type: DESCRIPTIONCHANGE,
  payload: payload,
});
export const ConnectAddress = (payload) => ({
  type: CONNECTEDADDRESS,
  payload: payload,
});
export const Web3Provider = (payload) => ({
  type: WEB3,
  payload: payload,
});
export const HexToNumber = (payload) => ({
  type: HEXTONUMBER,
  payload: payload,
});
export const PriceToMint = (payload) => ({
  type: PRICETOMINT,
  payload: payload,
});
export const GasPrice = (payload) => ({
  type: GASPRICE,
  payload: payload,
});
export const TransactionHash = (payload) => ({
  type: TRANSACTIONHASH,
  payload: payload,
});
export const WarningOn = () => ({
  type: WARNING_ON,
});
export const WarningOff = () => ({
  type: WARNING_OFF,
});
export const SubscribedOn = () => ({
  type: SUBSCRIBED_ON,
});
export const SubscribedOff = () => ({
  type: SUBSCRIBED_OFF,
});
export const VioletedOn = () => ({
  type: VIOLETED_ON,
});
export const VioletedOff = () => ({
  type: VIOLETED_OFF,
});
export const BlacklistedHex = () => ({
  type: BLACKLISTEDHEX,
});
export const BlacklistedName = () => ({
  type: BLACKLISTEDNAME,
});
export const ColorsAlreadyMinted = (payload) => ({
  type: COLORSALREADYMINTED,
  payload: payload,
});
export const ColorMintedOn = () => ({
  type: COLORMINTED_ON,
});
export const ColorMintedOff = () => ({
  type: COLORMINTED_OFF,
});
export const NameUsedOn = () => ({
  type: NAMEUSED_ON,
});
export const NameUsedOff = () => ({
  type: NAMEUSED_OFF,
});
export const NameIsCleanOn = () => ({
  type: NAMEISCLEAN_ON,
});
export const NameIsCleanOff = () => ({
  type: NAMEISCLEAN_OFF,
});
export const DescriptionIsCleanOn = () => ({
  type: DESCRIPTIONISCLEAN_ON,
});
export const DescriptionIsCleanOff = () => ({
  type: DESCRIPTIONISCLEAN_OFF,
});
export const IsMintingOn = () => ({
  type: ISMINTING_ON,
});
export const IsMintingOff = () => ({
  type: ISMINTING_OFF,
});
export const OnChainToggle = () => ({
  type: ONCHAINORDER_TOGGLE,
});
export const LoginOn = () => ({
  type: LOGIN_ON,
});
export const LoginOff = () => ({
  type: LOGIN_OFF,
});
export const AddEmailOn = () => ({
  type: ADD_EMAIL_ON,
});
export const AddEmailOff = () => ({
  type: ADD_EMAIL_OFF,
});
export const LogoutOn = () => ({
  type: LOGOUT_ON,
});
export const LogoutOff = () => ({
  type: LOGOUT_OFF,
});

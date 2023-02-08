import { styled } from "@stitches/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { violet, mauve, blackA } from "@radix-ui/colors";

export const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "start",
  borderRadius: 30,
  padding: "0 0px 0 15px",
  fontSize: 15,
  lineHeight: 1,
  height: 25,
  margin: 0,
  paddingBottom: "2px",
  gap: 5,
  backgroundColor: "#000",
  color: "#fff",
  border: "2px solid #c0c0c0", // border of radix dropdown for bid
  cursor: "pointer",
  minWidth: "80px",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:focus": { boxShadow: `0 0 0 2px black` },
  fontFamily: "Sen",
});

export const StyledTrigger2 = styled(SelectPrimitive.SelectTrigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "start",
  borderRadius: 30,
  padding: "0 0px 0 15px",
  fontSize: 15, // font size of drop down closed text
  lineHeight: 1,
  height: 25,
  margin: 0,
  paddingBottom: "2px",
  gap: 5,
  backgroundColor: "#000",
  color: "#fff",
  border: "2px solid #c0c0c0",
  cursor: "pointer",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:focus": { boxShadow: `0 0 0 2px black` },
  fontFamily: "Sen",
});
export const StyledTrigger3 = styled(SelectPrimitive.SelectTrigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "start",
  borderRadius: 30,
  padding: "0 10px 0 15px",
  fontSize: 15, // font size of drop down closed text
  lineHeight: 1,
  height: 25,
  margin: 0,
  paddingBottom: "2px",
  gap: 5,
  backgroundColor: "#000",
  color: "#fff",
  border: "2px solid #c0c0c0",
  cursor: "pointer",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:focus": { boxShadow: `0 0 0 2px black` },
  fontFamily: "Sen",
});

export const StyledContent = styled(SelectPrimitive.Content, {
  overflow: "hidden",
  backgroundColor: "#000",
  borderRadius: 6,
  border: "2px solid #fff",
  marginLeft: "-5px",
  padding: 0,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});
export const StyledContentFilter = styled(SelectPrimitive.Content, {
  overflow: "hidden",
  backgroundColor: "#000",
  borderRadius: 6,
  border: "2px solid #fff",
  marginRight: "-15px",
  marginLeft: "10px",
  padding: 0,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

export const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 0,
});

export const StyledItem = styled(SelectPrimitive.Item, {
  all: "unset",
  fontSize: 15,
  lineHeight: "30px",
  color: "#fff",
  borderRadius: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  height: 35,
  width: "120%",
  padding: "0 0 0 25px",
  position: "relative",
  userSelect: "none",
  fontFamily: "Sen",
  cursor: "pointer",
  // borderTop: '1px solid #fff',
  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },
  "&:focus": {
    backgroundColor: "#fff",
    color: "#000",
  },
});

export const StyledLabel = styled(SelectPrimitive.Label, {
  padding: "5px 25px 0",
  fontSize: 11, // font size of deadline label text
  textTransform: "uppercase",
  lineHeight: "25px",
  color: "#fff",
  marginBottom: "5px",
  fontFamily: "Plaid",
});
export const StyledPrimitiveValue = styled(SelectPrimitive.Value, {
  marginTop: "3px",
  fontFamily: "Plaid-L-Mono",
});
export const StyledPrimitiveIcon = styled(SelectPrimitive.Icon, {
  marginTop: "0px",
});

export const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

export const scrollButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 25,
  backgroundColor: "white",
  color: violet.violet11,
  cursor: "default",
};

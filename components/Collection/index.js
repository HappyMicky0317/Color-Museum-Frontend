import React from "react";
import styles from "../../styles/modules/collection/collectionSingle.module.css";
import NumberFormat from "react-number-format";
import { styled, keyframes } from "@stitches/react";
import { violet, blackA, mauve } from "@radix-ui/colors";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

const Collection = () => {
  return (
    <section className={styles.Wrapper}>
      <div className={styles.InnerWrapper}>
        <div className={styles.HeaderContainer}>
          <div className={styles.leftText}>
            <h1 className={styles.header}>Color NFT by Color Museum </h1>
            <h4 className={styles.headerSmall}> COLLECTION</h4>
          </div>
          <div className={styles.rightText}>
            <h4 className={styles.volumeContent}>
              <span>
                <NumberFormat
                  value={380865}
                  className="foo"
                  displayType={"text"}
                  thousandSeparator={true}
                  // prefix={'$'}
                  renderText={(value, props) => (
                    <b {...props}>
                      <span className={styles.doller}>$</span>
                      {value}{" "}
                    </b>
                  )}
                />
                Total Volume&nbsp;&nbsp;
              </span>
              <span>
                <b>511 </b>Colors&nbsp;&nbsp;
              </span>
              <span>
                <b>309</b> Owners
              </span>
            </h4>
          </div>
        </div>

        <article className={styles.secondContainer}>
          <div className={styles.flexSecondContainer}>
            <h1>Recent Trades</h1>
          </div>
          <div className={styles.CollectionTable}>
            <div className={styles.CollectionTableHead}>
              <h5 className={styles.headBox}>COLOR</h5>
              <h5 className={styles.headName}>NAME</h5>
              <h5 className={styles.headCode}>HEXADECIMAL</h5>
              <h5 className={styles.headLastPrice}>LAST PRICE</h5>
              <h5 className={styles.headETH}>
                <b>$ |</b>
                <span> ETH </span>
              </h5>
              <h5 className={styles.headBuyer}>BUYER</h5>
              <h5 className={styles.headSeller}>SELLER</h5>
              <h5 className={styles.headDate}>DATE</h5>
              <h5 className={styles.headTx}>TX</h5>
            </div>
            <div className={styles.CollectionTableBody}>
              <div className={styles.colorBox}>
                <div
                  className={styles.box}
                  style={{ background: "#BADA55" }}
                ></div>
              </div>
              <div className={styles.colorName}>BADASS</div>
              <div className={styles.colorCode}>#BADA55</div>
              <div className={styles.colorLastPrice}>
                <b>$682.23</b>
              </div>
              <div className={styles.colorETH}>
                <img src={"/images/uparrow.png"} alt="Sold" />
                +2.5%
              </div>
              <div className={styles.colorBuyer}>morgan.eth</div>
              <div className={styles.colorSeller}>0x87aa...ba42</div>
              <div className={styles.colorDate}>2.22.2022 12:12 GMT</div>
              <div className={styles.colorTx}>
                <img src={"/images/arrow.png"} alt="Sold" />
              </div>
            </div>
            <div className={styles.CollectionTableBody}>
              <div className={styles.colorBox}>
                <div
                  className={styles.box}
                  style={{ background: "#20C0BC" }}
                ></div>
              </div>
              <div className={styles.colorName}>Mediterranean Turquoise</div>
              <div className={styles.colorCode}>#20C0BC</div>
              <div className={styles.colorLastPrice}>
                <b>$723.57</b>
              </div>
              <div className={styles.colorETH}>
                <img src={"/images/uparrow.png"} alt="Sold" />
                +2.5%
              </div>
              <div className={styles.colorBuyer}>morgan.eth</div>
              <div className={styles.colorSeller}>0x87aa...ba42</div>
              <div className={styles.colorDate}>2.22.2022 12:16 GMT</div>
              <div className={styles.colorTx}>
                <img src={"/images/arrow.png"} alt="Sold" />
              </div>
            </div>
            <div className={styles.CollectionTableBody}>
              <div className={styles.colorBox}>
                <div
                  className={styles.box}
                  style={{ background: "#DE1DE9" }}
                ></div>
              </div>
              <div className={styles.colorName}>Purple Nurple</div>
              <div className={styles.colorCode}>#DE1DE9</div>
              <div className={styles.colorLastPrice}>
                <b>$1295.69</b>
              </div>
              <div className={styles.colorETH}>
                <img src={"/images/uparrow.png"} alt="Sold" />
                +2.5%
              </div>
              <div className={styles.colorBuyer}>morgan.eth</div>
              <div className={styles.colorSeller}>0x87aa...ba42</div>
              <div className={styles.colorDate}>2.22.2022 12:15 GMT</div>
              <div className={styles.colorTx}>
                <img src={"/images/arrow.png"} alt="Sold" />
              </div>
            </div>
            <div className={styles.CollectionTableBody}>
              <div className={styles.colorBox}>
                <div
                  className={styles.box}
                  style={{ background: "#FAEBD7" }}
                ></div>
              </div>
              <div className={styles.colorName}>milk tooth</div>
              <div className={styles.colorCode}>#FEBD7</div>
              <div className={styles.colorLastPrice}>
                <b>$708.21</b>
              </div>
              <div className={styles.colorETH}>
                <img src={"/images/uparrow.png"} alt="Sold" />
                +2.5%
              </div>
              <div className={styles.colorBuyer}>morgan.eth</div>
              <div className={styles.colorSeller}>0x87aa...ba42</div>
              <div className={styles.colorDate}>2.22.2022 12:14 GMT</div>
              <div className={styles.colorTx}>
                <img src={"/images/arrow.png"} alt="Sold" />
              </div>
            </div>
            <div className={styles.CollectionTableBody}>
              <div className={styles.colorBox}>
                <div
                  className={styles.box}
                  style={{ background: "#D20000" }}
                ></div>
              </div>
              <div className={styles.colorName}>Kout Rogue</div>
              <div className={styles.colorCode}>#D20000</div>
              <div className={styles.colorLastPrice}>
                <b>$1249.73</b>
              </div>
              <div className={styles.colorETH}>
                <img src={"/images/uparrow.png"} alt="Sold" />
                +2.5%
              </div>
              <div className={styles.colorBuyer}>morgan.eth</div>
              <div className={styles.colorSeller}>0x87aa...ba42</div>
              <div className={styles.colorDate}>2.22.2022 12:13 GMT</div>
              <div className={styles.colorTx}>
                <img src={"/images/arrow.png"} alt="Sold" />
              </div>
            </div>
            <div className={styles.CollectionTableBody}>
              <div className={styles.colorBox}>
                <div
                  className={styles.box}
                  style={{ background: "#D20000" }}
                ></div>
              </div>
              <div className={styles.colorName}>LUCID DREAM</div>
              <div className={styles.colorCode}>#D20000</div>
              <div className={styles.colorLastPrice}>
                <b>$781.08</b>
              </div>
              <div className={styles.colorETH}>
                <img src={"/images/uparrow.png"} alt="Sold" />
                +2.5%
              </div>
              <div className={styles.colorBuyer}>morgan.eth</div>
              <div className={styles.colorSeller}>0x87aa...ba42</div>
              <div className={styles.colorDate}>2.22.2022 12:11 GMT</div>
              <div className={styles.colorTx}>
                <img src={"/images/arrow.png"} alt="Sold" />
              </div>
            </div>
            <div className={styles.CollectionTableBody}>
              <div className={styles.colorBox}>
                <div
                  className={styles.box}
                  style={{ background: "#00FF00" }}
                ></div>
              </div>
              <div className={styles.colorName}>RGB Green</div>
              <div className={styles.colorCode}>#00FF00</div>
              <div className={styles.colorLastPrice}>
                <b>$777.92</b>
              </div>
              <div className={styles.colorETH}>
                <img src={"/images/uparrow.png"} alt="Sold" />
                +2.5%
              </div>
              <div className={styles.colorBuyer}>morgan.eth</div>
              <div className={styles.colorSeller}>0x87aa...ba42</div>
              <div className={styles.colorDate}>2.22.2022 12:10 GMT</div>
              <div className={styles.colorTx}>
                <img src={"/images/arrow.png"} alt="Sold" />
              </div>
            </div>
          </div>
          {/* <div className={styles.flexSecondContainer}>
                        <h2><b>511</b> Colors</h2>
                    </div> */}
        </article>
        <section className={styles.combineDiv}>
          {/* <ChooseBox /> */}
          <div className={styles.rightTextSection}>
            <h2 className={styles.header}>
              Ten thousand immutable colors, chosen by you.
            </h2>
            <p className={styles.desc}>
              Modern screens display tens of millions to billions of colors.
              From this pool the Color Museum website enables anyone to mint a
              Color NFT on the Ethereum Blockchain. The total number of possible
              Color NFTs are algorithmically limited to 10,000—making a Color
              NFT 1600X rarer than a Bitcoin.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <Accordion
                type="single"
                defaultValue="item-1"
                collapsible
                className="accordionSize"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is a Color NFT?</AccordionTrigger>
                  <AccordionContent>
                    A Color NFT represents a new category of NFT: a Meta NFT.
                    Essentially, a Meta NFT is usable as a building block to
                    spawn new NFTs, or derivative NFTs—and other products and
                    experiences limited only by the imagination of creators, and
                    in the case of Color NFTs, what they can do with color.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Are Color NFTs random?</AccordionTrigger>
                  <AccordionContent>
                    A Color NFT is defined by the minter: you choose the exact
                    color with hexadecimal precision, and also name it and
                    describe it.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What is the max supply of Color NFTs?
                  </AccordionTrigger>
                  <AccordionContent>
                    Only 10,000 colors will see the light.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Can the name and description associated with a Color NFT be
                    changed?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, we plan to make this feature available in
                    February—gasless updating of the Color NFT’s name and
                    description by the NFT owner.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Can the color be changed?</AccordionTrigger>
                  <AccordionContent>
                    The color cannot be changed in any circumstance, as it is
                    set at the tokenID level, which is the primary immutable
                    component of the ERC-721 specification.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>What is the Color Museum?</AccordionTrigger>
                  <AccordionContent>
                    The Color Museum is the gateway to the Color NFT ecosystem,
                    leading the path and showing what’s possible with Color
                    NFTs; starting with Color NFT staking on the Color Museum
                    Market.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className={styles.flex}>
              <div className={styles.div}>
                <h3 className={styles.timesHeader}>511</h3>
                <p className={styles.descTimes}>color minted.</p>
              </div>
              <div className={styles.div}>
                <h3 className={styles.timesHeader}>511</h3>
                <p className={styles.descTimes}>color minted.</p>
              </div>
              <div className={styles.div}>
                <h3 className={styles.timesHeader}>511</h3>
                <p className={styles.descTimes}>color minted.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Collection;

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-accordion-content-height)" },
});

const slideUp = keyframes({
  from: { height: "var(--radix-accordion-content-height)" },
  to: { height: 0 },
});

const StyledAccordion = styled(AccordionPrimitive.Root, {
  borderRadius: 6,
});

const StyledItem = styled(AccordionPrimitive.Item, {
  overflow: "hidden",
  marginTop: 1,

  "&:first-child": {
    marginTop: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  "&:last-child": {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  "&:focus-within": {
    position: "relative",
    zIndex: 1,
  },
});

const StyledHeader = styled(AccordionPrimitive.Header, {
  all: "unset",
  display: "flex",
});

const StyledTrigger = styled(AccordionPrimitive.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  backgroundColor: "transparent",
  padding: "0 20px",
  height: 45,
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 15,
  lineHeight: 1,
  color: "white",
  cursor: "pointer",
  borderBottom: "1px solid white",
  '&[data-state="closed"]': { backgroundColor: "black" },
  '&[data-state="open"]': {
    backgroundColor: "black",
  },
});

const StyledContent = styled(AccordionPrimitive.Content, {
  overflow: "hidden",
  fontSize: 15,
  color: "white",
  backgroundColor: "black",

  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
    borderBottom: "1px solid white",
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
  },
});

const StyledContentText = styled("div", {
  padding: "15px 20px",
});

const StyledChevron = styled(ChevronDownIcon, {
  color: "white",
  transition: "transform 300ms cubic-bezier(0.87, 0, 0.13, 1)",
  "[data-state=open] &": { transform: "rotate(180deg)" },
});

// Exports
export const Accordion = StyledAccordion;
export const AccordionItem = StyledItem;
export const AccordionTrigger = React.forwardRef(
  ({ children, ...props }, forwardedRef) => (
    <StyledHeader>
      <StyledTrigger {...props} ref={forwardedRef}>
        {children}
        <StyledChevron aria-hidden />
      </StyledTrigger>
    </StyledHeader>
  )
);
export const AccordionContent = React.forwardRef(
  ({ children, ...props }, forwardedRef) => (
    <StyledContent {...props} ref={forwardedRef}>
      <StyledContentText>{children}</StyledContentText>
    </StyledContent>
  )
);

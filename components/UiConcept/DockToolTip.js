import Tippy from "@tippyjs/react/headless";
import { sticky } from "tippy.js";
import styles from "../../styles/modules/nav.module.css";

export const DockTooltip = ({ label, children }) => {
    return (
        <>
            <Tippy
                render={() => <div className={styles.tippy_tooltip}>{label}</div>}
                trigger="focusin mouseenter"
                // appendTo={document.body}
                sticky
                plugins={[sticky]}
                delay={50}
                offset={[0, 5]}
                interactive={true}
                animation={false}
                inertia={true}
                maxWidth={200}
                touch="none"
                popperOptions={{
                    modifiers: [
                        {
                            name: "computeStyles",
                            options: {
                                gpuAcceleration: false,
                            },
                        },
                    ],
                }}
            >
                {children}
            </Tippy>{" "}
        </>
    );
};

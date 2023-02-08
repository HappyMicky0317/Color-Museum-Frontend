import useRaf from "@rooks/use-raf";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { DockTooltip } from "./DockToolTip";
import { useWindowSize } from "react-use";
import styles from "../../styles/modules/nav.module.css";
import { useDispatch } from "react-redux";
import { Toggle } from "../../store/actions/toggle";

const baseWidth = 40;
const distanceLimit = baseWidth * 6;
const beyondTheDistanceLimit = distanceLimit + 1;
const distanceInput = [
    -distanceLimit,
    -distanceLimit / 0.5,
    -distanceLimit / 1,
    0,
    distanceLimit / 1,
    distanceLimit / 0.5,
    distanceLimit,
];
const widthOutput = [
    baseWidth,
    baseWidth * 1.1,
    baseWidth * 1.618,
    baseWidth * 2.1,
    baseWidth * 1.618,
    baseWidth * 1.1,
    baseWidth,
];

const useDockHoverAnimation = (mouseX, ref) => {
    const distance = useMotionValue(beyondTheDistanceLimit);
    const widthPX = useSpring(
        useTransform(distance, distanceInput, widthOutput),
        {
            damping: 100,
            stiffness: 760,
        }
    );

    const width = useTransform(widthPX, (width) => `${width / 16}rem`);

    useRaf(() => {
        const el = ref.current;
        const mouseXVal = mouseX.get();
        if (el && mouseXVal !== null) {
            const rect = el.getBoundingClientRect();

            // get the x coordinate of the img DOMElement's center
            // the left x coordinate plus the half of the width
            const imgCenterX = rect.left + rect.width / 2;

            // difference between the x coordinate value of the mouse pointer
            // and the img center x coordinate value
            const distanceDelta = mouseXVal - imgCenterX;
            distance.set(distanceDelta);
            return;
        }

        distance.set(beyondTheDistanceLimit);
    }, true);

    return { width, ref };
};

export function DockItem({ icon, action, appName, external, path, mouseX }) {
    const ref = useRef(null);
    const dispatch = useDispatch();

    const { width } = useDockHoverAnimation(mouseX, ref);
    const { width: windowWidth } = useWindowSize();

    const Icon = icon;

    return (
        <section>
            <div className={styles.handleHover}>
                <div className={styles.tippy_tooltip_top}>{appName}</div>
                <DockTooltip label={appName}>
                    <span>
                        {external ? (
                            <a
                                className={styles.dockItemNav}
                                href={path}
                                target="_blank"
                                onClick={() => dispatch(Toggle())}
                            >
                                <motion.div
                                    ref={ref}
                                    draggable={false}
                                    style={
                                        windowWidth > 1000
                                            ? {
                                                width,
                                                height: width,
                                                willChange: "width",
                                            }
                                            : { width: baseWidth, height: baseWidth }
                                    }
                                >
                                    <Icon />
                                </motion.div>
                                <div className={styles.box}>{appName}</div>
                            </a>
                        ) : (
                            <Link
                                aria-label={`Launch ${appName}`}
                                onClick={action}
                                href={path}
                                activeClassName="active"
                            >
                                <a
                                    className={styles.navLink}
                                    onClick={() => dispatch(Toggle())}
                                >
                                    <motion.div
                                        ref={ref}
                                        draggable={false}
                                        style={
                                            windowWidth > 1000
                                                ? {
                                                    width,
                                                    height: width,
                                                    willChange: "width",
                                                }
                                                : { width: baseWidth, height: baseWidth }
                                        }
                                    >
                                        <Icon />
                                    </motion.div>
                                    <div className={styles.box}>{appName}</div>
                                </a>
                            </Link>
                        )}
                    </span>
                </DockTooltip>
            </div>
        </section>
    );
}

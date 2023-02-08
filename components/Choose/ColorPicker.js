import styles from "../../styles/modules/choose/choose.module.css";
import { useSelector, useDispatch } from "react-redux";
import { ChromePicker } from "react-color";
import { useEffect, useState } from "react";
import { ColorChange } from "../../store/actions/toggle";

const ColorPicker = (props) => {
  const dispatch = useDispatch();
  const { choosenColorFinal } = useSelector((state) => state.minting);
  const { open, onTogglePicker } = props;
  const [colorChoosed, setColorChoosed] = useState(choosenColorFinal);
  useEffect(() => {
    setColorChoosed(choosenColorFinal);
  }, [choosenColorFinal]);
  const handleColorChange = ({ hex }) => {
    dispatch(ColorChange(hex.toUpperCase()));
    setColorChoosed(hex.toUpperCase());
  };
  //
  //

  return (
    <div className={styles.colorPickerContainer}>
      <button className={styles.button} onClick={onTogglePicker}>
        {open ? "Close" : "Open"} color picker
      </button>{" "}
      {open && (
        <article
          style={{
            marginBottom: "1rem",
          }}
          className={styles.colorPicker}
        >
          <ChromePicker color={colorChoosed} onChange={handleColorChange} />
        </article>
      )}
    </div>
  );
};

export default ColorPicker;

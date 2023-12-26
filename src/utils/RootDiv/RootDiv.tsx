import {Outlet} from "react-router-dom";
import styles from "./RootDiv.module.css";

const RootDiv = () => {
    return (
        <div className={styles.body}>
            <Outlet/>
        </div>
    )
}

export default RootDiv;
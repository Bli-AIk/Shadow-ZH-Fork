import styles from "./MarkdownImage.module.css";
import { sitePath } from "src/site-path";

export default function MarkdownImage(props) {
    const is_video = props.src.endsWith(".mp4") || props.src.endsWith(".webm");
    const src = sitePath(props.src);

    if (props.title !== undefined) {
        return (
            <span className={styles.figure}>
                { is_video ? <video src={src} alt={props.alt} controls className={styles.video} /> : <img src={src} alt={props.alt} className={styles.image} /> }
                <span className={styles.caption}>{props.title}</span>
            </span>
        );
    } else {
        return is_video ? <video src={src} alt={props.alt} controls className={styles.video}/> : <img src={src} alt={props.alt} className={styles.image} />;
    }
}

import styles from "./MarkdownImage.module.css";

export default function MarkdownImage(props) {
    const is_video = props.src.endsWith(".mp4") || props.src.endsWith(".webm");

    if (props.title !== undefined) {
        return (
            <span className={styles.figure}>
                { is_video ? <video src={props.src} alt={props.alt} controls className={styles.video} /> : <img src={props.src} alt={props.alt} className={styles.image} /> }
                <span className={styles.caption}>{props.title}</span>
            </span>
        );
    } else {
        return is_video ? <video src={props.src} alt={props.alt} controls className={styles.video}/> : <img src={props.src} alt={props.alt} className={styles.image} />;
    }
}

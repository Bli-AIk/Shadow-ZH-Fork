import styles from './Box.module.css';
import { sitePath } from 'src/site-path';

export default function Box({ children, className, ...props}) {
    const { style, ...rest } = props;
    const borderImage = `url("${sitePath('/brokenborder.png')}") 8 repeat`;
    if (className) {
        return <div className={`${styles.box} ${className}`} {...rest} style={{ ...style, borderImage: style?.borderImage || borderImage }}>{children}</div>;
    }
    return <div className={styles.box} {...rest} style={{ ...style, borderImage: style?.borderImage || borderImage }}>{children}</div>;
}

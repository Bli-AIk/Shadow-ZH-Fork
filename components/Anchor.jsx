import { Link } from "src/i18n/navigation";

export default function Anchor(props) {
    return <Link {...props} href={`#${props.link}`} id={props.link}>{props.children}</Link>;
}

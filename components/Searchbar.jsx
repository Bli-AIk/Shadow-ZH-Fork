"use client"
import { useTopLoader } from "nextjs-toploader";
//from https://www.emgoto.com/react-search-bar/
import styles from "./Searchbar.module.css";
import { sitePath } from "src/site-path";

export default function Searchbar(props) {
    const placeholder = props.placeholder || "Search"
    const submit = props.submit || "Submit"
    const id = props.id || "searchbar"
    const defaultValue = props.defaultValue || ""

    const loader = useTopLoader();

    return (
        <form action={sitePath('/')} method="get" className={styles.form} onSubmit={() => loader.start()}>
            {/* Header, for screen readers: */}
            <label htmlFor={id}>
                <span className={styles.hidden}>{placeholder}</span> 
            </label>

            <input
                type="text"
                id={id}
                placeholder={placeholder}
                name="query"
                className={styles.input}
                defaultValue={defaultValue}
            />
            <button
                type="submit"
                formAction={sitePath('/wiki/search')}
                className={styles.button}
            >
                {submit}
            </button>
        </form>
    )
}

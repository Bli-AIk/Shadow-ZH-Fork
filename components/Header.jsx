import { cloneElement, isValidElement } from 'react';
import { Link } from "src/i18n/navigation";

function textContent(children) {
    if (typeof children === 'string' || typeof children === 'number') return String(children);
    if (Array.isArray(children)) return children.map(textContent).join('');
    if (isValidElement(children)) return textContent(children.props.children);
    return '';
}

function removeTrailingText(children, count) {
    if (count <= 0) return children;
    if (Array.isArray(children)) {
        let remaining = count;
        const result = [...children];

        for (let index = result.length - 1; index >= 0 && remaining > 0; index -= 1) {
            const childText = textContent(result[index]);
            if (!childText) continue;
            const removed = Math.min(remaining, childText.length);
            result[index] = removeTrailingText(result[index], removed);
            remaining -= removed;
        }

        return result;
    }
    if (typeof children === 'string') return children.slice(0, Math.max(0, children.length - count));
    if (typeof children === 'number') {
        const value = String(children);
        return value.slice(0, Math.max(0, value.length - count));
    }
    if (!isValidElement(children)) return children;

    return cloneElement(children, {
        children: removeTrailingText(children.props.children, count),
    });
}

function slugify(value) {
    const slug = value
        .replaceAll(" ", "-")
        .toLowerCase()
        .replaceAll(/[^a-z0-9-]/g, "");
    if (slug) return slug;

    const codePoints = Array.from(value)
        .map((character) => character.codePointAt(0).toString(16))
        .join('-');
    return codePoints ? `section-${codePoints}` : 'section';
}

export default function Header(props) {
    const { anchorId, children, ...headingProps } = props;
    const rawText = textContent(children);
    const anchorMatch = rawText.match(/\s*\[([^\]]+)\]\s*$/);
    const visibleText = anchorMatch ? rawText.slice(0, anchorMatch.index).trim() : rawText.trim();
    const anchorText = anchorMatch ? anchorMatch[1] : visibleText;
    const transformed = anchorId || slugify(anchorText);
    const headingChildren = anchorMatch
        ? removeTrailingText(children, rawText.length - anchorMatch.index)
        : children;
    const content = (
        <Link href={`#${transformed}`} id={transformed}>
            {headingChildren || visibleText}
        </Link>
    );

    switch (props.level) {
        case 1: return <h1 {...headingProps}>{content}</h1>;
        case 2: return <h2 {...headingProps}>{content}</h2>;
        case 3: return <h3 {...headingProps}>{content}</h3>;
        case 4: return <h4 {...headingProps}>{content}</h4>;
        case 5: return <h5 {...headingProps}>{content}</h5>;
        case 6: return <h6 {...headingProps}>{content}</h6>;
        default: return <h1 {...headingProps}>{content}</h1>;
    }
}

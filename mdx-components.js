import MarkdownLink from "components/MarkdownLink"
import Header from "components/Header"
import MarkdownImage from "components/MarkdownImage"
import Box from "components/Box"
import Anchor from 'components/Anchor'
import ScaledSprite from "components/ScaledSprite"
import NewTab from "components/NewTab"
import CollapseBox from 'components/CollapseBox'
import NoteBox from 'components/NoteBox'
import { BilingualBlock, BilingualPart } from 'components/BilingualBlock'
import { sitePath } from 'src/site-path'

export function useMDXComponents(components) {
    return {
        a: (props) => (
            <MarkdownLink className="markdown" {...props} />
        ),
        h1: (props) => (
            <Header className="markdown" level={1} {...props} />
        ),
        h2: (props) => (
            <Header className="markdown" level={2} {...props} />
        ),
        h3: (props) => (
            <Header className="markdown" level={3} {...props} />
        ),
        h4: (props) => (
            <Header className="markdown" level={4} {...props} />
        ),
        h5: (props) => (
            <Header className="markdown" level={5} {...props} />
        ),
        h6: (props) => (
            <Header className="markdown" level={6} {...props} />
        ),
        img: (props) => (
            <MarkdownImage {...props} />
        ),
        source: ({ src, ...props }) => (
            <source {...props} src={sitePath(src)} />
        ),
        video: ({ src, ...props }) => (
            <video {...props} src={sitePath(src)} />
        ),
        Box,
        ScaledSprite,
        Anchor,
        NewTab,
        CollapseBox,
        NoteBox,
        BilingualBlock,
        BilingualPart,
        ...components,
    }
}

const articleLoaders = {
    actors: () => import('../content/en/wiki/actors.mdx'),
    basics: () => import('../content/en/wiki/basics.mdx'),
    'battle-areas': () => import('../content/en/wiki/battle-areas.mdx'),
    battlers: () => import('../content/en/wiki/battlers.mdx'),
    'classes-and-instances': () => import('../content/en/wiki/classes-and-instances.mdx'),
    climbing: () => import('../content/en/wiki/climbing.mdx'),
    'configurable-features': () => import('../content/en/wiki/configurable-features.mdx'),
    'creating-a-mod': () => import('../content/en/wiki/creating-a-mod.mdx'),
    'creating-a-spell': () => import('../content/en/wiki/creating-a-spell.mdx'),
    'creating-an-item': () => import('../content/en/wiki/creating-an-item.mdx'),
    cutscenes: () => import('../content/en/wiki/cutscenes.mdx'),
    debugging: () => import('../content/en/wiki/debugging.mdx'),
    'designing-a-map': () => import('../content/en/wiki/designing-a-map.mdx'),
    downloading: () => import('../content/en/wiki/downloading.mdx'),
    encounters: () => import('../content/en/wiki/encounters.mdx'),
    'enemy-attacks': () => import('../content/en/wiki/enemy-attacks.mdx'),
    'func-hooks': () => import('../content/en/wiki/func-hooks.mdx'),
    glossary: () => import('../content/en/wiki/glossary.mdx'),
    hooks: () => import('../content/en/wiki/hooks.mdx'),
    keybinds: () => import('../content/en/wiki/keybinds.mdx'),
    'lua-tutorial': () => import('../content/en/wiki/lua-tutorial.mdx'),
    'making-shops': () => import('../content/en/wiki/making-shops.mdx'),
    'map-layers': () => import('../content/en/wiki/map-layers.mdx'),
    'map-properties': () => import('../content/en/wiki/map-properties.mdx'),
    'mod-creation': () => import('../content/en/wiki/mod-creation.mdx'),
    objects: () => import('../content/en/wiki/objects.mdx'),
    'party-members': () => import('../content/en/wiki/party-members.mdx'),
    'playing-mods': () => import('../content/en/wiki/playing-mods.mdx'),
    'releasing-mods': () => import('../content/en/wiki/releasing-mods.mdx'),
    ui: () => import('../content/en/wiki/ui.mdx'),
    'using-events': () => import('../content/en/wiki/using-events.mdx'),
    'using-libraries': () => import('../content/en/wiki/using-libraries.mdx'),
    'wavemaking-reference': () => import('../content/en/wiki/wavemaking-reference.mdx'),
    'world-tool': () => import('../content/en/wiki/world-tool.mdx'),
    'writing-text': () => import('../content/en/wiki/writing-text.mdx'),
};

export const articleSlugs = Object.freeze(Object.keys(articleLoaders));

export async function loadArticle(slug) {
    const loader = articleLoaders[slug];
    return loader ? loader() : null;
}

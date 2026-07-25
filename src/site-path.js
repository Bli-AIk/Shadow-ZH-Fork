const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function sitePath(value) {
    if (typeof value !== 'string' || value.length === 0) return BASE_PATH || '/';
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) return value;

    const path = value.startsWith('/') ? value : `/${value}`;
    if (!BASE_PATH || path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
    return `${BASE_PATH}${path}`;
}

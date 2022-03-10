export const erIkkeProd = (): boolean => {
    const pathname = window.location.hostname;
    return pathname.includes('dev.intern.nav.no');
};
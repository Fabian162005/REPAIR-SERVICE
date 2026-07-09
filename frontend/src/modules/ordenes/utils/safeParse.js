export function safeParse(valor, defecto = []) {
    if (!valor) return defecto;

    if (Array.isArray(valor)) return valor;

    try {
        return JSON.parse(valor);
    } catch {
        return defecto;
    }
}
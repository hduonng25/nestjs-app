export function mask(x: any, fields = ['password']): any {
    for (const k in x) {
        if (x[k] && typeof x[k].toObject === 'function') {
            x[k] = x[k].toObject();
        }
        if (typeof x[k] === 'object' && !Array.isArray(x[k])) {
            mask(x[k], fields);
        } else if (fields.includes(k)) {
            x[k] = '***';
        }
    }
}

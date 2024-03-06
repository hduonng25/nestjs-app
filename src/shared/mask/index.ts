export function mask(x: any, fields = ['password']): any {
    if (Array.isArray(x)) {
        return x.map((item) => mask(item, fields));
    } else if (typeof x === 'object' && x !== null) {
        for (const k in x) {
          
            if (x[k] && typeof x[k].toObject === 'function') {
                x[k] = x[k].toObject();
            }
            if (typeof x[k] === 'object' && !Array.isArray(x[k])) {
                x[k] = mask(x[k], fields);
            } else if (fields.includes(k)) {
                x[k] = '********';
            }
        }
        return x;
    } else {
        return x;
    }
}

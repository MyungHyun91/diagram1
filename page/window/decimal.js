

export class _DECIMAL
{
    static pointCount(a)
    {
        const str = a.toString();
        if(!str.includes(".")) {return 0;}
        return str.split(".")[1].length;
    }

    static pointCountMax(arr)
    {
        return arr.reduce((prev, curr) =>
            Math.max(prev, _DECIMAL.pointCount(curr)), 0);
    }

    static sum(a, b)
    {
        const pow = 10**_DECIMAL.pointCountMax([a, b]);
        return (a*pow + b*pow) / pow;
    }

    static multiply(a, b)
    {
        const pow = 10**_DECIMAL.pointCountMax([a, b]);
        return (a*pow) * (b*pow) / (pow*pow);
    }

    static divide(a, b)
    {
        const pow = 10**_DECIMAL.pointCountMax([a, b]);
        return (a*pow) / (b*pow);
    }

    static mod(a, b)
    {
        const pow = 10**_DECIMAL.pointCountMax([a, b]);
        return ((a*pow) % (b*pow)) / pow;
    }
}
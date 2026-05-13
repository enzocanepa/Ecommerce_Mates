const ARS_FORMATTER = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});
export function formatPrice(amount) {
    return ARS_FORMATTER.format(amount);
}
export function formatPriceCompact(amount) {
    if (amount >= 1_000_000)
        return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)
        return `$${(amount / 1_000).toFixed(0)}K`;
    return formatPrice(amount);
}

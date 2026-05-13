export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
export function isValidPassword(password) {
    return password.length >= 6;
}
export function isNonEmpty(value) {
    return value.trim().length > 0;
}
export function isPositiveNumber(value) {
    return Number.isFinite(value) && value > 0;
}
export function validateLoginForm(email, password) {
    const errors = {};
    if (!isNonEmpty(email))
        errors.email = 'El email es obligatorio';
    else if (!isValidEmail(email))
        errors.email = 'El email no es válido';
    if (!isNonEmpty(password))
        errors.password = 'La contraseña es obligatoria';
    return errors;
}
export function validateRegisterForm(name, email, password, confirmPassword) {
    const errors = {};
    if (!isNonEmpty(name))
        errors.name = 'El nombre es obligatorio';
    if (!isNonEmpty(email))
        errors.email = 'El email es obligatorio';
    else if (!isValidEmail(email))
        errors.email = 'El email no es válido';
    if (!isNonEmpty(password))
        errors.password = 'La contraseña es obligatoria';
    else if (!isValidPassword(password))
        errors.password = 'Mínimo 6 caracteres';
    if (password !== confirmPassword)
        errors.confirmPassword = 'Las contraseñas no coinciden';
    return errors;
}
export function validateProductForm(product) {
    const errors = {};
    if (!isNonEmpty(product.name))
        errors.name = 'El nombre es obligatorio';
    const price = Number(product.price);
    if (!isPositiveNumber(price))
        errors.price = 'El precio debe ser mayor a cero';
    if (!isNonEmpty(product.category))
        errors.category = 'La categoría es obligatoria';
    return errors;
}

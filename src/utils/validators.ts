export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export interface FormErrors {
  [field: string]: string;
}

export function validateLoginForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  if (!isNonEmpty(email)) errors.email = 'El email es obligatorio';
  else if (!isValidEmail(email)) errors.email = 'El email no es válido';
  if (!isNonEmpty(password)) errors.password = 'La contraseña es obligatoria';
  return errors;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): FormErrors {
  const errors: FormErrors = {};
  if (!isNonEmpty(name)) errors.name = 'El nombre es obligatorio';
  if (!isNonEmpty(email)) errors.email = 'El email es obligatorio';
  else if (!isValidEmail(email)) errors.email = 'El email no es válido';
  if (!isNonEmpty(password)) errors.password = 'La contraseña es obligatoria';
  else if (!isValidPassword(password)) errors.password = 'Mínimo 6 caracteres';
  if (password !== confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';
  return errors;
}

export function validateProductForm(product: {
  name: string;
  price: number | string;
  category: string;
}): FormErrors {
  const errors: FormErrors = {};
  if (!isNonEmpty(product.name)) errors.name = 'El nombre es obligatorio';
  const price = Number(product.price);
  if (!isPositiveNumber(price)) errors.price = 'El precio debe ser mayor a cero';
  if (!isNonEmpty(product.category)) errors.category = 'La categoría es obligatoria';
  return errors;
}

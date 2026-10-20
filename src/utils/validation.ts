import type { Profile } from "../store/shop";
export function validateCustomer(p: Profile) {
  const errors: Partial<Record<keyof Profile, string>> = {};
  if (p.name.trim().length < 2) errors.name = "Укажите имя: минимум 2 символа";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()))
    errors.email = "Укажите корректный email";
  const digits = p.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15)
    errors.phone = "Укажите телефон: от 10 до 15 цифр";
  if (p.address.trim().length < 10)
    errors.address = "Укажите город, улицу и дом";
  return errors;
}

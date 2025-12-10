import { nanoid } from "nanoid/non-secure";
import { customAlphabet } from "nanoid/non-secure";

// GERAR UID COM 8 CARACTERES
export function gerarUID() {
  return nanoid(8); // 8 caracteres
}

// GERAR UID APENAS COM 5 NÚMEROS
const gerarNumeroID = customAlphabet("123456789", 5); // 5 dígitos
export function gerarNumeroUID() {
  return gerarNumeroID();
}

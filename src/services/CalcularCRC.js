import crc from "crc";

export const calcularCRC = (payload) => {
  const crc16 = crc
    .crc16ccitt(Buffer.from(payload, "utf8")) // calcula com base na string
    .toString(16) // converte para hexadecimal
    .toUpperCase(); // letras maiúsculas

  return crc16.padStart(4, "0"); // garante 4 caracteres com zeros à esquerda
};

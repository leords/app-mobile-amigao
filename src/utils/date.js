import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

//apenas data 01/01/2025
export const pegarDataAtual = (data = new Date()) => {
  return format(data, "dd/MM/yyyy", { locale: ptBR });
};
// data e horario 01/01/2025 00:00
export const pegarDataHoraAtual = (data = new Date()) => {
  return format(data, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
};

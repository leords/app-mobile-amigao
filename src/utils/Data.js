import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

//apenas data 01/01/2025
export const dataFormatada = (data = new Date()) => {
  return format(data, "dd/MM/yyyy", { locale: ptBR });
};
// data e horario 01/01/2025 00:00
export const dataHoraFormatada = (data = new Date()) => {
  return format(data, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
};

export const pegarDiaSemanaHoje = () => {
  const dias = [
    "DOMINGO",
    "SEGUNDA",
    "TERÇA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SÁBADO",
  ];
  return dias[new Date().getDay()];
};

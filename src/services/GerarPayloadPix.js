import { calcularCRC } from "./CalcularCRC";

export const GerarPayloadPix = (valor, txid) => {
  const chave = "41836758000141";
  const nome = "AMIGAO";
  const cidade = "CANOINHAS";
  const valorFormatado = parseFloat(valor || "0").toFixed(2);

  //lembrete: .trim() = apaga os espaços.

  const gui = "BR.GOV.BCB.PIX";
  const chavePix = chave.trim();
  const merchantAccountInfo = [
    `00${String(gui.length).padStart(2, "0")}${gui}`,
    `01${String(chavePix.length).padStart(2, "0")}${chavePix}`,
  ].join("");

  const tag26 = `26${String(merchantAccountInfo.length).padStart(
    2,
    "0"
  )}${merchantAccountInfo}`;

  const nomeFormatado = nome.trim();
  const cidadeFormatada = cidade.trim();

  const txidSubtag = `05${String(txid.length).padStart(2, "0")}${txid}`;
  const tag62 = `62${String(txidSubtag.length).padStart(2, "0")}${txidSubtag}`;

  const payloadArray = [
    "000201",
    tag26,
    "52040000",
    "5303986",
    `54${String(valorFormatado.length).padStart(2, "0")}${valorFormatado}`, // pega o tamanho do valor, tranforma em string e caso seja menor que 10, ele coloca um 0 na frente, no caso de 100.00 que é 6, firacaria 06
    "5802BR",
    `59${String(nomeFormatado.length).padStart(2, "0")}${nomeFormatado}`,
    `60${String(cidadeFormatada.length).padStart(2, "0")}${cidadeFormatada}`,
    tag62,
  ];

  const payload = payloadArray.join("");
  const payloadParaCRC = payload + "6304";
  const crc = calcularCRC(payloadParaCRC);
  const payloadFinal = payloadParaCRC + crc;

  console.log("Payload final:", payloadFinal);

  return payloadFinal;
};

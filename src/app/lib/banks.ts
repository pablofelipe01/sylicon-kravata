export const colombianBanks = [
  { code: "1040", name: "BANCO AGRARIO" },
  { code: "1052", name: "BANCO AV VILLAS" },
  { code: "1013", name: "BANCO BBVA COLOMBIA S.A." },
  { code: "1032", name: "BANCO CAJA SOCIAL" },
  { code: "1019", name: "BANCO COLPATRIA" },
  { code: "1066", name: "BANCO COOPERATIVO COOPCENTRAL" },
  { code: "1006", name: "BANCO CORPBANCA S.A" },
  { code: "1051", name: "BANCO DAVIVIENDA" },
  { code: "1001", name: "BANCO DE BOGOTA" },
  { code: "1023", name: "BANCO DE OCCIDENTE" },
  { code: "1062", name: "BANCO FALABELLA" },
  { code: "1012", name: "BANCO GNB SUDAMERIS" },
  { code: "1060", name: "BANCO PICHINCHA S.A." },
  { code: "1002", name: "BANCO POPULAR" },
  { code: "1058", name: "BANCO PROCREDIT" },
  { code: "1065", name: "BANCO SANTANDER COLOMBIA" },
  { code: "1069", name: "BANCO SERFINANZA" },
  { code: "1035", name: "BANCO TEQUENDAMA" },
  { code: "1004", name: "BANCO UNION COLOMBIANO" },
  { code: "1022", name: "BANCO WWB" },
  { code: "1007", name: "BANCOLOMBIA" },
  { code: "1061", name: "BANCOOMEVA S.A." },
  { code: "1283", name: "COOPERATIVA FINANCIERA DE ANTIOQUIA" },
  { code: "1370", name: "COLTEFINANCIERA" },
  { code: "1292", name: "CONFIAR COOPERATIVA FINANCIERA" },
  { code: "1291", name: "COOFINEP COOPERATIVA FINANCIERA" },
  { code: "1289", name: "COTRAFA" },
  { code: "1097", name: "DALE" },
  { code: "1121", name: "FINANCIERA JURISCOOP S.A." },
  { code: "1303", name: "GIROS Y FINANZAS COMPAÑIA DE FINANCIAMIENTO S.A." },
  { code: "1637", name: "IRIS" },
  { code: "1801", name: "MOVII S.A." },
  { code: "1507", name: "NEQUI" },
  { code: "1151", name: "RAPPIPAY" },
  { code: "1811", name: "UALA" }
];

export const getBankByCode = (code: string) => {
  return colombianBanks.find(bank => bank.code === code);
};

export const getBankByName = (name: string) => {
  return colombianBanks.find(bank => bank.name === name);
};
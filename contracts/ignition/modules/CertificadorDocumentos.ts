import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CertificadorDocumentosModule", (m) => {
  const certificador = m.contract("CertificadorDocumentos");
  return { certificador };
});
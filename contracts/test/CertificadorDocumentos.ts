import { expect } from "chai";
import hre from "hardhat";
import type { ContractFactory } from "ethers";

describe("CertificadorDocumentos", function () {
  async function deploy() {
    const connection = await hre.network.connect();
    const ethers = connection.ethers;
    const [owner, otherAccount] = await ethers.getSigners();
    const Cert: ContractFactory = await ethers.getContractFactory("CertificadorDocumentos");
    const cert = await Cert.deploy() as any;
    await cert.waitForDeployment();
    return { cert, owner, otherAccount, ethers };
  }

  describe("certificar", function () {
    it("Debe certificar un documento nuevo", async function () {
      const { cert, owner } = await deploy();
      const hash = "abc123";
      const desc = "Contrato de prueba";

      await cert.certificar(hash, desc);
      const [existe, descripcion, certificadoPor] = await cert.verificar(hash);

      expect(existe).to.equal(true);
      expect(descripcion).to.equal(desc);
      expect(certificadoPor).to.equal(owner.address);
    });

    it("Debe rechazar un documento duplicado", async function () {
      const { cert } = await deploy();
      const hash = "abc123";

      await cert.certificar(hash, "Primera vez");
      await expect(
        cert.certificar(hash, "Segunda vez")
      ).to.be.revertedWith("Documento ya certificado");
    });
  });

  describe("verificar", function () {
    it("Debe retornar false para un hash inexistente", async function () {
      const { cert } = await deploy();
      const [existe] = await cert.verificar("hash_inexistente");
      expect(existe).to.equal(false);
    });

    it("Debe retornar los datos correctos para un hash existente", async function () {
      const { cert } = await deploy();
      const hash = "doc_test_456";
      const desc = "Acta de reunión";

      await cert.certificar(hash, desc);
      const [existe, descripcion, , timestamp] = await cert.verificar(hash);

      expect(existe).to.equal(true);
      expect(descripcion).to.equal(desc);
      expect(timestamp).to.be.gt(0);
    });
  });
});
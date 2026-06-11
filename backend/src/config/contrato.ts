import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const ABI = [
  "function certificar(string memory hashDoc, string memory descripcion) public",
  "function verificar(string memory hashDoc) public view returns (bool existe, string memory descripcion, address certificadoPor, uint256 timestamp)",
];

const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL);
const wallet = new ethers.Wallet(process.env.AMOY_PRIVATE_KEY!, provider);

export const contrato = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  ABI,
  wallet
);
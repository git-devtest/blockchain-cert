// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificadorDocumentos {

    struct Certificacion {
        string hashDocumento;
        string descripcion;
        address certificadoPor;
        uint256 timestamp;
    }

    mapping(string => Certificacion) private certificaciones;

    event DocumentoCertificado(
        string hashDocumento,
        string descripcion,
        address indexed certificadoPor,
        uint256 timestamp
    );

    function certificar(string memory hashDoc, string memory descripcion) public {
        require(
            bytes(certificaciones[hashDoc].hashDocumento).length == 0,
            "Documento ya certificado"
        );

        certificaciones[hashDoc] = Certificacion({
            hashDocumento: hashDoc,
            descripcion: descripcion,
            certificadoPor: msg.sender,
            timestamp: block.timestamp
        });

        emit DocumentoCertificado(hashDoc, descripcion, msg.sender, block.timestamp);
    }

    function verificar(string memory hashDoc) public view
        returns (
            bool existe,
            string memory descripcion,
            address certificadoPor,
            uint256 timestamp
        )
    {
        Certificacion memory c = certificaciones[hashDoc];

        if (bytes(c.hashDocumento).length == 0) {
            return (false, "", address(0), 0);
        }

        return (true, c.descripcion, c.certificadoPor, c.timestamp);
    }
}
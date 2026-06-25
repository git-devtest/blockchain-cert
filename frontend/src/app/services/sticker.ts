import { Injectable } from '@angular/core';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';

export interface DatosSticker {
  hash: string;
  descripcion: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})

export class StickerService {
    async generar(datos: DatosSticker): Promise<void> {

        const verUrl = `http://localhost:4200/verificar/${datos.hash}`;
        const qrDataUrl = await QRCode.toDataURL(verUrl, { width: 200, margin: 1 });

        const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [100, 60]
        });

        // Fondo
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 100, 60, 'F');

        // Borde verde
        doc.setDrawColor(15, 110, 86);
        doc.setLineWidth(0.8);
        doc.rect(2, 2, 96, 56);

        // Logo y título
        //doc.setFontSize(11);
        //doc.setFont('helvetica', 'bold');
        //doc.setTextColor(15, 110, 86);
        //doc.text('BLOCKCHAIN CERT', 6, 10);

        // Logo (Icono de bloque/blockchain) y título
        doc.setFillColor(15, 110, 86);
        // Dibuja un pequeño cuadrado redondeado como nodo
        doc.roundedRect(6, 6.5, 4, 4, 1, 1, 'F'); 
        // Un punto blanco en el centro del nodo
        doc.setFillColor(255, 255, 255);
        doc.circle(8, 8.5, 0.6, 'F');

        // Título (Desplazado a la derecha para dar espacio al icono)
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 110, 86);
        doc.text('Blockchain Cert', 12, 9.5); // X cambió de 6 a 12

        // Línea separadora
        doc.setDrawColor(15, 110, 86);
        doc.setLineWidth(0.3);
        doc.line(6, 13, 94, 13);

        // Descripción
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        doc.text('Documento:', 6, 20);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(datos.descripcion, 55);
        doc.text(descLines, 6, 25);

        // Fecha
        const fecha = new Date(datos.createdAt).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric'
        });
        doc.setFont('helvetica', 'bold');
        doc.text('Certificado:', 6, 35);
        doc.setFont('helvetica', 'normal');
        doc.text(fecha, 6, 40);

        // Hash acortado
        doc.setFont('helvetica', 'bold');
        doc.text('SHA-256:', 6, 47);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(`${datos.hash.slice(0, 20)}...${datos.hash.slice(-8)}`, 6, 51);

        // QR
        doc.addImage(qrDataUrl, 'PNG', 68, 15, 28, 28);

        // Texto bajo QR
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text('Escanea para verificar', 68, 46);
        doc.text('la autenticidad', 72, 49);

        doc.save(`sticker-${datos.hash.slice(0, 8)}.pdf`);
    }
}
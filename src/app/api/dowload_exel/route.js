import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { db } from "@/libs/db/connect";

export const GET = async () => {
    try {
        // Buat workbook dan worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Daftar Hadir');

        // Tambahkan header dengan border dan warna
        worksheet.columns = [
            { header: 'No', key: 'no', width: 7 },
            { header: 'Nama', key: 'nama', width: 30 },
            { header: 'Kelas', key: 'kelas', width: 20 },
            { header: 'Asal Sekolah', key: 'asal_sekolah', width: 30 },
            { header: 'Alamat', key: 'alamat', width: 40 },
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            // Tambahkan style header
            cell.font = { bold: true, color: { argb: 'FFFFFF' } }; // Teks putih
            cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Pusatkan teks
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '0070C0' }, // Warna biru
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Query data dari database
        const [rows] = await db.query("SELECT nama, kelas, asal_sekolah, alamat FROM daftar_hadir");

        // Tambahkan data ke worksheet dengan border
        rows.forEach((item, index) => {
            const row = worksheet.addRow({
                no: index + 1,
                nama: item.nama,
                kelas: item.kelas,
                asal_sekolah: item.asal_sekolah,
                alamat: item.alamat,
            });

            // Tambahkan border pada setiap sel
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        // Set buffer untuk file Excel
        const buffer = await workbook.xlsx.writeBuffer();

        // Kembalikan file Excel sebagai response
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="DaftarHadir.xlsx"',
            },
        });
    } catch (error) {
        console.error('Error generating Excel:', error);
        return NextResponse.json(
            { message: 'Gagal membuat file Excel' },
            { status: 500 }
        );
    }
};

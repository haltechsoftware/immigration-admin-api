import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { format } from 'date-fns';

@Injectable()
export class ReportDepartureService {
  async exportDepartureReport(
    data: any[],
    dateFrom: string,
    dateTo: string,
    res: Response,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Departure Register');

    // Title
    worksheet.mergeCells('A1:L1');
    worksheet.getCell('A1').value = 'Departure Register';
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 14 };

    // Date range
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').value = `${
      isNaN(from.getTime()) ? '' : format(from, 'dd/MM/yyyy')
    } - ${isNaN(to.getTime()) ? '' : format(to, 'dd/MM/yyyy')}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };
    worksheet.getCell('A2').font = { italic: true, size: 14 };

    // Header row
    const header = [
      'No',
      'Date Submit',
      'Departure Date',
      'Check Point',
      'Name',
      'Family Name',
      'Gender',
      'Date of Birth',
      'Nationality',
      'Phone Number',
      'Passport',
      'Verification Code',
    ];
    worksheet.addRow([]);
    worksheet.addRow(header);

    // Style header
    const headerRow = worksheet.getRow(4); // header in row 4
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    const totalColumns = 12;
    // Add data
    data.forEach((item, index) => {
      const row = worksheet.addRow([
        index + 1,
        item.created_at,
        item.check_in_date,
        item.departure_name,
        item.personal_information.name,
        item.personal_information.family_name,
        item.personal_information.gender,
        item.personal_information.date_of_birth,
        item.personal_information.nationality,
        item.personal_information.phone_number,
        item.passport_information.number,
        item.verification_code,
      ]);

      for (let i = 1; i <= totalColumns; i++) {
        const cell = row.getCell(i);

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // กำหนด alignment
        cell.alignment = {
          vertical: 'middle',
          horizontal: i === 1 ? 'center' : 'left',
        };
      }
    });

    // Adjust column width
    worksheet.getColumn(1).width = 8; // column A
    worksheet.getColumn(2).width = 20; // column B
    worksheet.getColumn(3).width = 15; // column C
    worksheet.getColumn(4).width = 18; // column D
    worksheet.getColumn(5).width = 18; // column E
    worksheet.getColumn(6).width = 18; // column F
    worksheet.getColumn(7).width = 10; // column G
    worksheet.getColumn(8).width = 15; // column H
    worksheet.getColumn(9).width = 15; // column I
    worksheet.getColumn(10).width = 20; // column J
    worksheet.getColumn(11).width = 25; // column K
    worksheet.getColumn(12).width = 16; // column L

    // Set response header
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=departure-report.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}

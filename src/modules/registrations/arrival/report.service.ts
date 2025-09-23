import { count } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { format } from 'date-fns';

@Injectable()
export class ReportArrivalService {
  async exportArrivalReport(
    data: any[],
    dateFrom: string,
    dateTo: string,
    res: Response,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Arrival Register');

    // Title
    worksheet.mergeCells('A1:N1');
    worksheet.getCell('A1').value = 'Arrival Register';
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 14 };

    // Date range
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    worksheet.mergeCells('A2:N2');
    worksheet.getCell('A2').value = `${
      isNaN(from.getTime()) ? '' : format(from, 'dd/MM/yyyy')
    } - ${isNaN(to.getTime()) ? '' : format(to, 'dd/MM/yyyy')}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };
    worksheet.getCell('A2').font = { italic: true, size: 14 };

    // Header row
    const header = [
      'No',
      'Date Submit',
      'Arrival Date',
      'Check Point',
      'Name',
      'Family Name',
      'Gender',
      'Date of Birth',
      'Nationality',
      'Phone Number',
      'Passport',
      'Travelling By',
      'Verification Code',
      'Visa',
      // 'Country',
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

    const totalColumns = 14;
    // Add data
    data.forEach((item, index) => {
      const row = worksheet.addRow([
        index + 1,
        item.created_at,
        item.check_in_date,
        item.entry_name,
        item.personal_information.name,
        item.personal_information.family_name,
        item.personal_information.gender,
        item.personal_information.date_of_birth,
        item.personal_information.nationality,
        item.personal_information.phone_number,
        item.passport_information.number,
        item.traveling_by_type,
        item.verification_code,
        item.visa_information?.number,
        // item.country.name,
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
    worksheet.getColumn(4).width = 22; // column D
    worksheet.getColumn(5).width = 18; // column E
    worksheet.getColumn(6).width = 18; // column F
    worksheet.getColumn(7).width = 8; // column G
    worksheet.getColumn(8).width = 15; // column H
    worksheet.getColumn(9).width = 15; // column I
    worksheet.getColumn(10).width = 18; // column J
    worksheet.getColumn(11).width = 24; // column K
    worksheet.getColumn(12).width = 15; // column L
    worksheet.getColumn(13).width = 16; // column M
    worksheet.getColumn(14).width = 18; // column N

    // Set response header
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=arrival-report.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}

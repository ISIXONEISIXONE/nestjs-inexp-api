import { Injectable } from '@nestjs/common';
import { ReportType, data } from 'src/data';
import { v4 as uuid } from 'uuid';
import { ReportResponseDto } from 'src/dtos/report.dto';
import { report } from 'process';

interface ReportData {
  amount?: number;
  source?: string;
}

@Injectable()
export class ReportService {
  getAllReports(type: ReportType): ReportResponseDto[] {
    return data.report
      .filter((report) => report.type === type)
      .map((report) => new ReportResponseDto(report));
  }

  getReportById(type: ReportType, id: string): ReportResponseDto {
    const report = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);

    if (!report) return;

    return new ReportResponseDto(report);
  }

  createReport(
    type: ReportType,
    { amount, source }: ReportData,
  ): ReportResponseDto {
    const newReport = {
      id: uuid(),
      source,
      amount,
      createdAt: new Date(),
      updatedAt: new Date(),
      type,
    };
    data.report.push(newReport);
    return new ReportResponseDto(newReport);
  }

  updateReport(
    type: ReportType,
    id: string,
    body: ReportData,
  ): ReportResponseDto {
    const reportToUpdate = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);

    if (!reportToUpdate) return;
    const updatedReportIndex = data.report.findIndex(
      (report) => report === reportToUpdate,
    );

    const updatedReport = (data.report[updatedReportIndex] = {
      ...data.report[updatedReportIndex],
      ...body,
      updatedAt: new Date(),
    });
    return new ReportResponseDto(updatedReport);
  }

  deleteReport(id: string) {
    const reportArr = data.report;
    const indexToDelete = reportArr.findIndex((report) => report.id === id);

    if (indexToDelete !== -1) {
      reportArr.splice(indexToDelete, 1);
      return reportArr;
    } else {
      return 'Oops, report not found';
    }
  }
}

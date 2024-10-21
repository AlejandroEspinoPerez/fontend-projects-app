// src/app/reports/reports.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ReportsService {
    constructor(private http: HttpClient) { }

    generateReport(reportType: string) {
        return this.http.get(`http://localhost:3000/reports/${reportType}`, { responseType: 'blob' });
    }
}

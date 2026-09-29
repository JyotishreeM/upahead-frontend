import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AttendanceResponse {
  totalAttendance: number;
  todayPresent: boolean;
}


@Injectable({ providedIn: 'root' })
export class AttendanceService {
   private readonly http = inject(HttpClient);

  getMyAttendance(): Observable<AttendanceResponse> {
    return this.http.get<AttendanceResponse>(
      `${environment.apiUrl}/api/attendance/me`
    );
  }

}

import { Component, inject } from '@angular/core';
import { AuthServiceService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';
import { HeaderComponent } from "../../../shared/header/header.component";

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './guest-dashboard.component.html',
  styleUrl: './guest-dashboard.component.scss'
})
export class GuestDashboardComponent {
  private readonly user = inject(AuthServiceService).getUser();
  readonly attendanceDays = this.user
    ? inject(AttendanceService).getDays(this.user.userId)
    : null;
  readonly attendanceLabel = this.attendanceDays === null
    ? 'Unavailable'
    : `${this.attendanceDays} ${this.attendanceDays === 1 ? 'day' : 'days'}`;
    student = {
    name: this.user?.userName || 'Student'
  };

  summaryCards = [
    {
      title: 'My Courses',
      value: 5,
      icon: '🎓',
    },
    {
      title: 'Attendance',
      value: this.attendanceLabel,
      icon: '📊'
    },
    {
      title: 'Pending Assignments',
      value: 3,
      icon: '📝'
    },
    {
      title: 'Upcoming Exams',
      value: 2,
      icon: '🧪'
    }
  ];

  upcomingAssignments = [
    {
      title: 'Angular Assignment',
      subject: 'Angular',
      dueDate: '30 Aug 2026',
      status: 'Pending'
    },
    {
      title: 'Java REST API',
      subject: 'Java',
      dueDate: '02 Sep 2026',
      status: 'Pending'
    },
    {
      title: 'MySQL Database Design',
      subject: 'Database',
      dueDate: '05 Sep 2026',
      status: 'Pending'
    }
  ];

  todayClasses = [
    {
      time: '10:00 AM',
      subject: 'Angular',
      room: 'Lab 2'
    },
    {
      time: '12:00 PM',
      subject: 'Java',
      room: 'Room 301'
    },
    {
      time: '03:00 PM',
      subject: 'Database',
      room: 'Room 204'
    }
  ];

}

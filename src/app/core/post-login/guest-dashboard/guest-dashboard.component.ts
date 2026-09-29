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
    private readonly authService = inject(AuthServiceService);
  private readonly attendanceService = inject(AttendanceService);

  private readonly user = this.authService.getUser();

  student = {
    name: this.user?.userName || 'Student'
  };

  attendanceLabel = 'Loading...';
  todayPresent = false;

  summaryCards = [
    {
      title: 'My Courses',
      value: 5,
      icon: '🎓'
    },
    {
      title: 'Attendance',
      value: 'Loading...',
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



  ngOnInit(): void {
    this.loadAttendance();
  }

 loadAttendance(): void {
  this.attendanceService.getMyAttendance().subscribe({
    next: (response) => {
      this.todayPresent = response.todayPresent;

      const days = response.totalAttendance;

      this.attendanceLabel =
        `${days} ${days === 1 ? 'day' : 'days'}`;

      this.summaryCards = this.summaryCards.map(card =>
        card.title === 'Attendance'
          ? { ...card, value: this.attendanceLabel }
          : card
      );
    },

    error: (error) => {
      console.error('Unable to load attendance:', error);

      this.attendanceLabel = 'Unavailable';

      this.summaryCards = this.summaryCards.map(card =>
        card.title === 'Attendance'
          ? { ...card, value: this.attendanceLabel }
          : card
      );
    }
  });
}

}

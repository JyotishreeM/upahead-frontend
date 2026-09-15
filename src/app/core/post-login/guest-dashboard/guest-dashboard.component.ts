import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/header/header.component";

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './guest-dashboard.component.html',
  styleUrl: './guest-dashboard.component.scss'
})
export class GuestDashboardComponent {
    student = {
    name: 'Jyotishree'
  };

  summaryCards = [
    {
      title: 'My Courses',
      value: 5,
      icon: '🎓',
    },
    {
      title: 'Attendance',
      value: '86%',
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

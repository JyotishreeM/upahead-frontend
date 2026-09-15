import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [  RouterLink,
    RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    menuItems = [
    {
      label: 'Dashboard',
      icon: '🏠',
      route: '/dashboard'
    },
    {
      label: 'Profile',
      icon: '👤',
      route: '/profile'
    },
    {
      label: 'Study Planner',
      icon: '🧭',
      route: '/study-planner'
    },
    {
      label: 'Courses',
      icon: '🎓',
      route: '/courses'
    },

    {
      label: 'Assignments',
      icon: '📝',
      route: '/assignments'
    },
    {
      label: 'Timetable',
      icon: '📅',
      route: '/timetable'
    },
    {
      label: 'Attendance',
      icon: '📊',
      route: '/attendance'
    },
    {
      label: 'Exams',
      icon: '🧪',
      route: '/exams'
    },
    {
      label: 'Study Materials',
      icon: '📖',
      route: '/study-materials'
    },
    {
      label: 'My Tasks',
      icon: '✅',
      route: '/tasks'
    },
    {
      label: 'Notifications',
      icon: '🔔',
      route: '/notifications'
    },
    {
      label: 'Settings',
      icon: '⚙️',
      route: '/settings'
    }
  ];

}

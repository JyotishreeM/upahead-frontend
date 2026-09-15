import {
  Inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

export interface Course {
  id: number;
  name: string;
  category: string;
  description: string;
  progress: number;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CoarseService {



  private readonly COURSE_KEY = 'courses';

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) { }

  private isBrowser(): boolean {

    return isPlatformBrowser(this.platformId);

  }

  // Get all courses
  getCourses(): Course[] {
    if (!this.isBrowser()) {
      return [];
    }
    const courses = localStorage.getItem(this.COURSE_KEY);

    if (!courses) {
      return [];
    }

    return JSON.parse(courses);
  }


  // Add course
  addCourse(course: Course): void {
    if (!this.isBrowser()) {
      return;
    }
    const courses = this.getCourses();

    courses.push(course);

    localStorage.setItem(
      this.COURSE_KEY,
      JSON.stringify(courses)
    );
  }


  // Update course
  updateCourse(updatedCourse: Course): void {

    if (!this.isBrowser()) {
      return;
    }
    const courses = this.getCourses();

    const index = courses.findIndex(
      course => course.id === updatedCourse.id
    );

    if (index !== -1) {

      courses[index] = updatedCourse;

      localStorage.setItem(
        this.COURSE_KEY,
        JSON.stringify(courses)
      );

    }
  }


  // Delete course
  deleteCourse(courseId: number): void {
    if (!this.isBrowser()) {
      return;
    }

    const courses = this.getCourses();

    const updatedCourses = courses.filter(
      course => course.id !== courseId
    );

    localStorage.setItem(
      this.COURSE_KEY,
      JSON.stringify(updatedCourses)
    );
  }

  // Clear all courses
  clearCourses(): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(this.COURSE_KEY);

  }

}

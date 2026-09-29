import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CoarseService, Course } from '../../services/coarse.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent implements OnInit {

  courseForm!: FormGroup;

  courses: Course[] = [];

  isAddMode = false;
  isEditMode = false;
  isLoading = false;

  editingCourseId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CoarseService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadCourse();
  }

  private buildForm(): void {

    this.courseForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      category: [
        '',
        Validators.required
      ],

      description: [
        ''
      ]

    });

  }

  loadCourse() {
    this.courses = this.courseService.getCourses();
  }

  getControl(controlName: string) {
    return this.courseForm.get(controlName);
  }


  // =========================
  // ADD COURSE
  // =========================

  openAddCourse(): void {

    this.isAddMode = true;
    this.isEditMode = false;
    this.editingCourseId = null;

    this.courseForm.reset();

  }


  // =========================
  // EDIT COURSE
  // =========================

  editCourse(course: Course): void {

    this.isAddMode = true;
    this.isEditMode = true;

    this.editingCourseId = course.id;

    this.courseForm.patchValue({

      name: course.name,

      category: course.category,

      description: course.description

    });

  }


  // =========================
  // CANCEL
  // =========================

  cancelForm(): void {

    this.isAddMode = false;
    this.isEditMode = false;

    this.editingCourseId = null;

    this.courseForm.reset();

  }


  // =========================
  // SAVE COURSE
  // =========================


  saveCourse(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (
      this.isEditMode &&
      this.editingCourseId !== null
    ) {
      const existingCourse = this.courses.find(
        course => course.id === this.editingCourseId
      );

      if (existingCourse) {
        const updatedCourse: Course = {
          ...existingCourse,
          name: this.courseForm.value.name,
          category: this.courseForm.value.category,
          description: this.courseForm.value.description
        };

        this.courseService.updateCourse(updatedCourse);
      }
    } else {
      const newCourse: Course = {
        id: Date.now(),
        name: this.courseForm.value.name,
        category: this.courseForm.value.category,
        description: this.courseForm.value.description,
        progress: 0,
        completed: false
      };
      this.courseService.addCourse(newCourse);
    }
    setTimeout(() => {
      this.loadCourse();
      this.isLoading = false;
      this.cancelForm();
    }, 500);
  }
  // =========================
  // DELETE COURSE
  // =========================

  deleteCourse(courseId: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this course?'
    );
    if (!confirmed) {
      return;
    }
    this.courseService.deleteCourse(courseId);
    this.loadCourse();
  }


  // =========================
  // UPDATE PROGRESS
  // =========================

  updateProgress(
    course: Course,
    event: Event
  ): void {
    const input = event.target as HTMLInputElement;
    let progress = Number(input.value);
    if (progress < 0) {
      progress = 0;
    }
    if (progress > 100) {
      progress = 100;
    }
    course.progress = progress;
    course.completed = progress === 100;
    this.courseService.updateCourse(course);

  }


  // =========================
  // TOGGLE COMPLETED
  // =========================

  toggleCompleted(course: Course): void {
    course.completed = !course.completed;
    if (course.completed) {
      course.progress = 100;
    }
    this.courseService.updateCourse(course);
  }

}

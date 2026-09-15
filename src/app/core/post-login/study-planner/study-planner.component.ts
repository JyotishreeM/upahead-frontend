import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

interface StudyTask {
  id: number;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

@Component({
  selector: 'app-study-planner',
  standalone: true,
  imports: [   CommonModule,
    ReactiveFormsModule],
  templateUrl: './study-planner.component.html',
  styleUrl: './study-planner.component.scss'
})
export class StudyPlannerComponent {
   studyForm!: FormGroup;

  tasks: StudyTask[] = [];

  isAddMode = false;

  isLoading = false;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {

    this.studyForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      subject: [
        '',
        Validators.required
      ],

      description: [
        ''
      ],

      dueDate: [
        '',
        Validators.required
      ],

      priority: [
        'Medium',
        Validators.required
      ]

    });

  }

  getControl(controlName: string) {
    return this.studyForm.get(controlName);
  }

  openAddTask(): void {

    this.isAddMode = true;

    this.studyForm.reset({
      priority: 'Medium'
    });

  }

  cancelAdd(): void {

    this.isAddMode = false;

    this.studyForm.reset({
      priority: 'Medium'
    });

  }

  saveTask(): void {

    if (this.studyForm.invalid) {

      this.studyForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const task: StudyTask = {

      id: Date.now(),

      title: this.studyForm.value.title,

      subject: this.studyForm.value.subject,

      description: this.studyForm.value.description,

      dueDate: this.studyForm.value.dueDate,

      priority: this.studyForm.value.priority,

      completed: false

    };

    this.tasks.push(task);

    setTimeout(() => {

      this.isLoading = false;

      this.isAddMode = false;

      this.studyForm.reset({
        priority: 'Medium'
      });

      console.log('Task added successfully');

    }, 500);

  }

  toggleTask(task: StudyTask): void {

    task.completed = !task.completed;

  }

  deleteTask(taskId: number): void {

    this.tasks = this.tasks.filter(
      task => task.id !== taskId
    );

  }
}

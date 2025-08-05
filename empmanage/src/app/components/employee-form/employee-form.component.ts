import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, EmployeeViewModel, EditEmployeeViewModel } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: Employee | null = null;
  @Input() isEditMode = false;
  @Input() existingEmployees: Employee[] = []; // Add this input for duplicate checking
  @Output() saveEmployee = new EventEmitter<EmployeeViewModel | EditEmployeeViewModel>();
  @Output() cancel = new EventEmitter<void>();

  employeeForm!: FormGroup;
  duplicateErrors: { [key: string]: string } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    
    // Check for duplicates after a short delay to ensure existingEmployees is loaded
    setTimeout(() => {
      this.checkDuplicates();
    }, 100);
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      empName: ['', [Validators.required, Validators.minLength(2)]],
      empEmail: ['', [Validators.required, Validators.email]],
      empAddress: ['', [Validators.required, Validators.minLength(5)]],
      empPhone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]]
    });

    if (this.employee && this.isEditMode) {
      this.employeeForm.patchValue({
        empName: this.employee.empName,
        empEmail: this.employee.empEmail,
        empAddress: this.employee.empAddress,
        empPhone: this.employee.empPhone
      });
    }

    // Add real-time duplicate checking
    this.employeeForm.valueChanges.subscribe(() => {
      this.checkDuplicates();
    });
  }

  private checkDuplicates(): void {
    this.duplicateErrors = {};
    const formValue = this.employeeForm.value;
    
    if (!formValue.empName && !formValue.empEmail && !formValue.empPhone) {
      return;
    }

    const currentEmployeeId = this.employee?.empId;

    // Check email duplicates
    if (formValue.empEmail && this.existingEmployees.length > 0) {
      const emailExists = this.existingEmployees.some(emp => 
        emp.empEmail.toLowerCase() === formValue.empEmail.toLowerCase() && 
        emp.empId !== currentEmployeeId
      );
      if (emailExists) {
        this.duplicateErrors['empEmail'] = 'This email is already registered';
      }
    }

    // Check phone duplicates
    if (formValue.empPhone && this.existingEmployees.length > 0) {
      const phoneExists = this.existingEmployees.some(emp => 
        emp.empPhone === formValue.empPhone && 
        emp.empId !== currentEmployeeId
      );
      if (phoneExists) {
        this.duplicateErrors['empPhone'] = 'This phone number is already registered';
      }
    }

    // Check name duplicates (optional)
    if (formValue.empName && this.existingEmployees.length > 0) {
      const nameExists = this.existingEmployees.some(emp => 
        emp.empName.toLowerCase() === formValue.empName.toLowerCase() && 
        emp.empId !== currentEmployeeId
      );
      if (nameExists) {
        this.duplicateErrors['empName'] = 'This name is already registered';
      }
    }

    // Force change detection
    this.employeeForm.updateValueAndValidity();
  }

  onSubmit(): void {
    // Check for duplicates before submitting
    this.checkDuplicates();
    
    if (this.employeeForm.valid && Object.keys(this.duplicateErrors).length === 0) {
      const formValue = this.employeeForm.value;
      
      if (this.isEditMode && this.employee?.empId) {
        const editEmployee: EditEmployeeViewModel = {
          empId: this.employee.empId,
          ...formValue
        };
        this.saveEmployee.emit(editEmployee);
      } else {
        const newEmployee: EmployeeViewModel = formValue;
        this.saveEmployee.emit(newEmployee);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.employeeForm.controls).forEach(key => {
        const control = this.employeeForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getErrorMessage(controlName: string): string {
    const control = this.employeeForm.get(controlName);
    
    // Check for duplicate errors first
    if (this.duplicateErrors[controlName]) {
      return this.duplicateErrors[controlName];
    }
    
    if (control?.errors) {
      if (control.errors['required']) {
        return `${controlName} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${controlName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return (control?.invalid && control?.touched) || !!this.duplicateErrors[controlName];
  }

  hasDuplicateError(controlName: string): boolean {
    return !!this.duplicateErrors[controlName];
  }

  // Add method to check if form has any duplicate errors
  hasAnyDuplicateErrors(): boolean {
    return Object.keys(this.duplicateErrors).length > 0;
  }
} 
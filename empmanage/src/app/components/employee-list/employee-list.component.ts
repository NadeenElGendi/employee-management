import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeViewModel, EditEmployeeViewModel } from '../../models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeFormComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  loading = false;
  error = '';
  showForm = false;
  editingEmployee: Employee | null = null;
  isEditMode = false;

  // Search and filter properties
  searchTerm = '';
  sortOrder: 'newest' | 'oldest' = 'newest';

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;
  paginatedEmployees: Employee[] = [];

  // Delete popup properties
  showDeletePopup = false;
  employeeToDelete: Employee | null = null;

  // Math functions for template
  Math = Math;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
    
    // Add keyboard listener for ESC key only in browser
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  ngOnDestroy(): void {
    // Remove keyboard listener only in browser
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showDeletePopup) {
      this.closeDeletePopup();
    }
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';
    
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load employees. Please try again.';
        this.loading = false;
        console.error('Error loading employees:', error);
      }
    });
  }

  // Check for duplicate data
  checkForDuplicates(employeeData: EmployeeViewModel | EditEmployeeViewModel): { isDuplicate: boolean; duplicateFields: string[] } {
    const duplicateFields: string[] = [];
    const isEditMode = 'empId' in employeeData;
    const currentEmployeeId = isEditMode ? (employeeData as EditEmployeeViewModel).empId : null;

    // Check email duplicates
    const emailExists = this.employees.some(emp => 
      emp.empEmail.toLowerCase() === employeeData.empEmail.toLowerCase() && 
      (!isEditMode || emp.empId !== currentEmployeeId)
    );
    if (emailExists) {
      duplicateFields.push('Email');
    }

    // Check phone duplicates
    const phoneExists = this.employees.some(emp => 
      emp.empPhone === employeeData.empPhone && 
      (!isEditMode || emp.empId !== currentEmployeeId)
    );
    if (phoneExists) {
      duplicateFields.push('Phone');
    }

    // Check name duplicates (optional - you can remove this if names can be duplicated)
    const nameExists = this.employees.some(emp => 
      emp.empName.toLowerCase() === employeeData.empName.toLowerCase() && 
      (!isEditMode || emp.empId !== currentEmployeeId)
    );
    if (nameExists) {
      duplicateFields.push('Name');
    }

    return {
      isDuplicate: duplicateFields.length > 0,
      duplicateFields
    };
  }

  // Search and filter methods
  applyFilters(): void {
    let filtered = [...this.employees];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(employee => 
        employee.empName.toLowerCase().includes(searchLower) ||
        employee.empEmail.toLowerCase().includes(searchLower) ||
        employee.empAddress.toLowerCase().includes(searchLower) ||
        employee.empPhone.toLowerCase().includes(searchLower) ||
        employee.empId?.toString().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (this.sortOrder === 'newest') {
        return (b.empId || 0) - (a.empId || 0);
      } else {
        return (a.empId || 0) - (b.empId || 0);
      }
    });

    this.filteredEmployees = filtered;
    this.currentPage = 1; // Reset to first page when filtering
    this.calculatePagination();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.currentPage = Math.max(1, this.currentPage);
    this.updatePaginatedEmployees();
  }

  updatePaginatedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedEmployees();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  addEmployee(): void {
    this.editingEmployee = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  editEmployee(employee: Employee): void {
    this.editingEmployee = employee;
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteEmployee(employee: Employee): void {
    this.employeeToDelete = employee;
    this.showDeletePopup = true;
  }

  confirmDelete(): void {
    if (this.employeeToDelete) {
      const empId = this.employeeToDelete.empId!;
      this.employeeService.deleteEmployee(empId).subscribe({
        next: () => {
          this.employees = this.employees.filter(emp => emp.empId !== empId);
          this.applyFilters();
          this.closeDeletePopup();
        },
        error: (error) => {
          this.error = 'Failed to delete employee. Please try again.';
          console.error('Error deleting employee:', error);
          this.closeDeletePopup();
        }
      });
    }
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
    this.employeeToDelete = null;
  }

  onSaveEmployee(employeeData: EmployeeViewModel | EditEmployeeViewModel): void {
    if (this.isEditMode) {
      const editData = employeeData as EditEmployeeViewModel;
      this.employeeService.editEmployee(editData).subscribe({
        next: () => {
          this.loadEmployees();
          this.showForm = false;
          this.editingEmployee = null;
          this.isEditMode = false;
          this.error = ''; // Clear any previous errors
        },
        error: (error) => {
          this.error = 'Failed to update employee. Please try again.';
          console.error('Error updating employee:', error);
        }
      });
    } else {
      const newData = employeeData as EmployeeViewModel;
      this.employeeService.addEmployee(newData).subscribe({
        next: () => {
          this.loadEmployees();
          this.showForm = false;
          this.error = ''; // Clear any previous errors
        },
        error: (error) => {
          this.error = 'Failed to add employee. Please try again.';
          console.error('Error adding employee:', error);
        }
      });
    }
  }

  onCancelForm(): void {
    this.showForm = false;
    this.editingEmployee = null;
    this.isEditMode = false;
    this.error = ''; // Clear any previous errors
  }
}

export interface Employee {
  empId?: number;
  empName: string;
  empEmail: string;
  empAddress: string;
  empPhone: string;
}

export interface EmployeeViewModel {
  empName: string;
  empEmail: string;
  empAddress: string;
  empPhone: string;
}

export interface EditEmployeeViewModel {
  empId: number;
  empName: string;
  empEmail: string;
  empAddress: string;
  empPhone: string;
} 
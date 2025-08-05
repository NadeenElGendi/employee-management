import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Employee, EmployeeViewModel, EditEmployeeViewModel } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/Employees`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // ✅ Get all employees 
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get(`${this.apiUrl}/getAllEmployees`, {
      responseType: 'text', 
      headers: this.httpOptions.headers
    }).pipe(
      retry(1),
      map((res: string) => JSON.parse(res) as Employee[]), 
      catchError(this.handleError)
    );
  }

  getEmployeeById(empId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/getEmpByID/${empId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  addEmployee(employee: EmployeeViewModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/addEmployee`, employee, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  editEmployee(employee: EditEmployeeViewModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/editEmployee`, employee, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteEmployee(empId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/deleteEmpByID/${empId}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

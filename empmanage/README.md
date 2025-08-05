# Employee Management System

A modern Angular application for managing employee data with full CRUD operations.

## Features

- **View All Employees**: Display a list of all employees in a responsive table
- **Add New Employee**: Add new employees with form validation
- **Edit Employee**: Update existing employee information
- **Delete Employee**: Remove employees with confirmation
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and intuitive user interface

## API Endpoints

The application integrates with the following API endpoints:

- `GET /api/Employees/getAllEmployees` - Get all employees
- `GET /api/Employees/getEmpByID/{emp_id}` - Get employee by ID
- `POST /api/Employees/addEmployee` - Add new employee
- `POST /api/Employees/editEmployee` - Edit existing employee
- `GET /api/Employees/deleteEmpByID/{emp_id}` - Delete employee

## Technology Stack

- **Angular 19**: Latest version with standalone components
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming
- **Angular Forms**: Reactive forms with validation
- **Font Awesome**: Icons
- **SCSS**: Advanced styling

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Angular CLI (version 19 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd empmanage
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
ng build
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── employee-list/
│   │   │   ├── employee-list.component.ts
│   │   │   ├── employee-list.component.html
│   │   │   └── employee-list.component.scss
│   │   └── employee-form/
│   │       ├── employee-form.component.ts
│   │       ├── employee-form.component.html
│   │       └── employee-form.component.scss
│   ├── models/
│   │   └── employee.model.ts
│   ├── services/
│   │   └── employee.service.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.routes.ts
│   └── app.config.ts
├── styles.scss
└── index.html
```

## Components

### EmployeeListComponent
- Main component for displaying the employee list
- Handles CRUD operations
- Manages form display and state

### EmployeeFormComponent
- Reusable form component for adding/editing employees
- Includes form validation
- Supports both create and edit modes



## Services

### EmployeeService
Handles all API communication for employee operations:
- `getAllEmployees()`: Fetch all employees
- `getEmployeeById(id)`: Get specific employee
- `addEmployee(employee)`: Add new employee
- `editEmployee(employee)`: Update employee
- `deleteEmployee(id)`: Delete employee

## Styling

The application uses SCSS for styling with:
- Responsive design
- Modern UI components
- Consistent color scheme
- Smooth animations and transitions

## Error Handling

- Network error handling
- Form validation errors
- User-friendly error messages
- Loading states

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style
- Follows Angular style guide
- TypeScript strict mode
- ESLint configuration
- Prettier formatting

### Testing
```bash
ng test
```

### Linting
```bash
ng lint
```

## License

This project is created for the SoftZone interview assignment.

## Contact

For any questions or issues, please contact the development team.

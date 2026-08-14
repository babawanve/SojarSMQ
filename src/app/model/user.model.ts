export interface User {
  UserName: string;
  FirstName: string;
  LastName: string;
  PhoneNo: string;
  Email: string;
  UserType: 'Quality' | 'Training' | 'Document';
  ManagerUserName: string;
  Designation: 'CEO' | 'IT Head' | 'IT Administrator';
  Department: 'General' | 'Information Technology' | 'Human Resource';
  TimeZone: string;
  Country: string;
  City: string;
  PrimaryLanguage: 'English' | 'Marathi' | 'Hindi';
  IsActive: boolean;
  EmployeeID: string;
  JoiningDate: string;
  IsLocked: boolean;
  UserDescription: string;
}

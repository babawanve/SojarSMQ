import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule],
  templateUrl: './user-management.html'
})
export class UserManagement {
  @ViewChild('addUserDialog') addUserDialog!: ElementRef<HTMLDialogElement>;

  users = [
    { UserName: 'jdoe', FirstName: 'John', LastName: 'Doe', Email: 'jdoe@qms.com', UserType: 'Quality', IsActive: true },
    { UserName: 'asmith', FirstName: 'Anna', LastName: 'Smith', Email: 'asmith@qms.com', UserType: 'Training', IsActive: true },
    { UserName: 'bwayne', FirstName: 'Bruce', LastName: 'Wayne', Email: 'bwayne@qms.com', UserType: 'Document', IsActive: false }
  ];

  openAddUserDialog() {
    this.addUserDialog.nativeElement.showModal();
  }

  closeAddUserDialog() {
    this.addUserDialog.nativeElement.close();
  }
}

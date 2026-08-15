import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

type UserSortColumn = 'UserName' | 'FirstName' | 'Email' | 'UserType' | 'IsActive';
type SortDirection = 'asc' | 'desc' | null;

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
  sortColumn: UserSortColumn | null = null;
  sortDirection: SortDirection = null;

  get sortedUsers() {
    if (!this.sortColumn || !this.sortDirection) return this.users;
    return [...this.users].sort((left, right) => {
      const leftValue = String(left[this.sortColumn!]).toLowerCase();
      const rightValue = String(right[this.sortColumn!]).toLowerCase();
      const result = leftValue.localeCompare(rightValue, undefined, { numeric: true });
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  sortBy(column: UserSortColumn) {
    if (this.sortColumn !== column) {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortColumn = null;
      this.sortDirection = null;
    }
  }

  sortIcon(column: UserSortColumn) {
    return this.sortColumn !== column || !this.sortDirection
      ? 'fa-sort'
      : this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  openAddUserDialog() {
    this.addUserDialog.nativeElement.showModal();
  }

  closeAddUserDialog() {
    this.addUserDialog.nativeElement.close();
  }
}

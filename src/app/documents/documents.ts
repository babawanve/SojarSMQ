import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentNode } from '../model/document-node.model';
import { DocumentService } from '../services/document.service';

type DocumentSortColumn = 'Id' | 'Type' | 'Name' | 'Status';
type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents {
  readonly rootFolderId = null;

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  sortColumn: DocumentSortColumn | null = null;
  sortDirection: SortDirection = null;
  constructor(
    private readonly documentService: DocumentService,
    private readonly router: Router
  ) {}

  get documents() {
    return this.documentService.listChildren(this.rootFolderId);
  }

  get filteredDocuments() {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = term
      ? this.documents.filter(document => [document.Id, document.Type, document.Name, document.Status]
        .some(value => value.toLowerCase().includes(term)))
      : this.documents;
    return this.sortDocuments(filtered);
  }

  sortBy(column: DocumentSortColumn) {
    if (this.sortColumn !== column) {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortColumn = null;
      this.sortDirection = null;
    }
    this.currentPage = 1;
  }

  sortIcon(column: DocumentSortColumn) {
    return this.sortColumn !== column || !this.sortDirection
      ? 'fa-sort'
      : this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  private sortDocuments(documents: DocumentNode[]) {
    if (!this.sortColumn || !this.sortDirection) return documents;
    return [...documents].sort((left, right) => {
      const leftValue = String(left[this.sortColumn!]).toLowerCase();
      const rightValue = String(right[this.sortColumn!]).toLowerCase();
      const result = leftValue.localeCompare(rightValue, undefined, { numeric: true });
      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  get pageCount() {
    return Math.max(1, Math.ceil(this.filteredDocuments.length / this.pageSize));
  }

  get visibleDocuments() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDocuments.slice(start, start + this.pageSize);
  }

  get firstRow() {
    return this.filteredDocuments.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get lastRow() {
    return Math.min(this.currentPage * this.pageSize, this.filteredDocuments.length);
  }

  onSearch() {
    this.currentPage = 1;
  }

  onPageSizeChange() {
    this.currentPage = 1;
  }

  previousPage() {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage() {
    this.currentPage = Math.min(this.pageCount, this.currentPage + 1);
  }

  editDocument(document: DocumentNode) {
    if (document.Type === 'File') {
      this.router.navigate(['/dashboard/documents/add', document.Id]);
      return;
    }
    this.router.navigate(['/dashboard/documents/add-folder', document.Id]);
  }

  deleteDocument(documentId: string) {
    this.documentService.remove(documentId);
    if (this.currentPage > this.pageCount) {
      this.currentPage = this.pageCount;
    }
  }

  refresh() {
    this.searchTerm = '';
    this.currentPage = 1;
  }

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DocumentNode } from '../model/document-node.model';
import { DocumentService } from '../services/document.service';

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
  constructor(
    private readonly documentService: DocumentService,
    private readonly router: Router
  ) {}

  get documents() {
    return this.documentService.listChildren(this.rootFolderId);
  }

  get filteredDocuments() {
    const term = this.searchTerm.trim().toLowerCase();
    return term
      ? this.documents.filter(document => [document.id, document.type, document.name, document.status]
        .some(value => value.toLowerCase().includes(term)))
      : this.documents;
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
    if (document.type === 'File') {
      this.router.navigate(['/dashboard/documents/add', document.id]);
      return;
    }
    this.router.navigate(['/dashboard/documents/add-folder', document.id]);
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

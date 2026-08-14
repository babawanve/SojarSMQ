import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { DocumentNode, DocumentNodeInput } from '../model/document-node.model';
import { DocumentService } from '../services/document.service';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, FormsModule, MatSlideToggleModule, RouterModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents {
  @ViewChild('folderDialog') folderDialog!: ElementRef<HTMLDialogElement>;
  readonly rootFolderId = null;
  editingDocumentId: string | null = null;
  recordType: 'Folder' | 'File' = 'Folder';
  documentTypeExpanded = false;

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  folderName = '';
  folderCode = '';
  documentTypes: string[] = [];
  folderDesignation = '';
  group = 'General';
  overrideDocumentNumber = false;
  manualDocumentNumber = false;
  manualVersion = false;
  cascadePrivilege = false;

  readonly documentTypeOptions = ['Annexure', 'Forms', 'HR Policy', 'IT Policy', 'IT SOP', 'User Manual'];
  readonly groupOptions = ['Belongs to Individual documents', 'Client specific documents', 'General'];

  constructor(private readonly documentService: DocumentService) {}

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

  toggleDocumentTypes() {
    this.documentTypeExpanded = !this.documentTypeExpanded;
  }

  toggleDocumentType(documentType: string) {
    this.documentTypes = this.documentTypes.includes(documentType)
      ? this.documentTypes.filter(type => type !== documentType)
      : [...this.documentTypes, documentType];
  }

  documentTypeSummary() {
    return this.documentTypes.length ? this.documentTypes.join(', ') : 'Select document types';
  }

  previousPage() {
    this.currentPage = Math.max(1, this.currentPage - 1);
  }

  nextPage() {
    this.currentPage = Math.min(this.pageCount, this.currentPage + 1);
  }

  editDocument(document: DocumentNode) {
    this.editingDocumentId = document.id;
    this.documentTypeExpanded = false;
    this.folderName = document.name;
    this.folderCode = document.id;
    this.documentTypes = [document.type];
    this.folderDesignation = document.designation;
    this.group = 'General';
    this.overrideDocumentNumber = false;
    this.manualDocumentNumber = false;
    this.manualVersion = false;
    this.cascadePrivilege = false;
    this.folderDialog.nativeElement.showModal();
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

  openFolderDialog() {
    this.editingDocumentId = null;
    this.recordType = 'Folder';
    this.documentTypeExpanded = false;
    this.folderName = '';
    this.folderCode = '';
    this.documentTypes = [];
    this.folderDesignation = '';
    this.group = 'General';
    this.overrideDocumentNumber = false;
    this.manualDocumentNumber = false;
    this.manualVersion = false;
    this.cascadePrivilege = false;
    this.folderDialog.nativeElement.showModal();
  }

  openFileDialog() {
    this.editingDocumentId = null;
    this.recordType = 'File';
    this.documentTypeExpanded = false;
    this.folderName = '';
    this.folderCode = '';
    this.documentTypes = [];
    this.folderDesignation = '';
    this.group = 'General';
    this.folderDialog.nativeElement.showModal();
  }

  closeFolderDialog() {
    this.folderDialog.nativeElement.close();
  }

  saveFolder() {
    const input: DocumentNodeInput = {
      parentId: this.rootFolderId,
      name: this.folderName || 'Untitled Folder',
      type: this.recordType,
      status: 'Draft',
      code: this.folderCode,
      documentTypes: this.documentTypes,
      designation: this.folderDesignation,
      group: this.group,
      overrideDocumentNumber: this.overrideDocumentNumber,
      manualDocumentNumber: this.manualDocumentNumber,
      manualVersion: this.manualVersion,
      cascadePrivilege: this.cascadePrivilege
    };
    if (this.editingDocumentId) this.documentService.update(this.editingDocumentId, input);
    else this.documentService.create(input);
    this.closeFolderDialog();
  }
}

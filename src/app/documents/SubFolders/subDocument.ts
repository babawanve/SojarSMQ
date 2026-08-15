import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentNode, DocumentNodeInput } from '../../model/document-node.model';
import { DocumentService } from '../../services/document.service';

type DocumentSortColumn = 'Id' | 'Type' | 'Name' | 'Status';
type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-sub-document',
  imports: [CommonModule, FormsModule, MatSlideToggleModule, RouterModule],
  templateUrl: './subDocument.html',
  styleUrl: './subDocument.css',
})
export class SubDocument implements OnInit {
  @ViewChild('folderDialog') folderDialog!: ElementRef<HTMLDialogElement>;
  folderId = '';
  currentFolder?: DocumentNode;
  editingDocumentId: string | null = null;
  documentTypeExpanded = false;
  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  sortColumn: DocumentSortColumn | null = null;
  sortDirection: SortDirection = null;
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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly documentService: DocumentService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.folderId = params.get('folderId') ?? '';
      this.currentFolder = this.documentService.findById(this.folderId);
      this.searchTerm = '';
      this.currentPage = 1;
    });
  }

  get documents() { return this.documentService.listChildren(this.folderId); }
  get breadcrumbs() { return this.documentService.breadcrumbs(this.folderId); }
  get filteredDocuments() {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = term ? this.documents.filter(document => [document.Id, document.Type, document.Name, document.Status]
      .some(value => value.toLowerCase().includes(term))) : this.documents;
    if (!this.sortColumn || !this.sortDirection) return filtered;
    return [...filtered].sort((left, right) => {
      const leftValue = String(left[this.sortColumn!]).toLowerCase();
      const rightValue = String(right[this.sortColumn!]).toLowerCase();
      const result = leftValue.localeCompare(rightValue, undefined, { numeric: true });
      return this.sortDirection === 'asc' ? result : -result;
    });
  }
  sortBy(column: DocumentSortColumn) { if (this.sortColumn !== column) { this.sortColumn = column; this.sortDirection = 'asc'; } else if (this.sortDirection === 'asc') this.sortDirection = 'desc'; else { this.sortColumn = null; this.sortDirection = null; } this.currentPage = 1; }
  sortIcon(column: DocumentSortColumn) { return this.sortColumn !== column || !this.sortDirection ? 'fa-sort' : this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down'; }
  get pageCount() { return Math.max(1, Math.ceil(this.filteredDocuments.length / this.pageSize)); }
  get visibleDocuments() { const start = (this.currentPage - 1) * this.pageSize; return this.filteredDocuments.slice(start, start + this.pageSize); }
  get firstRow() { return this.filteredDocuments.length ? (this.currentPage - 1) * this.pageSize + 1 : 0; }
  get lastRow() { return Math.min(this.currentPage * this.pageSize, this.filteredDocuments.length); }

  onSearch() { this.currentPage = 1; }
  onPageSizeChange() { this.currentPage = 1; }
  previousPage() { this.currentPage = Math.max(1, this.currentPage - 1); }
  nextPage() { this.currentPage = Math.min(this.pageCount, this.currentPage + 1); }
  refresh() { this.searchTerm = ''; this.currentPage = 1; }
  toggleDocumentTypes() { this.documentTypeExpanded = !this.documentTypeExpanded; }
  toggleDocumentType(type: string) { this.documentTypes = this.documentTypes.includes(type) ? this.documentTypes.filter(item => item !== type) : [...this.documentTypes, type]; }
  documentTypeSummary() { return this.documentTypes.length ? this.documentTypes.join(', ') : 'Select document types'; }

  editDocument(document: DocumentNode) {
    if (document.Type === 'File') {
      this.router.navigate(['/dashboard/documents/add', document.Id]);
      return;
    }
    this.editingDocumentId = document.Id;
    this.folderName = document.Name;
    this.folderCode = document.Code;
    this.documentTypes = document.DocumentTypes;
    this.folderDesignation = document.Designation;
    this.group = document.Group;
    this.overrideDocumentNumber = document.OverrideDocumentNumber;
    this.manualDocumentNumber = document.ManualDocumentNumber;
    this.manualVersion = document.ManualVersion;
    this.cascadePrivilege = document.CascadePrivilege;
    this.documentTypeExpanded = false;
    this.folderDialog.nativeElement.showModal();
  }

  deleteDocument(id: string) {
    this.documentService.remove(id);
    if (this.currentPage > this.pageCount) this.currentPage = this.pageCount;
  }

  openFolderDialog() {
    this.editingDocumentId = null;
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
  openFileDialog() { this.router.navigate(['/dashboard/documents/add/folder', this.folderId]); }

  closeFolderDialog() { this.folderDialog.nativeElement.close(); }

  saveFolder() {
    const input: DocumentNodeInput = {
      ParentId: this.folderId,
      Name: this.folderName || 'Untitled Folder',
      Type: 'Folder',
      Status: 'Draft',
      Code: this.folderCode,
      DocumentTypes: this.documentTypes,
      Designation: this.folderDesignation,
      Group: this.group,
      OverrideDocumentNumber: this.overrideDocumentNumber,
      ManualDocumentNumber: this.manualDocumentNumber,
      ManualVersion: this.manualVersion,
      CascadePrivilege: this.cascadePrivilege
    };
    if (this.editingDocumentId) this.documentService.update(this.editingDocumentId, input);
    else this.documentService.create(input);
    this.closeFolderDialog();
  }

  goToRoot() { this.router.navigate(['/dashboard/documents']); }
  goToParent() { this.currentFolder?.ParentId ? this.router.navigate(['/dashboard/documents/folder', this.currentFolder.ParentId]) : this.goToRoot(); }
}

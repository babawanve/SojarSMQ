import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentNode, DocumentNodeInput } from '../../model/document-node.model';
import { DocumentService } from '../../services/document.service';

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
    return term ? this.documents.filter(document => [document.id, document.type, document.name, document.status]
      .some(value => value.toLowerCase().includes(term))) : this.documents;
  }
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
    if (document.type === 'File') {
      this.router.navigate(['/dashboard/documents/add', document.id]);
      return;
    }
    this.editingDocumentId = document.id;
    this.folderName = document.name;
    this.folderCode = document.code;
    this.documentTypes = document.documentTypes;
    this.folderDesignation = document.designation;
    this.group = document.group;
    this.overrideDocumentNumber = document.overrideDocumentNumber;
    this.manualDocumentNumber = document.manualDocumentNumber;
    this.manualVersion = document.manualVersion;
    this.cascadePrivilege = document.cascadePrivilege;
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
      parentId: this.folderId,
      name: this.folderName || 'Untitled Folder',
      type: 'Folder',
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

  goToRoot() { this.router.navigate(['/dashboard/documents']); }
  goToParent() { this.currentFolder?.parentId ? this.router.navigate(['/dashboard/documents/folder', this.currentFolder.parentId]) : this.goToRoot(); }
}

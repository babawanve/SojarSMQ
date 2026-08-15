import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { DocumentNodeInput } from '../../model/document-node.model';
import { DocumentService } from '../../services/document.service';
import { LoadingService } from '../../services/loading.service';

type AddDocumentTab = 'details' | 'revision' | 'tags';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-document.html',
  styleUrl: './add-document.css',
})
export class AddDocument implements OnDestroy {
  readonly documentTypeOptions = ['Annexure', 'Forms', 'HR Policy', 'IT Policy', 'IT SOP', 'User Manual'];
  readonly groupOptions = ['Belongs to Individual documents', 'Client specific documents', 'General'];
  readonly tabs: { id: AddDocumentTab; label: string; required?: boolean }[] = [
    { id: 'details', label: 'Document Details' },
    { id: 'revision', label: 'Revision', required: true },
    { id: 'tags', label: 'Tags' }
  ];

  activeTab: AddDocumentTab = 'details';
  isExpanded = true;
  editingDocumentId: string | null = null;
  parentId: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  previewResourceUrl: SafeResourceUrl | null = null;
  previewText = '';
  spreadsheetRows: string[][] = [];
  previewType: 'image' | 'pdf' | 'docx' | 'spreadsheet' | 'unsupported' | null = null;
  previewError = '';
  previewZoom = 100;
  saveAttempted = false;
  errorMessage = '';
  tagInput = '';
  tags: string[] = [];

  documentNumber = '';
  version = 1;
  documentName = '';
  documentType = '';
  effectiveFrom = '';
  expirationDate = '';
  description = '';
  changeRequest = '';
  revisionSummary = '';
  revisionDate = '';
  group = 'General';

  constructor(
    private readonly documentService: DocumentService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly loadingService: LoadingService
  ) {
    const documentId = this.route.snapshot.paramMap.get('documentId');
    const folderId = this.route.snapshot.paramMap.get('folderId');
    if (documentId) this.loadDocument(documentId);
    else if (folderId) this.parentId = folderId;
  }

  get isEditing() {
    return this.editingDocumentId !== null;
  }

  get filePreviewable() {
    return ['image', 'pdf', 'docx', 'spreadsheet'].includes(this.previewType ?? '');
  }

  get fileSizeLabel() {
    if (!this.selectedFile) return '';
    return `${(this.selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
  }

  get previewZoomLabel() {
    return `${this.previewZoom}%`;
  }

  get detailsValid() {
    return !!this.documentName.trim() && !!this.documentType && !!this.description.trim();
  }

  get revisionValid() {
    return !!this.revisionSummary.trim() && !!this.revisionDate;
  }

  get canSave() {
    return this.detailsValid && this.revisionValid;
  }

  selectTab(tab: AddDocumentTab) {
    this.activeTab = tab;
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.setSelectedFile(file);
    if (this.previewType === 'image' || this.previewType === 'pdf') {
      this.loadingService.start('Rendering file preview');
      this.loadingService.update(70, 'Rendering file preview');
    }
    await this.preparePreview(file);
    input.value = '';
  }

  previewReady() {
    this.loadingService.update(100, 'Preview ready');
    this.loadingService.finish();
  }

  zoomIn() {
    this.previewZoom = Math.min(200, this.previewZoom + 10);
  }

  zoomOut() {
    this.previewZoom = Math.max(50, this.previewZoom - 10);
  }

  resetZoom() {
    this.previewZoom = 100;
  }

  downloadFile() {
    if (!this.selectedFile) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(this.selectedFile);
    link.download = this.selectedFile.name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  addTag() {
    const tag = this.tagInput.trim();
    if (tag && !this.tags.includes(tag)) this.tags = [...this.tags, tag];
    this.tagInput = '';
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(item => item !== tag);
  }

  save() {
    this.saveAttempted = true;
    this.errorMessage = '';
    if (!this.canSave) {
      this.activeTab = this.detailsValid ? 'revision' : 'details';
      this.errorMessage = 'Complete the required fields before saving.';
      return;
    }

    const input: DocumentNodeInput = {
      parentId: this.parentId,
      name: this.documentName.trim(),
      type: 'File' as const,
      status: 'Draft' as const,
      code: this.documentNumber.trim(),
      documentTypes: [this.documentType],
      designation: this.description.trim(),
      group: this.group,
      overrideDocumentNumber: false,
      manualDocumentNumber: false,
      manualVersion: false,
      cascadePrivilege: false,
      version: this.version,
      effectiveFrom: this.effectiveFrom,
      expirationDate: this.expirationDate,
      changeRequest: this.changeRequest,
      revisionSummary: this.revisionSummary,
      revisionDate: this.revisionDate,
      tags: [...this.tags]
    };

    if (this.editingDocumentId) {
      this.documentService.update(this.editingDocumentId, input);
      if (this.selectedFile) this.documentService.setFile(this.editingDocumentId, this.selectedFile);
    } else {
      const createdDocument = this.documentService.create(input);
      if (this.selectedFile) this.documentService.setFile(createdDocument.id, this.selectedFile);
    }
    this.returnToDocumentList();
  }

  deleteDocument() {
    if (this.editingDocumentId) this.documentService.remove(this.editingDocumentId);
    this.returnToDocumentList();
  }

  cancel() {
    this.returnToDocumentList();
  }

  ngOnDestroy() {
    this.revokePreviewUrl();
  }

  private loadDocument(documentId: string) {
    const document = this.documentService.findById(documentId);
    if (!document || document.type !== 'File') {
      this.router.navigate(['/dashboard/documents']);
      return;
    }
    this.editingDocumentId = document.id;
    this.parentId = document.parentId;
    this.documentNumber = document.code;
    this.documentName = document.name;
    this.documentType = document.documentTypes[0] ?? '';
    this.description = document.designation;
    this.group = document.group;
    this.version = document.version ?? 1;
    this.effectiveFrom = document.effectiveFrom ?? '';
    this.expirationDate = document.expirationDate ?? '';
    this.changeRequest = document.changeRequest ?? '';
    this.revisionSummary = document.revisionSummary ?? '';
    this.revisionDate = document.revisionDate ?? '';
    this.tags = [...(document.tags ?? [])];
    const storedFile = this.documentService.getFile(document.id);
    if (storedFile) {
      this.setSelectedFile(storedFile);
      void this.preparePreview(storedFile);
    }
  }

  private returnToDocumentList() {
    if (this.parentId) {
      this.router.navigate(['/dashboard/documents/folder', this.parentId]);
    } else {
      this.router.navigate(['/dashboard/documents']);
    }
  }

  private setSelectedFile(file: File) {
    this.revokePreviewUrl();
    this.selectedFile = file;
    this.resetZoom();
    this.previewText = '';
    this.spreadsheetRows = [];
    this.previewError = '';
    this.previewType = this.getPreviewType(file);
    this.previewUrl = this.previewType === 'image' || this.previewType === 'pdf'
      ? URL.createObjectURL(file)
      : null;
    this.previewResourceUrl = this.previewUrl && this.previewType === 'pdf'
      ? this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl)
      : null;
  }

  private async preparePreview(file: File) {
    const requiresExtraction = this.previewType === 'docx' || this.previewType === 'spreadsheet';
    if (!requiresExtraction) return;
    this.loadingService.start('Reading file contents');
    try {
      this.loadingService.update(30, 'Reading file contents');
      const buffer = await file.arrayBuffer();
      this.loadingService.update(65, 'Rendering preview');
      if (this.previewType === 'docx') {
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        this.previewText = result.value || 'The document does not contain readable text.';
      } else if (this.previewType === 'spreadsheet') {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        this.spreadsheetRows = firstSheet
          ? (XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, defval: '' }) as unknown[][])
            .map(row => row.map(cell => String(cell)))
          : [];
      }
      this.loadingService.update(100, 'Preview ready');
    } catch {
      this.previewError = 'This file could not be read in the browser. Download it to view the original contents.';
    } finally {
      this.loadingService.finish();
    }
  }

  private getPreviewType(file: File): NonNullable<AddDocument['previewType']> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf' || extension === 'pdf') return 'pdf';
    if (extension === 'docx') return 'docx';
    if (extension === 'xls' || extension === 'xlsx') return 'spreadsheet';
    return 'unsupported';
  }

  private revokePreviewUrl() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = null;
    this.previewResourceUrl = null;
    this.previewText = '';
    this.spreadsheetRows = [];
    this.previewType = null;
  }
}

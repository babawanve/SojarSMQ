import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DocumentNode, DocumentNodeInput } from '../../model/document-node.model';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-add-folder',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSlideToggleModule],
  templateUrl: './add-folder.html',
  styleUrl: './add-folder.css',
})
export class AddFolder {
  readonly documentTypeOptions = ['Annexure', 'Forms', 'HR Policy', 'IT Policy', 'IT SOP', 'User Manual'];
  readonly groupOptions = ['Belongs to Individual documents', 'Client specific documents', 'General'];

  editingDocumentId: string | null = null;
  parentId: string | null = null;
  documentTypeExpanded = false;
  folderName = '';
  folderCode = '';
  documentTypes: string[] = [];
  folderDesignation = '';
  group = 'General';
  overrideDocumentNumber = false;
  manualDocumentNumber = false;
  manualVersion = false;
  cascadePrivilege = false;

  constructor(
    private readonly documentService: DocumentService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    const documentId = this.route.snapshot.paramMap.get('documentId');
    if (documentId) this.loadDocument(documentId);
  }

  get isEditing() {
    return this.editingDocumentId !== null;
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

  save() {
    const input: DocumentNodeInput = {
      parentId: this.parentId,
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
    this.goBack();
  }

  cancel() {
    this.goBack();
  }

  private loadDocument(documentId: string) {
    const document = this.documentService.findById(documentId);
    if (!document || document.type !== 'Folder') {
      this.goBack();
      return;
    }
    this.editingDocumentId = document.id;
    this.parentId = document.parentId;
    this.folderName = document.name;
    this.folderCode = document.code;
    this.documentTypes = [...document.documentTypes];
    this.folderDesignation = document.designation;
    this.group = document.group;
    this.overrideDocumentNumber = document.overrideDocumentNumber;
    this.manualDocumentNumber = document.manualDocumentNumber;
    this.manualVersion = document.manualVersion;
    this.cascadePrivilege = document.cascadePrivilege;
  }

  private goBack() {
    if (this.parentId) this.router.navigate(['/dashboard/documents/folder', this.parentId]);
    else this.router.navigate(['/dashboard/documents']);
  }
}

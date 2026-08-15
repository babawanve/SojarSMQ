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
      ParentId: this.parentId,
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
    this.goBack();
  }

  cancel() {
    this.goBack();
  }

  private loadDocument(documentId: string) {
    const document = this.documentService.findById(documentId);
    if (!document || document.Type !== 'Folder') {
      this.goBack();
      return;
    }
    this.editingDocumentId = document.Id;
    this.parentId = document.ParentId;
    this.folderName = document.Name;
    this.folderCode = document.Code;
    this.documentTypes = [...document.DocumentTypes];
    this.folderDesignation = document.Designation;
    this.group = document.Group;
    this.overrideDocumentNumber = document.OverrideDocumentNumber;
    this.manualDocumentNumber = document.ManualDocumentNumber;
    this.manualVersion = document.ManualVersion;
    this.cascadePrivilege = document.CascadePrivilege;
  }

  private goBack() {
    if (this.parentId) this.router.navigate(['/dashboard/documents/folder', this.parentId]);
    else this.router.navigate(['/dashboard/documents']);
  }
}

import { Injectable, signal } from '@angular/core';
import { DocumentNode, DocumentNodeInput } from '../model/document-node.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly files = new Map<string, File>();
  private readonly nodes = signal<DocumentNode[]>([
    this.seed('DOC-1001', null, 'Incident Response Procedure', 'Folder', 'Published'),
    this.seed('DOC-1002', null, 'Leave and Attendance Policy', 'File', 'Published'),
    this.seed('DOC-1003', null, 'New Employee Request Form', 'Folder', 'Draft'),
    this.seed('DOC-1004', null, 'Quality Portal User Manual', 'File', 'Review'),
    this.seed('DOC-1005', null, 'Supplier Assessment Annexure', 'Folder', 'Published'),
    this.seed('DOC-1101', 'DOC-1001', 'Incident Response Checklist', 'File', 'Published'),
    this.seed('DOC-1102', 'DOC-1001', 'Escalation Procedures', 'Folder', 'Review'),
    this.seed('DOC-1201', 'DOC-1102', 'Escalation Contact Form', 'File', 'Draft')
  ]);

  listChildren(parentId: string | null): DocumentNode[] {
    return this.nodes().filter(node => node.ParentId === parentId);
  }

  findById(id: string): DocumentNode | undefined {
    return this.nodes().find(node => node.Id === id);
  }

  getFile(documentId: string): File | undefined {
    return this.files.get(documentId);
  }

  setFile(documentId: string, file: File): void {
    this.files.set(documentId, file);
  }

  breadcrumbs(folderId: string | null): DocumentNode[] {
    const path: DocumentNode[] = [];
    let current = folderId ? this.findById(folderId) : undefined;
    while (current) {
      path.unshift(current);
      current = current.ParentId ? this.findById(current.ParentId) : undefined;
    }
    return path;
  }

  create(input: DocumentNodeInput): DocumentNode {
    const now = new Date().toISOString();
    const node: DocumentNode = { ...input, Id: this.nextId(), CreatedAt: now, UpdatedAt: now };
    this.nodes.update(nodes => [...nodes, node]);
    return node;
  }

  update(id: string, input: DocumentNodeInput): void {
    this.nodes.update(nodes => nodes.map(node => node.Id === id
      ? { ...node, ...input, Id: node.Id, CreatedAt: node.CreatedAt, UpdatedAt: new Date().toISOString() }
      : node));
  }

  remove(id: string): void {
    const ids = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of this.nodes()) {
        if (node.ParentId && ids.has(node.ParentId) && !ids.has(node.Id)) {
          ids.add(node.Id);
          changed = true;
        }
      }
    }
    this.nodes.update(nodes => nodes.filter(node => !ids.has(node.Id)));
    ids.forEach(documentId => this.files.delete(documentId));
  }

  private nextId(): string {
    const numericIds = this.nodes().map(node => Number(node.Id.replace('DOC-', ''))).filter(Number.isFinite);
    return `DOC-${Math.max(...numericIds, 1000) + 1}`;
  }

  private seed(id: string, parentId: string | null, name: string, type: DocumentNode['Type'], status: DocumentNode['Status']): DocumentNode {
    const now = new Date().toISOString();
    return {
      Id: id, ParentId: parentId, Name: name, Type: type, Status: status, Code: id, DocumentTypes: [], Designation: name, Group: 'General',
      OverrideDocumentNumber: false, ManualDocumentNumber: false, ManualVersion: false, CascadePrivilege: false,
      CreatedAt: now, UpdatedAt: now
    };
  }
}

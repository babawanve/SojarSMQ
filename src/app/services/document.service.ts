import { Injectable, signal } from '@angular/core';
import { DocumentNode, DocumentNodeInput } from '../model/document-node.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
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
    return this.nodes().filter(node => node.parentId === parentId);
  }

  findById(id: string): DocumentNode | undefined {
    return this.nodes().find(node => node.id === id);
  }

  breadcrumbs(folderId: string | null): DocumentNode[] {
    const path: DocumentNode[] = [];
    let current = folderId ? this.findById(folderId) : undefined;
    while (current) {
      path.unshift(current);
      current = current.parentId ? this.findById(current.parentId) : undefined;
    }
    return path;
  }

  create(input: DocumentNodeInput): DocumentNode {
    const now = new Date().toISOString();
    const node: DocumentNode = { ...input, id: this.nextId(), createdAt: now, updatedAt: now };
    this.nodes.update(nodes => [...nodes, node]);
    return node;
  }

  update(id: string, input: DocumentNodeInput): void {
    this.nodes.update(nodes => nodes.map(node => node.id === id
      ? { ...node, ...input, id: node.id, createdAt: node.createdAt, updatedAt: new Date().toISOString() }
      : node));
  }

  remove(id: string): void {
    const ids = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of this.nodes()) {
        if (node.parentId && ids.has(node.parentId) && !ids.has(node.id)) {
          ids.add(node.id);
          changed = true;
        }
      }
    }
    this.nodes.update(nodes => nodes.filter(node => !ids.has(node.id)));
  }

  private nextId(): string {
    const numericIds = this.nodes().map(node => Number(node.id.replace('DOC-', ''))).filter(Number.isFinite);
    return `DOC-${Math.max(...numericIds, 1000) + 1}`;
  }

  private seed(id: string, parentId: string | null, name: string, type: DocumentNode['type'], status: DocumentNode['status']): DocumentNode {
    const now = new Date().toISOString();
    return {
      id, parentId, name, type, status, code: id, documentTypes: [], designation: name, group: 'General',
      overrideDocumentNumber: false, manualDocumentNumber: false, manualVersion: false, cascadePrivilege: false,
      createdAt: now, updatedAt: now
    };
  }
}

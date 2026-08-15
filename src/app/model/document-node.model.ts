export type DocumentNodeType = 'Folder' | 'File';
export type DocumentNodeStatus = 'Draft' | 'Review' | 'Published';

export interface DocumentNode {
  id: string;
  parentId: string | null;
  name: string;
  type: DocumentNodeType;
  status: DocumentNodeStatus;
  code: string;
  documentTypes: string[];
  designation: string;
  group: string;
  overrideDocumentNumber: boolean;
  manualDocumentNumber: boolean;
  manualVersion: boolean;
  cascadePrivilege: boolean;
  version?: number;
  effectiveFrom?: string;
  expirationDate?: string;
  changeRequest?: string;
  revisionSummary?: string;
  revisionDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentNodeInput {
  parentId: string | null;
  name: string;
  type: DocumentNodeType;
  status: DocumentNodeStatus;
  code: string;
  documentTypes: string[];
  designation: string;
  group: string;
  overrideDocumentNumber: boolean;
  manualDocumentNumber: boolean;
  manualVersion: boolean;
  cascadePrivilege: boolean;
  version?: number;
  effectiveFrom?: string;
  expirationDate?: string;
  changeRequest?: string;
  revisionSummary?: string;
  revisionDate?: string;
  tags?: string[];
}

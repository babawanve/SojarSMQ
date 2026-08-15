export type DocumentNodeType = 'Folder' | 'File';
export type DocumentNodeStatus = 'Draft' | 'Review' | 'Published';

export interface DocumentNode {
  Id: string;
  ParentId: string | null;
  Name: string;
  Type: DocumentNodeType;
  Status: DocumentNodeStatus;
  Code: string;
  DocumentTypes: string[];
  Designation: string;
  Group: string;
  OverrideDocumentNumber: boolean;
  ManualDocumentNumber: boolean;
  ManualVersion: boolean;
  CascadePrivilege: boolean;
  Version?: number;
  EffectiveFrom?: string;
  ExpirationDate?: string;
  ChangeRequest?: string;
  RevisionSummary?: string;
  RevisionDate?: string;
  Tags?: string[];
  CreatedAt: string;
  UpdatedAt: string;
}

export interface DocumentNodeInput {
  ParentId: string | null;
  Name: string;
  Type: DocumentNodeType;
  Status: DocumentNodeStatus;
  Code: string;
  DocumentTypes: string[];
  Designation: string;
  Group: string;
  OverrideDocumentNumber: boolean;
  ManualDocumentNumber: boolean;
  ManualVersion: boolean;
  CascadePrivilege: boolean;
  Version?: number;
  EffectiveFrom?: string;
  ExpirationDate?: string;
  ChangeRequest?: string;
  RevisionSummary?: string;
  RevisionDate?: string;
  Tags?: string[];
}

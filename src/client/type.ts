export interface SignupData {
  email: string;
  password: string;
}

export interface MarkdownerDocument {
  id?: string;
  title: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  is_active?: boolean;
  opened_at?: string;
  Contents?: {
    content: string;
  };
}

export interface DocumentContent {
  id?: string;
  document_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

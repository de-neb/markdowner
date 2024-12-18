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
}

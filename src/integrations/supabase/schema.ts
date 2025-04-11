
// This file contains the schema definitions for Supabase tables

export const AUDIO_FUNCTION_MAPPINGS_TABLE = {
  name: 'audio_function_mappings',
  columns: `
    id uuid not null primary key default uuid_generate_v4(),
    function_id text not null,
    audio_file_name text not null,
    audio_url text,
    is_primary boolean not null default true,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone
  `,
  indexes: `
    CREATE UNIQUE INDEX audio_function_mappings_function_id_idx ON audio_function_mappings (function_id) WHERE is_primary = true;
  `,
  foreignKeys: ``
};

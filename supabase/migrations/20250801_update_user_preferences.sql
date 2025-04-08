
-- Add consciousness_mode column to user_preferences if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user_preferences'
        AND column_name = 'consciousness_mode'
    ) THEN
        ALTER TABLE public.user_preferences
        ADD COLUMN consciousness_mode text DEFAULT 'standard';
    END IF;
END $$;

-- Migration: Normalize icon values to lowercase in content_blocks
-- This fixes icons stored as uppercase (e.g., "NO_SMOKING" -> "no_smoking")

-- Update all guides with rules blocks that have uppercase icon values
UPDATE guides
SET content_blocks = (
  SELECT jsonb_agg(
    CASE
      WHEN block->>'type' = 'rules' THEN
        jsonb_set(
          block,
          '{data,items}',
          (
            SELECT jsonb_agg(
              CASE
                WHEN item->>'icon' IS NOT NULL THEN
                  jsonb_set(item, '{icon}', to_jsonb(lower(item->>'icon')))
                ELSE
                  item
              END
            )
            FROM jsonb_array_elements(block->'data'->'items') AS item
          )
        )
      ELSE
        block
    END
  )
  FROM jsonb_array_elements(content_blocks) AS block
)
WHERE EXISTS (
  SELECT 1
  FROM jsonb_array_elements(content_blocks) AS block,
       jsonb_array_elements(block->'data'->'items') AS item
  WHERE block->>'type' = 'rules'
    AND item->>'icon' IS NOT NULL
    AND item->>'icon' ~ '[A-Z]'
);

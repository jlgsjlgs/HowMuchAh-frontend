import { z } from 'zod';

/**
 * Schema for creating a new group
 */
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Group name is required')
    .min(1, 'Group name must be at least 1 characters')
    .max(100, 'Group name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional()
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

/**
 * Schema for updating group details
 * Note: At least one field must be provided (name or description)
 */
export const updateGroupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Group name must be at least 1 character')
      .max(100, 'Group name must be less than 100 characters')
      .trim()
      .optional(),
    description: z
      .string()
      .max(500, 'Description must be less than 500 characters')
      .trim()
      .optional(),
  })
  .refine(
    (data) => {
      const hasName = data.name !== undefined && data.name.length > 0;
      const hasDescription = data.description !== undefined && data.description.length > 0;
      return hasName || hasDescription;
    },
    {
      message: 'At least one field (name or description) must be provided',
    }
  );

export type UpdateGroupFormData = z.infer<typeof updateGroupSchema>;
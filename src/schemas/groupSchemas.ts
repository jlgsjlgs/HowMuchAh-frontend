import { z } from 'zod';

/**
 * Schema for creating a new group
 */
export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Group name is required')
    .min(1, 'Group name must be at least 1 characters')
    .max(50, 'Group name must be less than 50 characters'),
  description: z
    .string()
    .trim()
    .max(150, 'Description must be less than 150 characters')
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
      .trim()
      .min(1, 'Group name must be at least 1 character')
      .max(50, 'Group name must be less than 50 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(150, 'Description must be less than 50 characters')
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
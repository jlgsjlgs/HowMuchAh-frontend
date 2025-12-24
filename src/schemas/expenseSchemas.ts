import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Enable dayjs custom parse format plugin
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export const createExpenseSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters'),
  
  totalAmount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be positive'),
  
  currency: z
    .string()
    .min(1, 'Currency is required'),
  
  paidByUserId: z
    .string()
    .uuid('Invalid user ID'),
  
  category: z
    .string()
    .min(1, 'Category is required'),
  
  expenseDate: z
    .string()
    .min(1, 'Date is required')
    .refine(
      (date) => {
        // Check if date is in valid format and is a real date
        const parsed = dayjs(date, 'YYYY-MM-DD', true);
        return parsed.isValid();
      },
      { message: 'Invalid date format or date does not exist' }
    )
    .refine(
      (date) => {
        const parsed = dayjs(date, 'YYYY-MM-DD');
        const today = dayjs().startOf('day');
        return parsed.isSameOrBefore(today);
      },
      { message: 'Date cannot be in the future' }
    ),
  
  splitType: z.enum(['equal', 'exact', 'itemized']),
});

export type CreateExpenseData = z.infer<typeof createExpenseSchema>;
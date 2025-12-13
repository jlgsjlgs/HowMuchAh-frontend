import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import type { ApiErrorResponse } from '@/lib/types/api';
import type { FieldValues, UseFormSetError, Path } from 'react-hook-form';

export function useApiErrorHandler<T extends FieldValues>(
  setError?: UseFormSetError<T>
) {
  return (error: unknown) => {
    if (isAxiosError<ApiErrorResponse>(error)) {
      const errorData = error.response?.data;
      
      if (!errorData) {
        toast.error('Network error occurred');
        return;
      }
      
      // Validation errors
      if (errorData.validationErrors && setError) {
        Object.entries(errorData.validationErrors).forEach(([field, message]) => {
          setError(field as Path<T>, { message });
        });
        toast.error('Please fix the validation errors');
        return;
      }
      
      // General errors
      toast.error(errorData.message || 'An error occurred');
    } else {
      toast.error('An unexpected error occurred');
    }
  };
}
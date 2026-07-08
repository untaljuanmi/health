export function convertDateIntoFormDate(date?: Date | null): string {
  return (date ?? new Date()).toISOString().split('T')[0];
}

export function convertFormDateIntoDate(date?: string | null): Date {
  return new Date(date ?? convertDateIntoFormDate());
}

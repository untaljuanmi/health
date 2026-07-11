export function dateIntoFormDate(date?: Date | null): string {
  return (date ?? new Date()).toISOString().split('T')[0];
}

export function formDateIntoDate(date?: string | null): Date {
  return new Date(date ?? dateIntoFormDate());
}

export function dateIntoFormDateTime(date?: Date | null): string {
  const newDate = date ?? new Date();
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');
  const hours = String(newDate.getHours()).padStart(2, '0');
  const minutes = String(newDate.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

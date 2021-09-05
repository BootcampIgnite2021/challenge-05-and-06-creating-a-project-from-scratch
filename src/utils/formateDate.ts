import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const FORMAT_DATE = 'dd MMM yyyy';
export const FORMAT_EDIT = "'* editado em' dd MMM yyyy', às' h':'m";

export function formateDate(
  date: string,
  formatType: typeof FORMAT_DATE | typeof FORMAT_EDIT
): string {
  if (formatType === FORMAT_DATE) {
    return format(new Date(date), FORMAT_DATE, { locale: ptBR });
  }

  return format(new Date(date), FORMAT_EDIT, { locale: ptBR });
}

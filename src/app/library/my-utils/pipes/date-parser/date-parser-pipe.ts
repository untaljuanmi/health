import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateParser',
})
export class DateParserPipe implements PipeTransform {
  private readonly _translateService = inject(TranslateService);

  transform(value?: Date | null): string {
    if (!value) {
      return '';
    }

    const locale: string | null = this._translateService.getCurrentLang();

    return value.toLocaleDateString(locale ?? 'es', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

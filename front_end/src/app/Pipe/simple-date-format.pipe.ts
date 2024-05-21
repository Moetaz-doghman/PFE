import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simpleDateFormat'
})
export class SimpleDateFormatPipe implements PipeTransform {

  transform(value: any): unknown {
    if (!value) return null;
    
    const date = new Date(value);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

}

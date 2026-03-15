import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingLevel',
  standalone: true
})
export class RatingLevelPipe implements PipeTransform {
  transform(rating: number): string {
    if (rating >= 9.5) {
      return '神作';
    } else if (rating >= 9.0) {
      return '推荐';
    } else if (rating >= 8.0) {
      return '良好';
    } else if (rating >= 7.0) {
      return '一般';
    } else {
      return '平庸';
    }
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingLevel',
  standalone: true
})
export class RatingLevelPipe implements PipeTransform {
  transform(rating: number): string {
    if (rating >= 9) {
      return '优秀';
    } else if (rating >= 8) {
      return '良好';
    } else if (rating >= 6) {
      return '一般';
    } else {
      return '较差';
    }
  }
}
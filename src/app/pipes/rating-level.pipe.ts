import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingLevel',
  standalone: true
})
export class RatingLevelPipe implements PipeTransform {
  transform(rating: number): string {
    if (rating >= 9) {
      return '殿堂级';
    }

    if (rating >= 8) {
      return '口碑佳作';
    }

    if (rating >= 6) {
      return '值得一看';
    }

    return '可作补片';
  }
}

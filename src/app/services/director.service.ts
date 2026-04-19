import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Director } from '../models/director';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class DirectorService {
  private readonly messageService = inject(MessageService);

  private readonly directors: Director[] = [
    {
      id: 1,
      name: 'Christopher Nolan',
      nationality: 'UK / USA',
      birthYear: 1970,
      bio: 'Known for nonlinear storytelling and large-scale visual design. Major works include Inception, Interstellar, and The Dark Knight trilogy.'
    },
    {
      id: 2,
      name: 'Ang Lee',
      nationality: 'Taiwan / USA',
      birthYear: 1954,
      bio: 'A cross-cultural filmmaker known for balancing character drama and visual innovation, including Crouching Tiger, Hidden Dragon and Life of Pi.'
    },
    {
      id: 3,
      name: 'Hayao Miyazaki',
      nationality: 'Japan',
      birthYear: 1941,
      bio: 'Co-founder of Studio Ghibli and one of animation cinema’s most influential directors, with works such as Spirited Away and My Neighbor Totoro.'
    },
    {
      id: 4,
      name: 'Wong Kar-wai',
      nationality: 'Hong Kong, China',
      birthYear: 1958,
      bio: 'Renowned for poetic visual language and emotionally layered stories. Representative films include In the Mood for Love and Chungking Express.'
    }
  ];

  getDirectors(): Observable<Director[]> {
    return of([...this.directors]).pipe(
      delay(200),
      tap(list => this.messageService.add(`DirectorService: loaded ${list.length} directors`))
    );
  }

  getDirectorById(id: number): Observable<Director | undefined> {
    return of(this.directors.find(director => director.id === id)).pipe(
      delay(150),
      tap(director =>
        this.messageService.add(
          director
            ? `DirectorService: found director ${director.name}`
            : `DirectorService: director id=${id} not found`
        )
      )
    );
  }
}

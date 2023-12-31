import { Injectable, computed, inject, signal } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Person } from './interfaces/person.interface';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private dbService: NgxIndexedDBService = inject(NgxIndexedDBService);
  private readonly peopleStoreName = 'people';
  people = signal<Person[]>([]);
  peopleLength = computed(() => this.people().length);

  addPerson(person: Omit<Person, 'id'>) {
    return this.dbService.add(this.peopleStoreName, person).pipe(
      switchMap(() => this.getAll())
    );
  }

  getAll(): Observable<Person[]> {
    return this.dbService.getAll<Person>(this.peopleStoreName).pipe(
      tap((people) => this.people.set(people))
    );
  }

  deleteOne(key: Person['id']): Observable<Person[]> {
    return this.dbService.delete<Person>(this.peopleStoreName, key!).pipe(
      tap((people) => this.people.set(people))
    )
  }

  update(person: Person) {
    return this.dbService.update(this.peopleStoreName, person).pipe(
      tap((currentPerson) => {
        this.people.update((people) => {
          return people.map((person) => currentPerson.id === person.id ? { ...currentPerson } : person)
        });
      })
    );
  }

  clearDB() {
    return this.dbService.clear(this.peopleStoreName).pipe(
      tap(() => this.people.set([]))
    )
  }
}

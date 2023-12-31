import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { take } from 'rxjs';
import { PeopleService } from './data-access/people.service';
import { Person } from './data-access/interfaces/person.interface';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header>
      <h3 style="display: flex; gap: 20px; align-items:center">
        <span>Users: {{ peopleService.peopleLength() }}</span>
        <button (click)="deleteAll()">Delete All</button>
      </h3>
    </header>
    <form #form="ngForm">
      <div>{{ form.valid ? 'Valid' : 'Invalid name or email' }}</div>
      <div ngModelGroup="peopleForm">
        <label for="name"> Name
          <input [(ngModel)]="peopleForm.name" type="text" name="name" required>
        </label>
        <label for="email"> Email
          <input [(ngModel)]="peopleForm.email" type="text" name="email" type="email" required email>
        </label>
      </div>
    </form>
    <div>
      @if (!peopleForm.id) {
        <button [disabled]="!form.valid" (click)="addPerson()">Add Person</button>
      } @else {
        <button [disabled]="!form.valid" (click)="confirmEdit()">Confirm Person Edit</button>
        <button (click)="rejectEdit()">Reject Person Edit</button>
      }
    </div>
    <ul [class.disabled]="peopleForm.id">
      @for (person of peopleService.people(); track person.id) {
        <li>
          <span>{{ $index + 1 }}.</span>
          <button (click)="setEdit(person)">✏️</button>
          <span>{{ person.name }}</span>
          <button (click)="deletePerson(person.id!)">❌</button>
        </li>
      }
    </ul>
  `,
  styles: `
    ul {
      list-style: none;
    }

    li {
      padding: 4px;
      border-radius: 4px;
      border: 1px solid lightsteelblue;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .disabled {
      pointer-events: none;
      background-color: #c1c1c1;
    }
  `,
  viewProviders: [
    { provide: ControlContainer, useExisting: NgForm }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PeopleComponent {
  peopleService = inject(PeopleService);
  private readonly peopleFormInitialState: Partial<Person> = {
    id: null,
    name: '',
    email: ''
  };
  peopleForm = { ...this.peopleFormInitialState };

  constructor() {
    this.peopleService.getAll().pipe(take(1)).subscribe();
  }

  public addPerson() {
    delete this.peopleForm.id;
    this.peopleService.addPerson({ ...this.peopleForm } as Omit<Person, 'id'>).pipe(take(1)).subscribe(() => {
      this.resetForm();
    });
  }

  public deletePerson(key: number) {
    this.peopleService.deleteOne(key).pipe(take(1)).subscribe();
  }

  public deleteAll() {
    this.peopleService.clearDB().pipe(take(1)).subscribe();
  }

  public setEdit(person: Person) {
    this.peopleForm = { ...person };
  }

  public confirmEdit() {
    this.peopleService.update({ ...this.peopleForm } as Person).pipe(take(1)).subscribe(() => this.resetForm());
  }

  public rejectEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.peopleForm = { ...this.peopleFormInitialState };
  }
}

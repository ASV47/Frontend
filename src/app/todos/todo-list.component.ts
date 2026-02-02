import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { TodoService } from "./todo.service";
import { TodoItem } from "./todo.model";

@Component({
  standalone: true,
  selector: "app-todo-list",
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="max-width: 720px; margin: 40px auto; padding: 16px;">
      <h2 style="margin:0 0 6px;">Todo App</h2>
      <div style="opacity:.75; margin-bottom:14px;">
        Nodejs + .NET API template
      </div>

      <div style="display:flex; gap:8px; margin: 12px 0;">
        <input
          [formControl]="titleCtrl"
          placeholder="New todo..."
          style="flex:1; padding:10px; border-radius:12px; border:1px solid #e5e7eb; outline:none;"
        />
        <button
          (click)="add()"
          [disabled]="titleCtrl.invalid || loading()"
          style="padding:10px 14px; border-radius:12px; cursor:pointer;"
        >
          Add
        </button>
      </div>

      <div *ngIf="error()" style="color:#b00020; margin: 10px 0;">
        {{ error() }}
      </div>
      <div *ngIf="loading()" style="margin: 10px 0;">Loading...</div>

      <ul style="list-style:none; padding:0; margin:0;" *ngIf="!loading()">
        <li
          *ngFor="let t of todos()"
          style="display:flex; align-items:center; justify-content:space-between; padding:12px; border:1px solid #eee; border-radius:14px; margin-bottom:8px; background:#fff;"
        >
          <div style="display:flex; align-items:center; gap:10px;">
            <input type="checkbox" [checked]="t.isDone" (change)="toggle(t)" />
            <span [style.textDecoration]="t.isDone ? 'line-through' : 'none'">{{
              t.title
            }}</span>
          </div>

          <button
            (click)="remove(t)"
            [disabled]="loading()"
            style="padding:8px 10px; border-radius:12px; cursor:pointer;"
          >
            Delete
          </button>
        </li>
      </ul>

      <div style="margin-top: 14px; opacity: 0.75;">
        Total: {{ total() }} | Done: {{ doneCount() }}
      </div>
    </div>
  `,
})
export class TodoListComponent {
  todos = signal<TodoItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  titleCtrl = new FormControl("", {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(2)],
  });

  total = computed(() => this.todos().length);
  doneCount = computed(() => this.todos().filter((x) => x.isDone).length);

  constructor(private api: TodoService) {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll().subscribe({
      next: (data) => this.todos.set(data),
      error: (e) => this.error.set(e?.message ?? "Failed to load"),
      complete: () => this.loading.set(false),
    });
  }

  add() {
    const title = this.titleCtrl.value.trim();
    if (!title) return;

    this.loading.set(true);
    this.error.set(null);

    this.api.create(title).subscribe({
      next: (created) => {
        this.todos.set([created, ...this.todos()]);
        this.titleCtrl.setValue("");
      },
      error: (e) => this.error.set(e?.message ?? "Failed to create"),
      complete: () => this.loading.set(false),
    });
  }

  toggle(t: TodoItem) {
    this.loading.set(true);
    this.error.set(null);

    this.api.update(t.id, { title: t.title, isDone: !t.isDone }).subscribe({
      next: () =>
        this.todos.set(
          this.todos().map((x) =>
            x.id === t.id ? { ...x, isDone: !x.isDone } : x,
          ),
        ),
      error: (e) => this.error.set(e?.message ?? "Failed to update"),
      complete: () => this.loading.set(false),
    });
  }

  remove(t: TodoItem) {
    this.loading.set(true);
    this.error.set(null);

    this.api.delete(t.id).subscribe({
      next: () => this.todos.set(this.todos().filter((x) => x.id !== t.id)),
      error: (e) => this.error.set(e?.message ?? "Failed to delete"),
      complete: () => this.loading.set(false),
    });
  }
}

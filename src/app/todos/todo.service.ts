import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { TodoItem } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly base = `${API_BASE_URL}/api/todos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.base);
  }

  create(title: string): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.base, { title });
  }

  update(id: number, payload: { title: string; isDone: boolean }): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

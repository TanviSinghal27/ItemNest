import { HttpClient } from '@angular/common/http';
import { Service, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class Categories {
  private http = inject(HttpClient);
  category = signal<String[]>([]);
  private apiUrl = 'https://dummyjson.com/products/category-list';

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product, ProductsResponse } from '../interfaces/product';

@Service()
export class ProductService {
  private http = inject(HttpClient);
  product = signal<Product[]>([]);
  private apiUrl = 'https://dummyjson.com/products';

  getAllProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.apiUrl);
  }

  addProducts(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product).pipe(
      tap((newProduct) => {
        this.product.update((list) => [newProduct, ...list]);
      }),
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, product);
  }
}

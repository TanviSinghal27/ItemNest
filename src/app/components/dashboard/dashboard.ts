import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Router } from '@angular/router';
import { Header } from '../header/header';
@Component({
  imports: [DecimalPipe, Header],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  product = this.productService.product;
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.errorMessage.set(null);
    if (this.productService.product().length > 0) {
      return;
    }

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productService.product.set(data.products);
      },
      error: (err) => {
        this.errorMessage.set('⚠️Failed to load products.Please try again later.');
      },
      complete: () => {},
    });
  }

  onDelete(id: number, title: string): void {
    if (id > 194) {
      alert('You have not authorization to delete this product.');
      return;
    }
    const confirmDelete = confirm(`Do you really want to delete ${title}?`);

    if (confirmDelete) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.productService.product.update((list) => list.filter((p) => p.id !== id));
        },
        error: (err) => {
          alert('Unable to delete product.');
        },
      });
    }
  }

  onEdit(id: number): void {
    if (id > 194) {
      alert('You have not authorization to edit this product details.');
      return;
    }

    this.router.navigate(['/edit', id]);
  }
}

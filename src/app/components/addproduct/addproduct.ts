import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { Categories } from '../../services/categories';
import { Header } from '../header/header';

@Component({
  imports: [FormsModule, Header],
  selector: 'app-addproduct',
  styleUrl: './addproduct.css',
  templateUrl: './addproduct.html',
})
export class Addproduct implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(Categories);
  product = signal<Product[]>([]);
  category = signal<string[]>([]);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.errorMessage.set(null);
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.category.set(data);
      },
      error: (err) => {
        this.errorMessage.set('⚠️Failed to load Categories.Please try again.');
      },
      complete: () => {},
    });
  }

  addProducts(form: any): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.productService.addProducts(form.value).subscribe({
      next: (data) => {
        this.successMessage.set(`Product "${data.brand}" added successfully!`);
        form.resetForm();
      },
      error: (err) => {
        this.errorMessage.set('⚠️Unable to add product.');
      },
      complete: () => {},
    });
  }
}

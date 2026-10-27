import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../interfaces/product';
import { Header } from '../header/header';

@Component({
  imports: [ReactiveFormsModule, Header],
  selector: 'app-editproduct',
  styleUrl: './editproduct.css',
  templateUrl: './editproduct.html',
})
export class Editproduct {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  errorMessage = signal<string | null>(null);

  editForm!: FormGroup;
  productId!: number;

  ngOnInit(): void {
    this.errorMessage.set(null);
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      discountPercentage: [0, [Validators.required, Validators.min(0)]],
      shippingInformation: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });

    const currentProduct = this.productService.product().find((p) => p.id === this.productId);

    if (currentProduct) {
      this.editForm.patchValue({
        title: currentProduct.title,
        discountPercentage: currentProduct.discountPercentage,
        shippingInformation: currentProduct.shippingInformation,
        price: currentProduct.price,
        stock: currentProduct.stock,
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.editForm.invalid) return;
    const updatedData: Product = {
      id: this.productId,
      ...this.editForm.value,
    };

    this.productService.updateProduct(this.productId, updatedData).subscribe({
      next: (response) => {
        this.productService.product.update((list) =>
          list.map((p) => (p.id === this.productId ? { ...p, ...this.editForm.value } : p)),
        );
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage.set('You have not authorization to edit this product details');
      },
    });
  }

  onCancel(): void {
    const currentProduct = this.productService.product().find((p) => p.id === this.productId);
    if (currentProduct) {
      this.editForm.patchValue(currentProduct);
    }
  }
}

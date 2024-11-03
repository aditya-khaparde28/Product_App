import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getPaginatedProducts(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.products = response.products;
        this.totalPages = response.totalPages;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }
}

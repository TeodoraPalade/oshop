import { Product } from "./../../models/product";
import { ProductService } from "./../../services/product.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-admin-products",
  templateUrl: "./admin-products.component.html",
  styleUrls: ["./admin-products.component.css"]
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[];
  subscription: Subscription;
  filteredProducts: Product[];

  constructor(private productService: ProductService) {
    this.subscription = this.productService
      .getAll()
      .pipe(
        map(products =>
          products.map(product => {
            const data = product.payload.val() as Product;
            const key = product.payload.key;
            return { key, ...data };
          })
        )
      )
      .subscribe(
        products => (this.filteredProducts = this.products = products)
      );
  }

  filter(query: string) {
    this.filteredProducts = query
      ? this.products.filter(p => p.title.includes(query))
      : this.products;
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { Product } from "./../../models/product";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "./../../services/product.service";
import { CategoryService } from "./../../services/category.service";
import { Component, OnInit } from "@angular/core";
import { take, map } from "rxjs/operators";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.css"]
})
export class ProductFormComponent implements OnInit {
  categories$;
  product = {};

  constructor(
    categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categories$ = categoryService.getCategories();

    let id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.productService
        .get(id)
        .pipe(
          take(1),
          map(product => {
            const data = product.payload.val() as Product;
            const key = product.payload.key;
            return { key, ...data };
          })
        )
        .subscribe(p => (this.product = p));
    }
  }
  save(product) {
    this.productService.create(product);
    this.router.navigate(["/admin/products"]);
  }

  ngOnInit() {}
}

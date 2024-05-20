import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, map } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

// Provides product metadata to the application.
export class ProductService {

    productMetadata: Observable<Product[]>;
    // Stores all products with filter applied
    filteredProductMetadata: Observable<Product[]>;

    nextIndex: number = 0;

    constructor(
        private http: HttpClient
    ) {
        // For simplicity, we load all product metadata when the application starts
        this.productMetadata = this.http.get<Product[]>('assets/products/metadata.json');
        this.filteredProductMetadata = this.productMetadata;
    }

    // Returns metadata of all products. For structure, see assets/products/metadata.json file.
    // This does not return the actual JSON, but an Observable.
    // Learn more about working with Observables at https://rxjs.dev/guide/overview
    getAllProductMetadata() {
        return this.productMetadata;
    }
      // Method to get the first 6 products with the same type and category as the specified product
// ProductService

getRecommendedProducts(type: string, category: string, productIdToExclude: string): Observable<Product[]> {
    return this.productMetadata.pipe(
      // Filter products based on type and category, excluding the current product
      map(products => products.filter(product => product.type === type && product.category === category && product.id !== productIdToExclude)),
      // Return only the first 6 filtered products
      map(filteredProducts => filteredProducts.slice(0, 6))
    );
  }
  

    // Returns a limited number of products. Optionally passes a filter to limit what products are selected.
    getInitialProductMetadata(numItems: number, filter?: (product: Product) => boolean) {
        return new Observable<Product[]>((subscriber) => {
            this.productMetadata.subscribe(allProducts => {
                if (filter) {
                    allProducts = allProducts.filter(filter);
                    // Save filtered products so that passing filter is not required in getNextProductMetadata
                    this.filteredProductMetadata = this.productMetadata.pipe(
                        map(allProducts => allProducts.filter(filter))
                    );
                }
                subscriber.next(allProducts.slice(0, numItems));
                this.nextIndex = numItems;
                subscriber.complete();
            });
        });
    }

    // Returns next numItems number of products. Only returns the new products,
    // the frontend is responsible for storing already obtained products.
    // If a filter was set in getInitialProductMetadata, items returned in this method
    // match the filter criterion
    getNextProductMetadata(numItems: number) {
        return new Observable<Product[]>((subscriber) => {
            if (this.nextIndex == 0) {
                subscriber.error(new Error("Tried to fetch more products without initialization. Run getInitialProductMetadata to obtain the first set of items."));
            }
            this.filteredProductMetadata.subscribe(allProducts => {
                setTimeout(() => {
                    subscriber.next(allProducts.slice(this.nextIndex, this.nextIndex + numItems));
                    this.nextIndex += numItems;
                    subscriber.complete();
                }, 700)
            })
        });
    }
    getProductMetadata(id: string): Observable<Product> {
        return new Observable<Product>((subscriber) => {
            this.productMetadata?.subscribe((products) => {
                let product = products.find((product) => product.id === id);
                if (product === undefined) {
                    subscriber.error(new Error(`Product with ID ${id} does not exist in dataset`));
                } else {
                    // Added default description (Lorem Ipsum)
                    if (!product.description) {
                        product.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.";
                    }
                    subscriber.next(product);
                    subscriber.complete();
                }
            });
        });
    }

    getProductImage(id: string) {
        return `./assets/products/images/${id}.jpg`
    }
}

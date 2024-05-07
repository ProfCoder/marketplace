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
                // Add artificial delay
                setTimeout(() => {
                    subscriber.next(allProducts.slice(this.nextIndex, this.nextIndex + numItems));
                    this.nextIndex += numItems;
                    subscriber.complete();
                }, 700)
            })
        });
    }

    // Get the product metadata for a single product by its id. Also returns an Observable.
    getProductMetadata(id: string) {
        return new Observable<Product>((subscriber) => {
            this.productMetadata?.subscribe((products) => {
                let product = products.find((product) => {
                    return product.id == id;
                })
                if (product === undefined) {
                    subscriber.error(new Error(`Product with ID ${id} does not exist in dataset`));
                } else {
                    subscriber.next(product);
                    subscriber.complete();
                }
            })
        })
    }

    getProductImage(id: string) {
        return `./assets/products/images/${id}.jpg`
    }
}

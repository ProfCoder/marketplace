import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Product } from './product';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

// Provides product metadata to the application.
export class ProductService {

    productMetadata: Observable<Product[]>;

    constructor(
        private http: HttpClient
    ) {
        // For simplicity, we load all product metadata when the application starts
        this.productMetadata = this.http.get<Product[]>('assets/products/metadata.json');
    }

    // Returns metadata of all products. For structure, see assets/products/metadata.json file.
    // This does not return the actual JSON, but an Observable.
    // Learn more about working with Observables at https://rxjs.dev/guide/overview
    getAllProductMetadata() {
        return this.productMetadata;
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

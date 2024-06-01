import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, map } from 'rxjs';
import { Color } from './color';

@Injectable({
    providedIn: 'root',
})

// Provides product metadata to the application.
export class ProductService {
    productMetadata: Observable<Product[]>; // Observable containing all product metadata
    // Stores all products with filter applied
    filteredProductMetadata: Observable<Product[]>; // Observable containing filtered product metadata

    nextIndex: number = 0; // Index to track the next set of products to be retrieved

    constructor(private http: HttpClient) {
        // For simplicity, we load all product metadata when the application starts
        this.productMetadata = this.http.get<Product[]>(
            'assets/products/metadata.json'
        );
        this.filteredProductMetadata = this.productMetadata;
    }

    // Returns metadata of all products. For structure, see assets/products/metadata.json file.
    // This does not return the actual JSON, but an Observable.
    // Learn more about working with Observables at https://rxjs.dev/guide/overview
    getAllProductMetadata() {
        return this.productMetadata;
    }

    /**
     * Returns a `numItems` number of products.
     * Optionally passes a filter to limit what products are selected.
     *
     * `filter` specifies a predicate function evaluated for each product.
     * If `true`, that product is included in the dataset.
     *
     * `searchText` specifies a search string that must be included in the
     * product name (case insensitive).
     *
     * ...Filtered arrays specify features of that metadata category to include
     * in the dataset. These are disjunctive *inside* categories, meaning e.g. inclusion of
     * 'Shirts' and 'Sandals' in `typesFiltered` returns a dataset that includes *both*
     * shirts and sandals.
     * However, they are conjunctive *across* categories, meaning that e.g. inclusion of
     * 'Shirts' in `typesFiltered` and 'Red' in `colorsFiltered` returns a dataset that includes
     * products that are both shirts and are available in red.
     *
     * If this predefined filter logic is not sufficient for your needs, you can provide custom
     * logic through the `filter` predicate. This is always evaluated, even if the ...Filtered
     * arrays are specified.
     * 
     * When retrieving more items later with getNextProductMetadata those products match the last
     * filter and search criteria passed to this method.
     *
     *
     * @param numItems - The number of items to retrieve.
     * @param filter - An optional filter function to apply to each product.
     * @param searchText - An optional search text to filter products by.
     * @param brandsFiltered - An optional array of brand names to filter products by.
     * @param gendersFiltered - An optional array of genders to filter products by.
     * @param typesFiltered - An optional array of types to filter products by.
     * @param categoriesFiltered - An optional array of categories to filter products by.
     * @param colorsFiltered - An optional array of colors to filter products by.
     * @param sizesFiltered - An optional array of sizes to filter products by.
     * @param priceRange - An optional price range to filter products by. 
     * @param sort - An optional parameter to specify the sort order.
     * @returns An Observable that emits an array of `numItems` products.
     */
    getInitialProductMetadata(
        numItems: number, 
        filter?: (product: Product) => boolean,
        searchText?: string,
        brandsFiltered?: string[],
        gendersFiltered?: string[],
        typesFiltered?: string[],
        categoriesFiltered?: string[],
        colorsFiltered?: string[],
        sizesFiltered?: string[],
        priceRange?: number[],
        sort: string = 'featured' // Default value for sort parameter
    ): Observable<Product[]> {
        console.log('Received price range:', priceRange); 
        
        searchText = searchText ?? '';
        brandsFiltered = brandsFiltered ?? [];
        gendersFiltered = gendersFiltered ?? [];
        typesFiltered = typesFiltered ?? [];
        categoriesFiltered = categoriesFiltered ?? [];
        colorsFiltered = colorsFiltered ?? [];
        sizesFiltered = sizesFiltered ?? [];
    
        return new Observable<Product[]>((subscriber) => {
            this.productMetadata.subscribe(() => {
                this.filteredProductMetadata = this.productMetadata.pipe(
                    map((allProducts) =>
                        allProducts.filter((product) => {
                            const priceInRange = !priceRange || (product.price >= priceRange[0] && product.price <= priceRange[1]);
                            
                            return (
                                priceInRange && 
                                this.filterProduct(
                                    product,
                                    searchText!,
                                    brandsFiltered!,
                                    gendersFiltered!,
                                    typesFiltered!,
                                    categoriesFiltered!,
                                    colorsFiltered!,
                                    sizesFiltered!
                                ) &&
                                (!filter || filter(product))
                            );
                        }).sort((a, b) => {
                            if (!sort || sort === 'featured') return 0; // Default sorting by ID
                            switch (sort) {
                                case 'priceAsc':
                                    return a.price - b.price;
                                case 'priceDesc':
                                    return b.price - a.price;
                                default:
                                    return 0;
                            }
                        })
                    )
                );
                this.filteredProductMetadata.subscribe((allProducts) => {
                    subscriber.next(allProducts.slice(0, numItems));
                    this.nextIndex = numItems;
                    subscriber.complete();
                });
            });
        });
    }

    private filterProduct(
        product: Product,
        searchText: string,
        brandsFiltered: string[],
        gendersFiltered: string[],
        typesFiltered: string[],
        categoriesFiltered: string[],
        colorsFiltered: string[],
        sizesFiltered: string[]
    ): boolean {
        // Also evaluate search, as the filter can refine search results

        console.log(`Filtering Product: ${product.name}`);
        console.log(`Received Filters - Brands: ${brandsFiltered}, Genders: ${gendersFiltered}, Colors: ${colorsFiltered}`);

        if (!product.name.toLowerCase().includes(searchText.toLowerCase().trim())) return false;
        if (!brandsFiltered.includes(product.brand) && brandsFiltered.length > 0) return false;
        if (!gendersFiltered.includes(product.gender) && gendersFiltered.length > 0) return false;
        if (!typesFiltered.includes(product.type) && typesFiltered.length > 0) return false;
        if (!categoriesFiltered.includes(product.category) && categoriesFiltered.length > 0) return false;
        if (!colorsFiltered.some((name) => product.colors.map((color) => color.color_name).includes(name)) && colorsFiltered.length > 0) return false;
        if (!sizesFiltered.some((size) => product.sizes.includes(size)) && sizesFiltered.length > 0) return false;
        return true;
    }

    /**
     * Returns next numItems number of products. Only returns the new products,
     * the frontend is responsible for storing already obtained products.
     * If a filter was set in getInitialProductMetadata, items returned in this method
     * match the filter criterion.
     * 
     * @param numItems The number of items to retrieve.
     * @returns An Observable that emits an array of Product elements.
     * @throws An error if getInitialProductMetadata was not called before this.
     */
    getNextProductMetadata(numItems: number): Observable<Product[]> {
        return new Observable<Product[]>((subscriber) => {
            if (this.nextIndex == 0) {
                subscriber.error(
                    new Error(
                        'Tried to fetch more products without initialization. Run getInitialProductMetadata to obtain the first set of items.'
                    )
                );
            }
            this.filteredProductMetadata.subscribe((allProducts) => {
                // Add artificial delay
                setTimeout(() => {
                    subscriber.next(
                        allProducts.slice(
                            this.nextIndex,
                            this.nextIndex + numItems
                        )
                    );
                    this.nextIndex += numItems;
                    subscriber.complete();
                }, 700);
            });
        });
    }

    // Get the product metadata for a single product by its id. Also returns an Observable.
    getProductMetadata(id: string): Observable<Product> {
        return new Observable<Product>((subscriber) => {
            this.productMetadata?.subscribe((products) => {
                let product = products.find((product) => product.id == id);
                if (product === undefined) {
                    subscriber.error(
                        new Error(
                            `Product with ID ${id} does not exist in dataset`
                        )
                    );
                } else {
                    subscriber.next(product);
                    subscriber.complete();
                }
            });
        });
    }

    getBrandList(): Observable<string[]> {
        return new Observable<string[]>((subscriber) => {
          this.productMetadata.subscribe((allProducts) => {
            subscriber.next(
              [
                ...new Set(allProducts.map((product) => product.brand)),
              ].sort()
            );
            subscriber.complete();
          });
        });
    }

    getGenderList(): Observable<string[]> {
        return this.getMetadataList<string>('gender');
    }

    getTypeList(): Observable<string[]> {
        return this.getMetadataList<string>('type');
    }

    /**
     * Retrieves a list of unique colors from the product metadata.
     * 
     * If one product has multiple color variants, all are added.
     * 
     * @returns An Observable that emits an array of Color objects.
     */
    getColorsList(): Observable<Color[]> {
        return new Observable<Color[]>((subscriber) => {
            this.productMetadata.subscribe((allProducts) => {
                subscriber.next(
                    allProducts
                        .map((product) => product.colors)
                        .flat()
                        .filter(
                            (color, index, self) =>
                                self.findIndex(
                                    (c) => c.color_name === color.color_name
                                ) === index
                        )
                        .sort((a, b) => a.color_name.localeCompare(b.color_name))
                );
                subscriber.complete();
            });
        });
    }

    getCategoryList(): Observable<string[]> {
        return this.getMetadataList<string>('category');
    }

    getPriceList(): Observable<string[]> {
        return this.getMetadataList<string>('price');
    }

    /**
     * Retrieves a list of unique sizes from the product metadata.
     * 
     * If one product has multiple sizes, all are added.
     * 
     * @returns An Observable that emits an array of strings representing the sizes.
     */
    getSizesList(): Observable<string[]> {
        return new Observable<string[]>((subscriber) => {
            this.productMetadata.subscribe((allProducts) => {
                subscriber.next(
                    allProducts
                        .map((product) => product.sizes)
                        // Dissolve sizes into single array
                        .flat()
                        // Deduplicate if size names are equal
                        .filter(
                            (size, index, self) =>
                                self.findIndex((s) => s === size) === index
                        )
                        .sort()
                );
                subscriber.complete();
            });
        });
    }

    private getMetadataList<T>(field: string): Observable<T[]> {
        return new Observable<T[]>((subscriber) => {
            this.productMetadata.subscribe((allProducts) => {
                subscriber.next(
                    [
                        ...new Set(
                            allProducts.map((product) => product[field])
                        ),
                    ].sort()
                );
                subscriber.complete();
            });
        });
    }

    getProductImage(id: string): string {
        return `./assets/products/images/${id}.jpg`;
    }

    getProductImageByColor(product: Product, selectedColors: string[]): string {
        console.log('Product ID:', product.id);
        console.log('Product Colors:', product.colors);
        console.log('Selected Colors:', selectedColors);

        // Find the first color in the product's colors array that matches any of the selected colors
        const matchingColor = product.colors.find(color => selectedColors.includes(color.color_name));

        console.log('Matching Color:', matchingColor);

        // If a matching color is found, return its corresponding image URL
        if (matchingColor) {
            return `./assets/products/images/${matchingColor.color_id}.jpg`;
        }

        // If no matching color is found, return a default image URL 
        return './assets/products/images/10009.jpg'; // for testing
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(`/api/products/${productId}`);
    }

    getRecommendedProducts(type: string, category: string, productId: string): Observable<Product[]> {
        return this.productMetadata.pipe(
            map(products => 
                products.filter(product => 
                    product.type === type && 
                    product.category === category && 
                    product.id !== productId // Exclude the current product
                )
            )
        );
    }

    getMaxPrice(): Observable<number> {
        return this.productMetadata.pipe(
            map(products => {
                if (!products || products.length === 0) {
                    // Handle the case where there are no products
                    return 0;
                }
                // Extract prices from products and find the maximum
                const prices = products.map(product => product.price);
                return Math.max(...prices);
            })
        );
    }
    
}

export type GenderList = string[];

// This contains the schema of the product metadata in assets/products/metadata.json
export interface Product {
    // The ID of the product. This is simultaneously the file basename of the default product image
    id: string;
    // Price as a number. The value roughly corresponds to Euro values ;)
    price: number;
    // Name of the product
    name: string;
    // The brand of the product, e.g. Reebok, Nike...
    brand: string;
    // If the product is in the male for female category
    gender: string;
    // The product type. Something specific, like 'TShirt'
    type: string;
    // The product category. Something broad, like 'Apparel'
    category: string;
    // An array of color variants for certain products.
    colors: {
        // The color ID is simultaneously the filename of the image showing the product in that color variant.
        color_id: string;
        // The name of the color
        color_name: string;
        // The hex code that corresponds to the name of the color
        color_hex: string;
    }[];
    // Available sizes. An Array of strings like 'L', 'XXL'...
    sizes: string[];
}
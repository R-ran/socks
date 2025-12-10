export interface Product {
  id: number;
  slug: string;
  name: string;
  price: string;
  originalPrice?: string;
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  comingSoon?: boolean;
  isBundle?: boolean;
  bundleOptions?: {
    '1': { price: number; label: string };
    '2': { price: number; label: string };
  };
}

export const products: Product[] = [
  {
    id: 1,
    slug: 'sloth-socks',
    name: 'Sloth Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      'https://ext.same-assets.com/2605587933/1629102377.jpeg',
      'https://ext.same-assets.com/2605587933/3325107424.png',
      '/Sloth-Socks1.avif',
      'https://ext.same-assets.com/2605587933/1525787751.jpeg',
    ],
    description: 'Step into something wild! Our Animal Socks are cozy, cute, and full of charm, like a hug from your favorite animal! Soft, breathable, and made to make you smile.\n\nWarning: May cause uncontrollable smiling and spontaneous animal noises!',
    features: [
      'One Size Fits All',
      'Comfort & Quality - soft, durable materials made for everyday wear',
      'Fast Shipping - 7-10 days shipping',
      'Easy Returns - 30-day hassle-free return policy',
      'Giving Back - 10% of profits go to animal & nature charities'
    ],
    inStock: true
  },
  {
    id: 2,
    slug: 'highland-cow-socks',
    name: 'Highland Cow Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      
      '/Highland-Cow-Socks1.avif',
      'https://ext.same-assets.com/2605587933/1408584014.jpeg',
      '/Highland-Cow-Socks2.avif',
    ],
    description: 'Adorable Highland Cow Socks – the perfect gift for animal lovers! Cozy, warm, and featuring the cutest fluffy Highland Cow design. These socks bring smiles and warmth wherever you go.',
    features: [
      'One Size Fits All',
      'Comfort & Quality - soft, durable materials',
      'Fast Shipping - 7-10 days',
      'Easy Returns - 30-day hassle-free return',
      'Giving Back - 10% to animal charities'
    ],
    inStock: true
  },
  {
    id: 3,
    slug: 'cat-socks',
    name: 'Cat Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      '/Cat-Socks3.avif',
      '/Cat-Socks2.avif',
      '/Cat-Socks1.avif',
      
    ],
    description: 'Adorable Cat Socks for feline fans! Super soft and cozy with a playful cat design that will make every cat lover smile.',
    features: [
      'One Size Fits All',
      'Comfort & Quality - premium materials',
      'Fast Shipping',
      'Easy Returns',
      'Giving Back - 10% to charities'
    ],
    inStock: true
  },
  {
    id: 4,
    slug: 'red-panda-socks',
    name: 'Red Panda Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      '/Red-Panda-Socks2.avif',
      'https://ext.same-assets.com/2605587933/1637805690.jpeg',
      '/Red-Panda-Socks1.avif',
    ],
    description: 'Cute Red Panda Socks – perfect for nature lovers! Soft, cozy, and featuring an adorable red panda design.',
    features: [
      'One Size Fits All',
      'Comfort & Quality',
      'Fast Shipping',
      'Easy Returns',
      'Giving Back'
    ],
    inStock: true
  },
  {
    id: 5,
    slug: 'cavalier-dog-socks',
    name: 'Cavalier Dog Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      '/Cavalier-Dog3.avif',
      '/Cavalier-Dog2.avif',
      '/Cavalier-Dog1.avif',
      
    ],
    description: 'Cavalier King Charles Spaniel Socks – for dog lovers! Sweet, cozy, and featuring the cutest puppy design.',
    features: [
      'One Size Fits All',
      'Comfort & Quality',
      'Fast Shipping',
      'Easy Returns',
      'Giving Back'
    ],
    inStock: true
  },
  {
    id: 6,
    slug: 'crocodile-socks',
    name: 'Crocodile Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      '/Crocodile-Socks1.avif',
      
    ],
    description: 'Wild Crocodile Socks – for adventure lovers! Fun, cozy, and featuring a playful croc design.',
    features: [
      'One Size Fits All',
      'Comfort & Quality',
      'Fast Shipping',
      'Easy Returns',
      'Giving Back'
    ],
    inStock: true
  },
  {
    id: 7,
    slug: 'shark-socks',
    name: 'Shark Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      '/Shark-Socks1.avif',
      
    ],
    description: 'Cool Shark Socks – for ocean lovers! Soft, fun, and featuring an awesome shark design.',
    features: [
      'One Size Fits All',
      'Comfort & Quality',
      'Fast Shipping',
      'Easy Returns',
      'Giving Back'
    ],
    inStock: true
  },
  {
    id: 8,
    slug: 'capybara-socks',
    name: 'Capybara Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
  
      '/Capybara-Socks1.avif',

    ],
    description: 'Chill Capybara Socks – the most relaxed socks ever! Soft, cozy, and featuring the cutest capybara design.',
    features: [
      'One Size Fits All',
      'Comfort & Quality',
      'Fast Shipping',
      'Easy Returns',
      'Giving Back'
    ],
    inStock: true,
    comingSoon: false
  },
  {
    id: 9,
    slug: 'koala-socks',
    name: 'Koala Socks',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      '/Koala1.avif',
      
    ],
    description: 'Koala Socks – the most relaxed socks ever! Soft, cozy, and featuring the cutest koala design.',
    features: [
      'One Size Fits All',
      'Comfort & Quality',
      'Fast Shipping',
      'Easy Returns',
      'Giving Back'
    ],
    inStock: true,
    comingSoon: false
  },
  {
    id: 10,
    slug: 'cats-and-dogs-bundle',
    name: 'Cats and Dogs Bundle',
    price: '$39.50',
    originalPrice: '$70.00',
    images: [
      'https://ext.same-assets.com/2605587933/2161150651.jpeg',
      '/Cat-Socks3.avif',
      '/Cavalier-Dog3.avif',
      'https://ext.same-assets.com/2605587933/1257722685.jpeg',
    ],
    description: 'The perfect gift bundle for cat and dog lovers! This bundle includes adorable cat and dog themed socks, beautifully packaged and ready to gift. Perfect for Christmas or any special occasion.',
    features: [
      'One Size Fits All',
      'Comfort & Quality - soft, durable materials',
      'Fast Shipping - 7-10 days',
      'Easy Returns - 30-day hassle-free return',
      'Giving Back - 10% to animal charities',
      'Perfect Gift Packaging Included'
    ],
    inStock: true,
    isBundle: true,
    bundleOptions: {
      '1': { price: 39.50, label: '1 Bundle' },
      '2': { price: 70.00, label: '2 Bundles' },
    },
  },
  {
    id: 11,
    slug: 'sharks-and-crocs-bundle',
    name: 'Sharks and Crocs Bundle',
    price: '$35.00',
    originalPrice: '$70.00',
    images: [
      'https://ext.same-assets.com/2605587933/446626278.jpeg',
      'https://ext.same-assets.com/2605587933/1734010110.png',
      '/Shark-Socks1.avif',
      'https://ext.same-assets.com/2605587933/3054780508.jpeg',
    ],
    description: 'Dive into adventure with our Sharks and Crocs Bundle! This exciting bundle features cool shark and crocodile themed socks, perfect for ocean and adventure lovers.',
    features: [
      'One Size Fits All',
      'Comfort & Quality - soft, durable materials',
      'Fast Shipping - 7-10 days',
      'Easy Returns - 30-day hassle-free return',
      'Giving Back - 10% to animal charities',
      'Perfect Gift Packaging Included'
    ],
    inStock: true,
    isBundle: true,
    bundleOptions: {
      '1': { price: 35.00, label: '1 Bundle' },
      '2': { price: 70.00, label: '2 Bundles' },
    },
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getRelatedProducts = (currentSlug: string, limit: number = 6): Product[] => {
  return products.filter(p => p.slug !== currentSlug).slice(0, limit);
};

export const getAllBundleProducts = (): Product[] => {
  return products.filter(p => p.isBundle);
};

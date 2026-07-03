import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, TrendingUp, Users, Package, ArrowRight } from 'lucide-react';
import api from '@/services/api';
import heroImage from '@/assets/hero-ecommerce.jpg';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  vendor: { fullName: string };
  category: { name: string };
  averageRating: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

// ─── Skeleton Components ───────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border bg-card animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-10" />
        </div>
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="rounded-lg border p-6 animate-pulse">
      <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3" />
      <div className="h-3 bg-muted rounded w-2/3 mx-auto" />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    // ✅ Both API calls run in PARALLEL
    const fetchProducts = async () => {
      try {
        const res = await api.getProducts({ limit: 8 });
        if (res.success) setFeaturedProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
            Sell Smarter. Get Paid Faster.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-light">
              Grow Without Limits.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 animate-slide-up">
            TradeSphere enables businesses to sell online,
            receive secure digital payments, automate order management, and manage payouts—all powered by Nomba's payment infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button variant="hero" size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto">
              <Link to="/shop">
                Start Shopping
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button variant="premium" size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto">
              <Link to="/auth?tab=vendor">
                Become a Vendor
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-16 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TradeSphere?</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We connect customers with amazing vendors, creating a thriving marketplace ecosystem.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Package className="h-8 w-8 text-primary" />,
                bg: 'bg-primary/10',
                title: 'Quality Products',
                desc: 'Carefully curated products from verified vendors with quality guarantees.',
              },
              {
                icon: <Users className="h-8 w-8 text-accent" />,
                bg: 'bg-accent/10',
                title: 'Trusted Community',
                desc: 'Join thousands of satisfied customers and successful vendors in our marketplace.',
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-primary-light" />,
                bg: 'bg-primary-light/10',
                title: 'Easy Growth',
                desc: 'Powerful tools for vendors to grow their business and reach more customers.',
              },
            ].map(({ icon, bg, title, desc }) => (
              <Card
                key={title}
                className="text-center p-6 md:p-8 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="space-y-4 pt-2">
                  <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto`}>
                    {icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Explore our wide range of product categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {isLoadingCategories
              ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
              : categories.map((category) => (
                  <Link key={category._id} to={`/shop?category=${category.slug}`} className="group">
                    <Card className="text-center p-4 md:p-6 hover:shadow-card transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      <CardContent className="space-y-3 pt-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm">{category.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-12 md:mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Featured Products</h2>
              <p className="text-lg md:text-xl text-muted-foreground">
                Discover top-rated products from our marketplace
              </p>
            </div>
            <Button variant="outline" asChild className="self-start shrink-0">
              <Link to="/shop">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingProducts
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="group hover:shadow-card transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={product.imageUrl || '/placeholder.svg'}
                        alt={product.name}
                        loading="lazy"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.category?.name}
                        </Badge>
                        <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                       <span className="text-xl md:text-2xl font-bold text-primary">
                        ₦{product.price.toLocaleString()}
                      </span> 
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">
                            {product.averageRating || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground truncate mr-2">
                          by {product.vendor?.fullName}
                        </span>
                        <Button size="sm" variant="outline" asChild className="shrink-0">
                          <Link to={`/product/${product._id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 md:py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of successful vendors on our platform. Start your online business today
            with our easy-to-use vendor tools and reach customers worldwide.
          </p>
          <Button variant="premium" size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
            <Link to="/auth?tab=vendor">
              Get Started as Vendor
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
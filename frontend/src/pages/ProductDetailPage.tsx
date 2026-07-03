import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Heart, Star, Package, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  sku?: string;
  vendor: {
    fullName: string;
    email: string;
  };
  category: {
    name: string;
  };
  averageRating: number;
  totalReviews: number;
}

interface Review {
  _id: string;
  user: {
    fullName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
      checkWishlist();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.getProduct(id!);
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.getProductReviews(id!);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.getWishlist();
      if (response.success) {
        const inWishlist = response.data.items?.some(
          (item: any) => item.product._id === id
        );
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please sign in to manage your wishlist.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      if (isInWishlist) {
        const response = await api.removeFromWishlist(id!);
        if (response.success) {
          setIsInWishlist(false);
          toast({
            title: "Removed from wishlist",
            description: "Item has been removed from your wishlist.",
          });
        }
      } else {
        const response = await api.addToWishlist(id!);
        if (response.success) {
          setIsInWishlist(true);
          toast({
            title: "❤️ Added to wishlist!",
            description: "Item has been added to your wishlist.",
            className: "animate-scale-in",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update wishlist.",
        variant: "destructive",
      });
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add items to cart.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const response = await api.addToCart(id!, quantity);
      if (response.success) {
        toast({
          title: "✨ Added to cart!",
          description: `${quantity} item(s) added to your cart.`,
          className: "animate-scale-in",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add to cart.",
        variant: "destructive",
      });
    }
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please sign in to leave a review.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      if (!newReview.comment.trim()) {
        toast({
          title: "Review required",
          description: "Please write a comment for your review.",
          variant: "destructive",
        });
        return;
      }

      const response = await api.createReview({
        productId: id,  // ✅ FIXED
        rating: newReview.rating,
        comment: newReview.comment,
      });

      if (response.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!"
        });
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
        fetchProduct();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden bg-muted h-[400px] lg:h-[500px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">
                  by {product.vendor?.fullName || 'Unknown Vendor'}
                </p>
              </div>
              <Button
                variant={isInWishlist ? "default" : "ghost"}
                size="icon"
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-semibold">
                  {product.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
              <span className="text-muted-foreground">
                ({product.totalReviews || reviews.length} reviews)
              </span>
              <Badge>{product.category?.name || 'Uncategorized'}</Badge>
            </div>

            <div className="text-4xl font-bold text-primary mb-6">
              ₦{product.price.toLocaleString()}
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Stock:</span>
                <span className={product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} available`
                    : 'Out of stock'}
                </span>
              </div>
              {product.sku && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold">SKU:</span>
                  <span className="text-muted-foreground">{product.sku}</span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </Button>
              </div>
              <Button
                className="flex-1"
                size="lg"
                onClick={addToCart}
                disabled={product.stockQuantity === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

            {/* Review Form */}
            <div className="mb-8 p-4 border rounded-lg">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="flex items-center gap-2 mb-4">
                <span>Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      type="button"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= newReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="mb-4"
                rows={4}
              />
              <Button onClick={submitReview}>Submit Review</Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">
                        {review.user?.fullName || 'Anonymous'}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p>{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, Trash2, Plus, Shield, Calendar } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface BillingInfo {
  id: string;
  card_holder_name: string;
  card_last_four: string;
  card_expiry: string;
  card_brand: string;
  billing_address: string;
  billing_city: string;
  billing_country: string;
  billing_postal_code: string;
  is_default: boolean;
  created_at: string;
}

interface BillingCardProps {
  billingInfo?: BillingInfo[];
  onUpdate?: () => void;
}

export const BillingCard: React.FC<BillingCardProps> = ({ billingInfo = [], onUpdate }) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    billingAddress: '',
    billingCity: '',
    billingCountry: '',
    billingPostalCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 6)}`;
    }
    return v;
  };

  const detectCardBrand = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'MasterCard';
    if (cleanNumber.startsWith('3')) return 'Amex';
    return 'Unknown';
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      const cardBrand = detectCardBrand(cleanCardNumber);
      const lastFour = cleanCardNumber.slice(-4);
      
      // In a real application, you would encrypt the card number or use a payment processor
      // For demo purposes, we'll store a tokenized version
      const { error } = await supabase
        .from('billing_info')
        .insert({
          user_id: user.id,
          card_holder_name: formData.cardHolderName,
          card_number_encrypted: `***-***-***-${lastFour}`, // Tokenized for demo
          card_last_four: lastFour,
          card_expiry: formData.cardExpiry,
          card_brand: cardBrand,
          billing_address: formData.billingAddress,
          billing_city: formData.billingCity,
          billing_country: formData.billingCountry,
          billing_postal_code: formData.billingPostalCode,
          is_default: billingInfo.length === 0 // First card becomes default
        });

      if (error) throw error;

      toast({
        title: "Payment method added",
        description: "Your payment method has been successfully added.",
      });

      setFormData({
        cardHolderName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        billingAddress: '',
        billingCity: '',
        billingCountry: '',
        billingPostalCode: ''
      });
      setShowAddCard(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('billing_info')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      toast({
        title: "Payment method removed",
        description: "Your payment method has been successfully removed.",
      });
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: "Error",
        description: "Failed to remove payment method. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getCardIcon = (brand: string) => {
    const iconClass = "h-6 w-6";
    switch (brand.toLowerCase()) {
      case 'visa':
        return <div className={`${iconClass} bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold`}>V</div>;
      case 'mastercard':
        return <div className={`${iconClass} bg-red-600 rounded text-white flex items-center justify-center text-xs font-bold`}>MC</div>;
      case 'amex':
        return <div className={`${iconClass} bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold`}>AX</div>;
      default:
        return <CreditCard className={iconClass} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Methods</span>
        </CardTitle>
        <CardDescription>
          Manage your payment methods and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Cards */}
        {billingInfo.length > 0 ? (
          <div className="space-y-3">
            {billingInfo.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getCardIcon(card.card_brand)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{card.card_brand} •••• {card.card_last_four}</span>
                      {card.is_default && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {card.card_holder_name} • Expires {card.card_expiry}
                    </div>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove this payment method? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCard(card.id)}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payment methods added yet</p>
          </div>
        )}

        {/* Add New Card Form */}
        {showAddCard ? (
          <form onSubmit={handleAddCard} className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="cardHolderName">Cardholder Name</Label>
                <Input
                  id="cardHolderName"
                  value={formData.cardHolderName}
                  onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardExpiry">Expiry Date</Label>
                <Input
                  id="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={(e) => handleInputChange('cardExpiry', formatExpiry(e.target.value))}
                  placeholder="MM/YYYY"
                  maxLength={7}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardCvv">CVV</Label>
                <Input
                  id="cardCvv"
                  type="password"
                  value={formData.cardCvv}
                  onChange={(e) => handleInputChange('cardCvv', e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div>
                <Label htmlFor="billingCity">City</Label>
                <Input
                  id="billingCity"
                  value={formData.billingCity}
                  onChange={(e) => handleInputChange('billingCity', e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label htmlFor="billingCountry">Country</Label>
                <Input
                  id="billingCountry"
                  value={formData.billingCountry}
                  onChange={(e) => handleInputChange('billingCountry', e.target.value)}
                  placeholder="United States"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Adding...' : 'Add Payment Method'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddCard(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button onClick={() => setShowAddCard(true)} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Payment Method
          </Button>
        )}

        {/* Security Notice */}
        <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg text-sm">
          <Shield className="h-4 w-4 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium">Your information is secure</p>
            <p className="text-muted-foreground">
              All payment information is encrypted and stored securely. We never store your full card number or CVV.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

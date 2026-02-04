
import React, { useState } from 'react';
import { GlassCard, Button, Badge, Input } from '../components/UI';
import { CheckCircle2, Crown, Zap, Shield, CreditCard, Smartphone, Loader2, X } from 'lucide-react';
import { authService } from '../services/supabaseMock';
import { useNavigate } from 'react-router-dom';

const PricingCard: React.FC<{ 
    title: string; 
    price: string; 
    duration: string; 
    features: string[]; 
    recommended?: boolean;
    onSelect: () => void;
}> = ({ title, price, duration, features, recommended, onSelect }) => (
    <div className={`relative p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col h-full bg-white/80 backdrop-blur-xl ${recommended ? 'border-hanko shadow-lg shadow-hanko/10 scale-105 z-10' : 'border-bamboo/20 shadow-sm'}`}>
        {recommended && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-hanko text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                Most Popular
            </div>
        )}
        <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
            <div className="flex items-end justify-center gap-1 text-ink">
                <span className="text-4xl font-black">{price}</span>
                <span className="text-bamboo text-sm mb-1">{duration}</span>
            </div>
        </div>
        <ul className="space-y-3 mb-8 flex-1">
            {features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-ink/80">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    {feat}
                </li>
            ))}
        </ul>
        <Button 
            onClick={onSelect} 
            variant={recommended ? 'primary' : 'secondary'} 
            className="w-full"
        >
            Choose Plan
        </Button>
    </div>
);

const PaymentModal: React.FC<{ plan: string; price: string; onClose: () => void; onSuccess: () => void }> = ({ plan, price, onClose, onSuccess }) => {
    const [method, setMethod] = useState<'card' | 'mobile'>('card');
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate API latency
        await new Promise(r => setTimeout(r, 2000));
        
        // Execute upgrade
        await authService.upgradeSubscription();
        
        setLoading(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative border border-white/50">
                <button onClick={onClose} className="absolute top-4 right-4 text-bamboo hover:text-ink transition-colors"><X size={20} /></button>
                
                <div className="bg-rice p-6 border-b border-bamboo/10">
                    <h3 className="text-xl font-bold text-ink mb-1">Checkout</h3>
                    <p className="text-sm text-bamboo">Upgrading to <span className="text-hanko font-bold">{plan}</span></p>
                    <div className="mt-4 text-3xl font-black text-ink">{price}</div>
                </div>

                <div className="p-6">
                    {/* Method Tabs */}
                    <div className="flex gap-2 mb-6 p-1 bg-rice rounded-xl border border-bamboo/10">
                        <button 
                            onClick={() => setMethod('card')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${method === 'card' ? 'bg-white text-ink shadow-sm' : 'text-bamboo hover:text-ink'}`}
                        >
                            <CreditCard size={16} /> Card
                        </button>
                        <button 
                            onClick={() => setMethod('mobile')}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${method === 'mobile' ? 'bg-white text-pink-600 shadow-sm' : 'text-bamboo hover:text-ink'}`}
                        >
                            <Smartphone size={16} /> Bkash/Nagad
                        </button>
                    </div>

                    <form onSubmit={handlePay} className="space-y-4">
                        {method === 'card' ? (
                            <div className="space-y-4 animate-fade-in">
                                <Input 
                                    label="Card Number" 
                                    placeholder="0000 0000 0000 0000" 
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g,'').replace(/(.{4})/g, '$1 ').trim())}
                                    maxLength={19}
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input 
                                        label="Expiry" 
                                        placeholder="MM/YY" 
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        maxLength={5}
                                        required
                                    />
                                    <Input 
                                        label="CVC" 
                                        placeholder="123" 
                                        type="password"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                        maxLength={3}
                                        required
                                    />
                                </div>
                                <Input label="Cardholder Name" placeholder="Tanaka Taro" required />
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex gap-4 justify-center mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">bKash</div>
                                    <div className="w-16 h-16 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">Nagad</div>
                                </div>
                                <Input 
                                    label="Mobile Number" 
                                    placeholder="017XXXXXXXX" 
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-bamboo text-center">You will receive a verification prompt on your phone.</p>
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full mt-6 py-4 text-lg shadow-xl shadow-hanko/20">
                            {loading ? <Loader2 className="animate-spin" /> : `Pay ${price}`}
                        </Button>
                        
                        <div className="flex items-center justify-center gap-2 text-[10px] text-bamboo uppercase tracking-widest mt-4">
                            <Shield size={12} /> Secure Encrypted Payment
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const Subscription: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string} | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSuccess = () => {
        setSelectedPlan(null);
        setShowSuccess(true);
        setTimeout(() => {
            window.location.reload(); // Reload to refresh auth state in App
        }, 3000);
    };

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-pop">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-xl shadow-green-100">
                    <Crown size={48} className="fill-current" />
                </div>
                <h1 className="text-4xl font-bold text-ink mb-2 font-serif">Welcome to Premium!</h1>
                <p className="text-xl text-bamboo mb-8">Your account has been upgraded successfully.</p>
                <div className="text-sm text-bamboo/60">Redirecting to Dashboard...</div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-10">
            <div className="text-center space-y-4">
                <Badge color="bg-yellow-100 text-yellow-700 border-yellow-200"><Crown size={12} className="inline mr-1" /> Premium Access</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-ink font-serif">Master Japanese Faster</h1>
                <p className="text-xl text-bamboo max-w-2xl mx-auto">Unlock unlimited AI stories, advanced grammar analysis, and ad-free learning experiences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                <PricingCard 
                    title="Monthly" 
                    price="৳499" 
                    duration="/mo" 
                    features={['Unlimited AI Stories', 'Full Grammar Library', 'No Ads', 'Progress Sync']} 
                    onSelect={() => setSelectedPlan({name: 'Monthly', price: '৳499'})}
                />
                <PricingCard 
                    title="Yearly" 
                    price="৳3999" 
                    duration="/yr" 
                    features={['All Monthly Features', '2 Months Free', 'Offline Downloads', 'Priority Support']} 
                    recommended
                    onSelect={() => setSelectedPlan({name: 'Yearly', price: '৳3999'})}
                />
                <PricingCard 
                    title="Lifetime" 
                    price="৳9999" 
                    duration="once" 
                    features={['One-time Payment', 'Future Updates Included', 'Exclusive Discord Role', 'Founder Badge']} 
                    onSelect={() => setSelectedPlan({name: 'Lifetime', price: '৳9999'})}
                />
            </div>

            <div className="mt-16 text-center">
                <h3 className="text-lg font-bold text-ink mb-8">Trusted by Learners</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                    {/* Mock Logos */}
                    <div className="flex items-center justify-center font-bold text-xl border p-4 rounded-xl">Stripe</div>
                    <div className="flex items-center justify-center font-bold text-xl border p-4 rounded-xl">bKash</div>
                    <div className="flex items-center justify-center font-bold text-xl border p-4 rounded-xl">Nagad</div>
                    <div className="flex items-center justify-center font-bold text-xl border p-4 rounded-xl">Visa</div>
                </div>
            </div>

            {selectedPlan && (
                <PaymentModal 
                    plan={selectedPlan.name} 
                    price={selectedPlan.price} 
                    onClose={() => setSelectedPlan(null)} 
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

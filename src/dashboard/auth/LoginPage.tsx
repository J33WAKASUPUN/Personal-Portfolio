import { useState } from 'react';
import { Rocket, Lock, Mail, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '../utils/authContext';
import PinPad from './PinPad'; // UPDATED: Using the new Calculator-style PinPad
import { toast } from 'sonner';
import Starfield from '@/components/Starfield';

const LoginPage = () => {
  const { login, verifyPattern } = useAuth();
  const [step, setStep] = useState<'email' | 'pin'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPinError, setShowPinError] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(email, password);
      
      if (response.requiresPattern && response.tempToken) {
        setTempToken(response.tempToken);
        setStep('pin');
        toast.success('Credentials verified. Enter Security PIN.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinComplete = async (pin: string) => {
    setIsLoading(true);

    try {
      // Send PIN as pattern to backend
      await verifyPattern(tempToken, pin);
      toast.success('Access Granted. Welcome back, Commander.');
    } catch (error: any) {
      setShowPinError(true);
      toast.error('Access Denied: Invalid PIN.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <Starfield />

      {/* Background glow effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--neon-cyan)/0.1)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--neon-magenta)/0.1)] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-magenta))] mb-4 shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)] animate-float">
            <Rocket className="w-10 h-10 text-background" />
          </div>
          <h1 className="font-orbitron text-3xl font-bold text-neon-gradient mb-2">
            Mission Control
          </h1>
          <p className="text-muted-foreground font-orbitron text-sm">
            {step === 'email' ? 'Initialize secure connection' : 'Security Clearance Required'}
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 border-2 border-[hsl(var(--deep-electric-blue)/0.5)] bg-[hsl(var(--void-black)/0.8)] backdrop-blur-xl">
          {step === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Email Identifier
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                    placeholder="admin@example.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block font-orbitron text-sm uppercase tracking-wider text-[hsl(var(--neon-cyan))] mb-2">
                  Access Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-[hsl(var(--void-black))] border border-[hsl(var(--deep-electric-blue)/0.5)] rounded-lg focus:border-[hsl(var(--neon-cyan))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--neon-cyan)/0.3)] text-foreground font-orbitron transition-all"
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[hsl(var(--neon-cyan))] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--deep-electric-blue))] text-background font-orbitron font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_25px_hsl(var(--neon-cyan)/0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? 'Establishing Link...' : 'Proceed to Step 2'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* PIN Header Icon */}
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--deep-electric-blue)/0.3)] to-[hsl(var(--neon-magenta)/0.2)] flex items-center justify-center animate-pulse">
                  <KeyRound className="w-8 h-8 text-[hsl(var(--neon-cyan))]" />
                </div>
              </div>

              {/* NEW CALCULATOR STYLE PIN PAD */}
              <PinPad
                length={9}
                onComplete={handlePinComplete}
                onBack={() => setStep('email')} // Handles the "Back" action
                disabled={isLoading}
                showError={showPinError}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 font-orbitron opacity-60">
          {step === 'email' ? (
            'SECURE_CONNECTION_ESTABLISHED_V2.0'
          ) : (
            <>
              <Lock className="w-3 h-3 inline mr-1" />
              ENCRYPTED_CHANNEL_ACTIVE
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
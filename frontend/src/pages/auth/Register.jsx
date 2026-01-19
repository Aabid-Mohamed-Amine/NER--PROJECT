import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { User, Lock, Mail, Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ 
    full_name: '', 
    email: '', 
    password: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      // After success, go to login
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Email might be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-brand-black p-4">
      <div className="w-full max-w-md bg-brand-dark p-8 rounded-2xl shadow-2xl border border-white/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-brand-gray">Join to use Arabic NER AI</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-gray mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-brand-gray" />
              <input
                type="text"
                required
                className="w-full bg-brand-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                placeholder="John Doe"
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-gray mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-brand-gray" />
              <input
                type="email"
                required
                className="w-full bg-brand-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                placeholder="name@example.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-gray mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-brand-gray" />
              <input
                type="password"
                required
                className="w-full bg-brand-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-brand-gray text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
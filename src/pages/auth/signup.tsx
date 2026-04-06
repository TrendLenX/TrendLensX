import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEOHead from '@/components/SEO/SEOHead';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Step 1: Create user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: { data: { name: userData.name } }
    });
    
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    
    const supabaseUser = data.user;
    
    // Step 2: Call your API route to sync into Prisma
    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: supabaseUser?.id,
          email: supabaseUser?.email,
          name: userData.name,
          role: 'user'
        }),
      });
      
      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || 'Failed to sync user');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('Network error while syncing user');
      setLoading(false);
      return;
    }
    
    router.push('/auth/signin?message=Account created successfully');
    setLoading(false);
  };
  
  return (
    <>
      <SEOHead title="Sign Up" description="Create your TrendLensX account" />
      {/* Keep your existing JSX form, just call handleSubmit */}
    </>
  );
}
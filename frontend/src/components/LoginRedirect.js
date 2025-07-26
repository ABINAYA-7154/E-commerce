// Create this file at: src/components/LoginRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRedirect = ({ userRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 LoginRedirect component mounting with role:', userRole);
    
    const redirectPath = userRole === 'admin' ? '/admin' : '/dashboard';
    console.log('📍 Navigating to:', redirectPath);
    
    // Use replace to avoid adding to history stack
    navigate(redirectPath, { replace: true });
  }, [navigate, userRole]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px' 
    }}>
      🔄 Redirecting...
    </div>
  );
};

export default LoginRedirect;
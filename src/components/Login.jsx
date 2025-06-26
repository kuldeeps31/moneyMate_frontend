import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);


  const navigate=useNavigate();

  const validateForm = () => {


    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const handleSubmit = async (e) => {
  
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);
  setErrors({});

  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    toast.success('🎉 Login Successful!');
    //console.log(data);

    //if (rememberMe) {
    //  localStorage.setItem('token', data.token);
    //} else {
    //  sessionStorage.setItem('token', data.token);
    //}
    localStorage.setItem('token', data.token);

    navigate('/dashboard');
  } catch (error) {
    setErrors({ general: error.message || 'Invalid credentials. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="brand-section">
        <div className="brand-overlay"></div>
        <img src="src/assets/login_page.jpg" alt="Wholesale Shop" className="brand-image" />
        <div className="brand-content">
          <h1 className="neon-text">MoneyMate</h1>
          <p className="tagline glow">Manage Payments. Grow Trust</p>
          <div className="quote">
            {/*<p className="glow">"Trusted by businesses nationwide"</p>*/}
            <p className="glow">"Quality products at competitive prices"</p>
          </div>
        </div>
      </div>
      
      <div className="login-section">
        <div className="login-card neon-border">
          <div className="login-header">
            <h2 className="neon-text">WELCOME BACK</h2>
            <p className="glow">Sign in to your account</p>
          </div>
          
          {errors.general && <div className="error-message neon-error">{errors.general}</div>}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className={`form-group ${errors.email ? 'error' : ''}`}>
              <label htmlFor="email" className="input-label">EMAIL ADDRESS</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="username"
                required
                className="neon-input"
              />
              {errors.email && <span className="error-text neon-error">{errors.email}</span>}
            </div>
            
            <div className={`form-group ${errors.password ? 'error' : ''}`}>
              <label htmlFor="password" className="input-label">PASSWORD</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="neon-input"
                />
                <button
                  type="button"
                  className="toggle-password "
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-text neon-error">{errors.password}</span>}
            </div>
            
            <div className="form-options">
              <div className="remember-me">
               <input
  type="checkbox"
  id="remember"
  className="neon-checkbox"
  checked={rememberMe}
  onChange={() => setRememberMe(!rememberMe)}
/>
                <label htmlFor="remember" className="glow">Remember me</label>
              </div>
              {/*<a href="/forgot-password" className="forgot-password glow">Forgot password?</a>*/}
            </div>
            
            <button
              type="submit"
              className="login-button neon-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  SIGNING IN...
                </>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>
          
                 </div>
        
        <div className="footer glow">
          <p>© {new Date().getFullYear()} RM WHOLESALE. ALL RIGHTS RESERVED.</p>
          <div className="footer-links">
            <a href="/privacy" className="neon-link">PRIVACY POLICY</a>
            <a href="/terms" className="neon-link">TERMS OF SERVICE</a>
            <a href="/contact" className="neon-link">CONTACT</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
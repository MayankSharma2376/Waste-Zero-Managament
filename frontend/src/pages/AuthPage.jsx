import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, resetBlockedUserFlag } from '../services/api';
import { useBlockedUser } from '../contexts/BlockedUserContext';
import { useUser } from '../contexts/UserContext';


// Loading Spinner Component
const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const EyeIcon = ({ onClick }) => (
  <svg onClick={onClick} className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>

);

const EyeOffIcon = ({ onClick }) => (
    <svg onClick={onClick} className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.112 3.586-5.545 6.89-6.334M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18"></path></svg>
);


// --- Main AuthPage Component ---
export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser: updateBlockedUser, clearBlockedState } = useBlockedUser();
  const { updateUser, fetchUserProfile } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP step toggle
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  // Set the correct tab based on URL
  useEffect(() => {
    setIsLogin(location.pathname !== '/register');
  }, [location.pathname]);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'volunteer',
    skills: [],
    location: '',
    bio: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // IMPROVEMENT: Clear state when switching between Login and Register tabs
  useEffect(() => {
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoginData({ email: '', password: '' });
    setRegisterData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'volunteer',
      skills: [],
      location: '',
      bio: ''
    });
  }, [isLogin]);

  // Handle typing in OTP
  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSkillsChange = (e) => {
    const { value, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      skills: checked ? [...prev.skills, value] : prev.skills.filter(skill => skill !== value)
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: loginData.email,
        password: loginData.password
      });

      setSuccess('Login successful! Redirecting...');
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      // Clear any previous blocked state and update user info
      clearBlockedState();
      resetBlockedUserFlag(); // Reset API interceptor flag
      updateBlockedUser(response.user);
      
      // Update user context with fresh data
      updateUser(response.user);
      // Fetch latest profile data from backend
      fetchUserProfile();

      setTimeout(() => {
        const userRole = response.user?.role;
        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'volunteer') navigate('/volunteer');
        else if (userRole === 'ngo') navigate('/ngo'); // Fixed: lowercase 'ngo'
        else navigate('/');
      }, 1500);

    } catch (error) {
      setError(error.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // IMPROVEMENT: Added client-side password validation
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
        skills: registerData.skills,
        location: registerData.location,
        bio: registerData.bio
      });


      setSuccess('OTP sent to your email. Please verify.');
      setIsOtpStep(true);

    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await authAPI.verifyUser({
        email: registerData.email,
        otp: otpCode,
      });

      setSuccess("Account verified! Redirecting...");
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      
      // Clear any previous blocked state and update user info
      clearBlockedState();
      updateBlockedUser(response.user);
      
      // Update user context with fresh data
      updateUser(response.user);
      // Fetch latest profile data from backend
      fetchUserProfile();

      setTimeout(() => {
        const userRole = response.user?.role;
        if (userRole === "admin") navigate("/admin");
        else if (userRole === "volunteer") navigate("/volunteer");
        else if (userRole === "ngo") navigate("/ngo");
        else navigate("/");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // IMPROVEMENT: `handleResendOtp` calls a dedicated (hypothetical) API endpoint
  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    try {
      // Assumes your API has a dedicated endpoint for resending OTP
      await authAPI.resendOtp({ email: registerData.email });
      setSuccess("New OTP sent to your email.");
    } catch (err) {
      setError("Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel: Branding and Features */}
      <div 
        className="w-full lg:w-1/2 bg-cover bg-center relative hidden lg:block h-screen overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(135deg, rgba(34, 139, 34, 0.85) 0%, rgba(0, 100, 0, 0.75) 50%, rgba(0, 0, 0, 0.6) 100%), url("./Waste.jpg")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-800/60 via-green-900/40 to-black/70"></div>
        <div className="relative z-10 px-6 lg:px-10 py-8 text-white h-full flex flex-col justify-between overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <img src="./recycle.svg" alt="WasteZero Logo" className="w-6 h-6" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent tracking-tight">WasteZero</h1>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold leading-tight tracking-tight">Join the <span className="text-green-300">Recycling</span><br />Revolution</h2>
              <p className="text-gray-100 text-base lg:text-lg leading-relaxed max-w-sm font-light">Connect with a community dedicated to environmental change. Schedule pickups, track your impact, and help build a sustainable future.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 max-w-sm">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center flex-shrink-0"><img src="./calendar.png" alt="calendar" className="w-5 h-5" /></div><div><h3 className="font-semibold text-white text-base leading-tight">Schedule Pickups</h3><p className="text-xs text-gray-200 font-light">Easy waste collection scheduling</p></div></div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0"><img src="./search.png" alt="search" className="w-5 h-5" /></div><div><h3 className="font-semibold text-white text-base leading-tight">Track Impact</h3><p className="text-xs text-gray-200 font-light">Monitor your environmental contribution</p></div></div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0"><img src="./hands.png" alt="hands" className="w-5 h-5" /></div><div><h3 className="font-semibold text-white text-base leading-tight">Volunteer</h3><p className="text-xs text-gray-200 font-light">Join community recycling initiatives</p></div></div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/20">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center"><div className="text-xl font-bold text-green-300">50K+</div><div className="text-xs text-gray-300 font-light">Volunteers</div></div>
              <div className="text-center"><div className="text-xl font-bold text-blue-300">1M+</div><div className="text-xs text-gray-300 font-light">Pickups</div></div>
              <div className="text-center"><div className="text-xl font-bold text-yellow-300">500+</div><div className="text-xs text-gray-300 font-light">Cities</div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Login/Registration Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 dark:bg-gray-900 flex flex-col h-screen">
        <div className="flex-shrink-0 p-4 lg:p-6 pb-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-1 w-full max-w-sm mx-auto">
            <button onClick={() => { setIsLogin(true); setIsOtpStep(false); navigate('/login'); }} className={`w-1/2 p-2 rounded-md font-semibold transition-all ${isLogin ? 'bg-white dark:bg-gray-700 shadow-md text-[#4f685b] dark:text-green-300 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>Login</button>
            <button onClick={() => { setIsLogin(false); setIsOtpStep(false); navigate('/register'); }} className={`w-1/2 p-2 rounded-md font-semibold transition-all ${!isLogin ? 'bg-white dark:bg-gray-700 shadow-md text-[#4f685b] dark:text-green-300 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>Register</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 scrollbar-hide">
          <div className="max-w-lg mx-auto w-full py-4">

            {/* Login Form */}
            {isLogin && !isOtpStep && (
              <>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome back!</h2>
                  <p className="text-gray-500 dark:text-gray-400">Sign in to your WasteZero account</p>
                </div>
                {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
                {success && <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg">{success}</div>}
                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
                    <input id="login-email" type="email" name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Your email" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400" required />
                  </div>
                  <div className="relative">
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Password</label>
                    <input id="login-password" type={showPassword ? "text" : "password"} name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Your password" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400" required />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6">
                      <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                        {showPassword ? <EyeOffIcon onClick={() => setShowPassword(false)} /> : <EyeIcon onClick={() => setShowPassword(true)} />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button 
                      type="button" 
                      onClick={() => navigate('/forgot-password')}
                      className="text-sm text-[#588157] dark:text-green-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#588157] text-white rounded-lg font-bold hover:bg-[#4f685b] focus:ring-2 focus:ring-[#588157] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    {isLoading && <LoadingSpinner />}
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              </>
            )}
            
            {/* Registration Form */}
            {!isLogin && !isOtpStep && (
              <>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create a new account</h2>
                  <p className="text-gray-500 dark:text-gray-400">Fill in your details to join WasteZero</p>
                </div>
                {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
                {success && <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg">{success}</div>}
                <form className="space-y-3 pb-6" onSubmit={handleRegisterSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="register-name" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Full Name</label>
                      <input id="register-name" type="text" name="name" value={registerData.name} onChange={handleRegisterChange} placeholder="Your full name" className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400" required />
                    </div>
                    <div>
                      <label htmlFor="register-email" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
                      <input id="register-email" type="email" name="email" value={registerData.email} onChange={handleRegisterChange} placeholder="Your email" className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="register-location" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Location</label>
                    <input id="register-location" type="text" name="location" value={registerData.location} onChange={handleRegisterChange} placeholder="Your location" className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <label htmlFor="register-password" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Password</label>
                      <input id="register-password" type={showPassword ? "text" : "password"} name="password" value={registerData.password} onChange={handleRegisterChange} placeholder="Create a password" className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400" required />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6">
                        <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                          {showPassword ? <EyeOffIcon onClick={() => setShowPassword(false)} /> : <EyeIcon onClick={() => setShowPassword(true)} />}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <label htmlFor="register-confirmPassword" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Confirm Password</label>
                      <input id="register-confirmPassword" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={registerData.confirmPassword} onChange={handleRegisterChange} placeholder="Confirm your password" className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400" required />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6">
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle confirm password visibility">
                          {showConfirmPassword ? <EyeOffIcon onClick={() => setShowConfirmPassword(false)} /> : <EyeIcon onClick={() => setShowConfirmPassword(true)} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 !mt-1">*Password must be at least 6 characters long</p>
                  <div>
                    <label htmlFor="register-role" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Role</label>
                    <select id="register-role" name="role" value={registerData.role} onChange={handleRegisterChange} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#588157] focus:outline-none appearance-none text-black dark:text-white" required>
                      <option value="volunteer">Volunteer</option>
                      <option value="admin">Admin</option>
                      <option value="ngo">NGO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Skills & Interests</label>
                    <div className="grid grid-cols-2 gap-2 max-h-20 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 scrollbar-hide">
                      {['Waste Collection', 'Recycling Education', 'Community Organizing', 'Environmental Advocacy', 'Data Management', 'Social Media'].map((skill) => (
                        <label key={skill} htmlFor={skill} className="flex items-center space-x-2">
                          <input id={skill} type="checkbox" value={skill} checked={registerData.skills.includes(skill)} onChange={handleSkillsChange} className="form-checkbox text-[#588157] focus:ring-[#588157] w-3 h-3 bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="register-bio" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Bio</label>
                    <textarea id="register-bio" name="bio" value={registerData.bio} onChange={handleRegisterChange} placeholder="Tell us about yourself..." rows="2" className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 resize-none" required></textarea>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#588157] text-white rounded-lg font-bold hover:bg-[#4f685b] focus:ring-2 focus:ring-[#588157] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    {isLoading && <LoadingSpinner />}
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              </>
            )}

            {/* OTP Verification */}
            {isOtpStep && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Enter OTP</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">We've sent a 4-digit verification code to your email address.</p>
                </div>
                {error && <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}
                {success && <div className="p-3 bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg text-sm">{success}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 text-center">Verification Code</label>
                  <div className="flex justify-center gap-3 mb-4">
                    {otp.map((digit, index) => (
                      <input key={index} type="text" maxLength="1" value={digit} ref={(el) => (inputs.current[index] = el)} onChange={(e) => handleChange(e.target.value, index)} onKeyDown={(e) => handleKeyDown(e, index)} className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#588157] focus:border-[#588157] focus:outline-none text-black dark:text-white dark:bg-gray-800" />
                    ))}
                  </div>
                </div>
                <button onClick={handleSubmitOtp} disabled={isLoading} className="w-full py-3 bg-[#588157] text-white rounded-lg font-bold hover:bg-[#4f685b] focus:ring-2 focus:ring-[#588157] focus:outline-none transition-colors flex items-center justify-center">
                  {isLoading && <LoadingSpinner />}
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <button type="button" onClick={handleResendOtp} className="w-full py-2 text-sm text-[#588157] dark:text-green-400 hover:underline mt-2">
                  Resend OTP
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
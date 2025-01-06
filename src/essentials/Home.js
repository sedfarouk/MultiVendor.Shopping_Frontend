import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../authentication/AuthContext';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  LogOutIcon,
  ArrowRightIcon,
} from 'lucide-react';
import Cart from '../lists/Cart';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      delayChildren: 0.3,
      staggerChildren: 0.2 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      damping: 12,
      stiffness: 100 
    }
  }
};

const FeatureCard = ({ icon, title, description, linkTo, linkText }) => (
  <motion.div 
    variants={itemVariants}
    className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-4 overflow-hidden"
  >
    <div className="flex items-center justify-between">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white/20 p-3 rounded-full"
      >
        {icon}
      </motion.div>
      <Link 
        to={linkTo} 
        className="text-blue-200 hover:text-white transition-colors flex items-center gap-1"
      >
        {linkText}
        <ArrowRightIcon size={16} className="opacity-70" />
      </Link>
    </div>
    <div>
      <h4 className="text-xl font-bold text-white mb-2 tracking-wide">{title}</h4>
      <p className="text-white/75 text-sm whitespace-pre-line leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const LoggedOutHome = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white flex items-center justify-center"
    >
      <div className="container mx-auto px-6 py-12 text-center">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400"
        >
          Welcome to Our Platform
        </motion.h1>
        
        <motion.p 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="text-xl text-white/80 max-w-2xl mx-auto mb-10"
        >
          Discover a world of possibilities. Connect, shop, and explore with ease.
        </motion.p>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { 
                delayChildren: 0.3,
                staggerChildren: 0.2 
              }
            }
          }}
          className="flex justify-center space-x-6"
        >
          <motion.div 
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { 
                y: 0, 
                opacity: 1,
                transition: { 
                  type: "spring",
                  damping: 12,
                  stiffness: 100 
                }
              }
            }}
          >
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Log In <ArrowRightIcon size={20} />
            </Link>
          </motion.div>
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { 
                y: 0, 
                opacity: 1,
                transition: { 
                  type: "spring",
                  damping: 12,
                  stiffness: 100 
                }
              }
            }}
          >
            <Link 
              to="/register" 
              className="flex items-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              Sign Up <ArrowRightIcon size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const { authState, dispatch } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authState.isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('https://multivendorapp-user-service.onrender.com/profile', {
          headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            dispatch({ type: 'LOGOUT' });
            throw new Error('Session expired. Please log in again.');
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message || 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authState.token, authState.isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const fetchCart = async () => {
    if (!authState.isAuthenticated) {
      setError('You must be logged in to view your cart.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('https://multivendorapp-user-service.onrender.com/cart', {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      // Assuming there's a function to set the cart state
      // setCart(data); // This line is commented out as it's not defined in this context
    } catch (error) {
      setError(error.message || 'Failed to fetch cart');
    } finally {
      setIsLoading(false);
    }
  };

  if (!authState.isAuthenticated) {
    return <LoggedOutHome />;
  }

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            transition: { 
              repeat: Infinity, 
              duration: 1 
            } 
          }}
          className="text-white text-2xl"
        >
          Loading...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white"
    >
      <div className="container mx-auto px-6 py-12 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 right-0 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
        ></motion.div>

        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-6xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400"
        >
          Welcome, {profile?.name || 'User'}!
      
        </motion.h1>

        <AnimatePresence>
          {profile && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <FeatureCard
                icon={<UserIcon size={24} className="text-white" />}
                title="Your Profile"
                description={`Name: ${profile.name || 'N/A'}\nEmail: ${authState.user.email || 'N/A'}`}
                linkTo="/view-profile"
                linkText="View Profile"
              />
              <FeatureCard
                icon={<HeartIcon size={24} className="text-white" />}
                title="Wishlist"
                description={`Items in Wishlist: ${profile.wishlist?.length || 0}`}
                linkTo="/wishlist"
                linkText="View Wishlist"
              />
              <FeatureCard
                icon={<ShoppingCartIcon size={24} className="text-white" />}
                title="Cart"
                description={`Items in Cart: ${profile.cart?.length || 1}`}
                linkTo="/cart"
                linkText="View Cart"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conditionally render Cart component if logged in */}
        {authState.isAuthenticated && <Cart />}

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition flex items-center justify-center mx-auto gap-2"
          >
            <LogOutIcon size={20} />
            Logout
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mt-6 bg-red-500/20 border border-red-500 text-red-400 text-center p-4 rounded-md"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Home;
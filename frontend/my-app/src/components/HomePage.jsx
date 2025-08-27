import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-vh-100 position-relative overflow-hidden" 
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #38b2ac 100%)',
           fontFamily: "'Inter', sans-serif"
         }}>
      
      {/* Animated Background Elements */}
      <motion.div
        className="position-absolute w-100 h-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
        }}
      />
      
      {/* Floating Geometric Shapes */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="position-absolute"
        style={{
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          zIndex: 1
        }}
      />
      
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="position-absolute"
        style={{
          top: '70%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'rgba(255,255,255,0.08)',
          transform: 'rotate(45deg)',
          zIndex: 1,
          animationDelay: '2s'
        }}
      />

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="position-absolute"
        style={{
          top: '30%',
          right: '5%',
          width: '60px',
          height: '120px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '30px',
          zIndex: 1,
          animationDelay: '1s'
        }}
      />

      <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: y1 }}
        >
          <motion.div variants={itemVariants} className="mb-4">
            <motion.div
              className="d-inline-block mb-3"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.8 }}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '120px',
                  height: '120px',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <i className="bi bi-database-fill text-white" style={{ fontSize: '3rem' }}></i>
              </div>
            </motion.div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="display-1 fw-bold text-white mb-4"
            style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Data Central
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="lead text-white-50 mb-5 mx-auto"
            style={{ maxWidth: '600px', fontSize: '1.3rem' }}
          >
            Transform your institution with our cutting-edge management platform. 
            Seamlessly handle student records and employee data with intelligence and style.
          </motion.p>
        </motion.div>

        {/* Management Cards */}
        <motion.div 
          className="row g-4 justify-content-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: y2 }}
        >
          {/* Student Management Card */}
          <motion.div className="col-lg-5 col-md-6">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="card h-100 border-0 shadow-lg position-relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px'
              }}
            >
              {/* Card Gradient Overlay */}
              <div 
                className="position-absolute w-100"
                style={{
                  top: 0,
                  left: 0,
                  height: '5px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)'
                }}
              />
              
              <div className="card-body p-5 text-center">
                <motion.div 
                  className="mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div 
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '100px',
                      height: '100px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    <i className="bi bi-people-fill text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </motion.div>

                <h3 className="card-title h2 fw-bold mb-3" style={{ color: '#2d3748' }}>
                  Student Management
                </h3>
                
                <p className="card-text text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                  Empower your academic excellence with comprehensive student record management, 
                  real-time analytics, and seamless communication tools.
                </p>

                <motion.button
                  className="btn btn-lg px-4 py-3 rounded-pill border-0 fw-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => console.log('Navigate to students')}
                >
                  Manage Students
                  <motion.i 
                    className="bi bi-arrow-right ms-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  />
                </motion.button>

                {/* Floating Elements */}
                <motion.div
                  className="position-absolute"
                  style={{ top: '20px', right: '20px', opacity: 0.1 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <i className="bi bi-mortarboard-fill" style={{ fontSize: '3rem', color: '#667eea' }}></i>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Employee Management Card */}
          <motion.div className="col-lg-5 col-md-6">
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="card h-100 border-0 shadow-lg position-relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px'
              }}
            >
              {/* Card Gradient Overlay */}
              <div 
                className="position-absolute w-100"
                style={{
                  top: 0,
                  left: 0,
                  height: '5px',
                  background: 'linear-gradient(90deg, #38b2ac, #4299e1)'
                }}
              />
              
              <div className="card-body p-5 text-center">
                <motion.div 
                  className="mb-4"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div 
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '100px',
                      height: '100px',
                      background: 'linear-gradient(135deg, #38b2ac, #4299e1)',
                      boxShadow: '0 10px 30px rgba(56, 178, 172, 0.4)'
                    }}
                  >
                    <i className="bi bi-person-workspace text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                </motion.div>

                <h3 className="card-title h2 fw-bold mb-3" style={{ color: '#2d3748' }}>
                  Employee Management
                </h3>
                
                <p className="card-text text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                  Streamline your workforce operations with advanced HR tools, 
                  performance tracking, and intelligent resource allocation systems.
                </p>

                <motion.button
                  className="btn btn-lg px-4 py-3 rounded-pill border-0 fw-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #38b2ac, #4299e1)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(56, 178, 172, 0.3)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 12px 35px rgba(56, 178, 172, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => console.log('Navigate to employees')}
                >
                  Manage Employees
                  <motion.i 
                    className="bi bi-arrow-right ms-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  />
                </motion.button>

                {/* Floating Elements */}
                <motion.div
                  className="position-absolute"
                  style={{ top: '20px', right: '20px', opacity: 0.1 }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <i className="bi bi-briefcase-fill" style={{ fontSize: '3rem', color: '#38b2ac' }}></i>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="row mt-5 pt-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="col-12 text-center">
            <motion.div className="row g-4">
              {[
                { number: "10K+", label: "Students Managed", icon: "bi-people" },
                { number: "2K+", label: "Employees Tracked", icon: "bi-person-check" },
                { number: "99.9%", label: "Uptime Reliability", icon: "bi-shield-check" },
                { number: "24/7", label: "Support Available", icon: "bi-headset" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="col-lg-3 col-md-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="text-center text-white">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="d-inline-block mb-3"
                    >
                      <i className={`bi ${stat.icon}`} style={{ fontSize: '2rem', opacity: 0.8 }}></i>
                    </motion.div>
                    <motion.h3 
                      className="display-4 fw-bold mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 100, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-white-50 mb-0">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Add Bootstrap Icons CDN link to head */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css" 
        rel="stylesheet"
      />
      
      {/* Add Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" 
        rel="stylesheet"
      />

      {/* Add Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" 
        rel="stylesheet"
      />
    </div>
  );
};

export default HomePage;
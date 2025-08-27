
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import './Navbar.css'; // Make sure this CSS file exists and is styled

const AnimatedNavbar = () => {
  // Animation for the entire navbar container to slide in
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Reusable animation for interactive elements
  const itemVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <Navbar variant="dark" expand="lg" className="navbar-glass" fixed="top">
        <Container>
          {/* ✅ Animated Brand/Logo that links to home (stays on the left) */}
          <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
            <Navbar.Brand as={Link} to="/">
              <i className="bi bi-building-fill me-2"></i>
              Data Portal
            </Navbar.Brand>
          </motion.div>

          {/* ✅ Toggle button for mobile */}
          <Navbar.Toggle aria-controls="navbar-nav" />

          {/* ✅ Collapsible navigation links */}
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/home-page" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/employees-data">
                Employees Data
              </Nav.Link>
              <Nav.Link as={NavLink} to="/">
                Students Data
              </Nav.Link>
              <Nav.Link as={NavLink} to="/blogs">
                Blogs
              </Nav.Link>
              <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
                <Button className="btn-gradient ms-3">Login</Button>
              </motion.div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.div>
  );
};

export default AnimatedNavbar;

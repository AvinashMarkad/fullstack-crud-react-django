import React, { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Modal, Button, Spinner, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Blogs.css";

const BLOGS_API_URL = "http://127.0.0.1:8000/api/v1/blogs/";
const COMMENTS_API_URL = "http://127.0.0.1:8000/api/v1/comments/";

export default function Blogs() {
  // Blog State
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState({ blog_title: "", blog_body: "" });

  // Comment State
  const [editingComment, setEditingComment] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  // --- Blog Functions ---
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(BLOGS_API_URL);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.blog_title || !newBlog.blog_body) {
      toast.warn("Please fill in all blog fields.");
      return;
    }
    try {
      await axios.post(BLOGS_API_URL, newBlog);
      toast.success("Blog added successfully!");
      setNewBlog({ blog_title: "", blog_body: "" });
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to add blog.");
    }
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  const handleSaveBlog = async () => {
    try {
      await axios.put(`${BLOGS_API_URL}${selectedBlog.id}/`, selectedBlog);
      toast.success("Blog updated successfully!");
      setShowBlogModal(false);
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to update blog.");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${BLOGS_API_URL}${id}/`);
      toast.info("Blog deleted.");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog.");
    }
  };

  // --- Comment Functions ---
  const handleAddComment = async (e, blogId) => {
    e.preventDefault();
    if (!newCommentText.trim()) {
        toast.warn("Comment cannot be empty.");
        return;
    }
    try {
        const newComment = { comment: newCommentText, blog: blogId };
        await axios.post(COMMENTS_API_URL, newComment);
        toast.success("Comment added!");
        setNewCommentText("");
        fetchBlogs(); // Refresh all data to show the new comment
    } catch (error) {
        toast.error("Failed to add comment.");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setShowCommentModal(true);
  };

  const handleUpdateComment = async () => {
    try {
        await axios.put(`${COMMENTS_API_URL}${editingComment.id}/`, editingComment);
        toast.success("Comment updated!");
        setShowCommentModal(false);
        fetchBlogs();
    } catch (error) {
        toast.error("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`${COMMENTS_API_URL}${id}/`);
      toast.info("Comment deleted.");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  // --- Modal Control ---
  const closeModals = () => {
    setShowBlogModal(false);
    setShowCommentModal(false);
    setSelectedBlog(null);
    setEditingComment(null);
  };

  // --- Animation Variants ---
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" /> <h4 className="ms-3">Loading Blogs...</h4>
      </div>
    );
  }

  return (
    <div className="blogs-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="header-container text-center">
        <h1 className="display-4 fw-bold">Blog Management</h1>
        <p className="lead">Create, share, and manage your blog posts.</p>
      </div>

      <Accordion className="mb-4 shadow-sm">
        <Accordion.Item eventKey="0">
          <Accordion.Header><i className="bi bi-pencil-square me-2"></i> Create New Blog</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleAddBlog}>
              <Form.Control type="text" placeholder="Blog Title" value={newBlog.blog_title} onChange={(e) => setNewBlog({ ...newBlog, blog_title: e.target.value })} required className="mb-3" />
              <Form.Control as="textarea" placeholder="Blog Content" rows="4" value={newBlog.blog_body} onChange={(e) => setNewBlog({ ...newBlog, blog_body: e.target.value })} required className="mb-3" />
              <Button type="submit" className="btn-gradient">Publish Blog</Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <motion.div className="row g-4" variants={containerVariants} initial="hidden" animate="visible">
        <AnimatePresence>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <motion.div key={blog.id} className="col-lg-6" variants={itemVariants} exit={{ opacity: 0, scale: 0.95 }}>
                <div className="card h-100 blog-card">
                  <div className="card-body d-flex flex-column">
                    <div>
                      <h4 className="card-title">{blog.blog_title}</h4>
                      <p className="card-text">{blog.blog_body}</p>
                    </div>
                    <hr />
                    <div className="comment-section mt-auto">
                      <h6 className="mb-3">Comments ({blog.comments.length})</h6>
                      <div className="comment-list">
                        {blog.comments.map(comment => (
                          <div key={comment.id} className="comment-item">
                            <span>{comment.comment}</span>
                            <div className="comment-actions">
                              <Button variant="link" size="sm" onClick={() => handleEditComment(comment)}><i className="bi bi-pencil-fill"></i></Button>
                              <Button variant="link" size="sm" className="text-danger" onClick={() => handleDeleteComment(comment.id)}><i className="bi bi-trash-fill"></i></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {blog.comments.length === 0 && <p className="text-muted small">No comments yet.</p>}
                      <Form onSubmit={(e) => handleAddComment(e, blog.id)} className="add-comment-form">
                        <Form.Control type="text" placeholder="Add a comment..." value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} required />
                        <Button type="submit" className="btn-gradient">Post</Button>
                      </Form>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-0 text-end pb-3">
                    <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditBlog(blog)}><i className="bi bi-pencil me-1"></i>Edit</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBlog(blog.id)}><i className="bi bi-trash me-1"></i>Delete</Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-12 text-center text-muted mt-5">
              <h4>No blogs found.</h4><p>Why not create the first one?</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Blog Edit Modal */}
      <Modal show={showBlogModal} onHide={closeModals} centered>
        <Modal.Header closeButton><Modal.Title>Edit Blog</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedBlog && (
            <>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={selectedBlog.blog_title} onChange={(e) => setSelectedBlog({ ...selectedBlog, blog_title: e.target.value })} className="mb-3" />
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows="5" value={selectedBlog.blog_body} onChange={(e) => setSelectedBlog({ ...selectedBlog, blog_body: e.target.value })} />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModals}>Cancel</Button>
          <Button className="btn-gradient" onClick={handleSaveBlog}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Comment Edit Modal */}
      <Modal show={showCommentModal} onHide={closeModals} centered>
        <Modal.Header closeButton><Modal.Title>Edit Comment</Modal.Title></Modal.Header>
        <Modal.Body>
          {editingComment && (
            <Form.Control as="textarea" rows="3" value={editingComment.comment} onChange={(e) => setEditingComment({ ...editingComment, comment: e.target.value })} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModals}>Cancel</Button>
          <Button className="btn-gradient" onClick={handleUpdateComment}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}




// .................................................................................................................
// .................................................................................................................


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Accordion, Modal, Button, Spinner } from "react-bootstrap";
// // eslint-disable-next-line no-unused-vars
// import { motion, AnimatePresence } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./Blogs.css"; // Using the new CSS file

// const API_URL = "http://127.0.0.1:8000/api/v1/blogs/";

// export default function Blogs() {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBlog, setSelectedBlog] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [newBlog, setNewBlog] = useState({ blog_title: "", blog_body: "" });

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   const fetchBlogs = async () => {
//     try {
//       const response = await axios.get(API_URL);
//       setBlogs(response.data);
//     } catch (error) {
//       console.error("Error fetching blogs:", error);
//       toast.error("Failed to fetch blogs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddBlog = async (e) => {
//     e.preventDefault();
//     if (!newBlog.blog_title || !newBlog.blog_body) {
//       toast.warn("Please fill in all fields.");
//       return;
//     }
//     try {
//       await axios.post(API_URL, newBlog);
//       toast.success("Blog added successfully!");
//       setNewBlog({ blog_title: "", blog_body: "" });
//       fetchBlogs();
//     } catch (error) {
//       console.error("Error adding blog:", error);
//       toast.error("Failed to add blog.");
//     }
//   };

//   const handleEdit = (blog) => {
//     setSelectedBlog(blog);
//     setShowModal(true);
//   };
//   const handleSave = async () => {
//     try {
//       await axios.put(`${API_URL}${selectedBlog.id}/`, selectedBlog);
//       toast.success("Blog updated successfully!");
//       setShowModal(false);
//       fetchBlogs();
//     } catch (error) {
//       console.error("Error updating blog:", error);
//       toast.error("Failed to update blog.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this blog?")) return;
//     try {
//       await axios.delete(`${API_URL}${id}/`);
//       toast.info("Blog deleted.");
//       fetchBlogs();
//     } catch (error) {
//       console.error("Error deleting blog:", error);
//       toast.error("Failed to delete blog.");
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedBlog(null);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1 },
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
//         <Spinner animation="border" variant="primary" />
//         <h4 className="ms-3">Loading Blogs...</h4>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid my-5">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

//       <div className="header-container text-center">
//         <h1 className="display-4 fw-bold">Blog Management</h1>
//         <p className="lead">Create, share, and manage your blog posts.</p>
//       </div>

//       <Accordion className="mb-4 shadow-sm">
//         <Accordion.Item eventKey="0">
//           <Accordion.Header>
//             <i className="bi bi-pencil-square me-2"></i> Create New Blog
//           </Accordion.Header>
//           <Accordion.Body>
//             <form onSubmit={handleAddBlog}>
//               <div className="mb-3">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Blog Title"
//                   value={newBlog.blog_title}
//                   onChange={(e) => setNewBlog({ ...newBlog, blog_title: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <textarea
//                   className="form-control"
//                   placeholder="Blog Content"
//                   rows="4"
//                   value={newBlog.blog_body}
//                   onChange={(e) => setNewBlog({ ...newBlog, blog_body: e.target.value })}
//                   required
//                 ></textarea>
//               </div>
//               <Button type="submit" className="btn-gradient">Publish Blog</Button>
//             </form>
//           </Accordion.Body>
//         </Accordion.Item>
//       </Accordion>

//       <motion.div className="row g-4" variants={containerVariants} initial="hidden" animate="visible">
//         <AnimatePresence>
//           {blogs.length > 0 ? (
//             blogs.map((blog) => (
//               <motion.div key={blog.id} className="col-12" variants={itemVariants} exit={{ opacity: 0, scale: 0.95 }}>
//                 <div className="card h-100 blog-card">
//                   <div className="card-body">
//                     <h4 className="card-title">{blog.blog_title}</h4>
//                     <p className="card-text">{blog.blog_body}</p>
                    
//                     <hr />

//                     <div className="comment-section">
//                       <h6 className="mb-3">Comments ({blog.comments.length})</h6>
//                       {blog.comments.length > 0 ? (
//                         blog.comments.map(comment => (
//                           <div key={comment.id} className="comment-item">
//                             {comment.comment}
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-muted small">No comments yet.</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="card-footer bg-transparent border-0 text-end pb-3">
//                     <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEdit(blog)}>
//                       <i className="bi bi-pencil me-1"></i>Edit
//                     </Button>
//                     <Button variant="outline-danger" size="sm" onClick={() => handleDelete(blog.id)}>
//                       <i className="bi bi-trash me-1"></i>Delete
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))
//           ) : (
//             <div className="col-12 text-center text-muted mt-5">
//               <h4>No blogs found.</h4>
//               <p>Why not create the first one?</p>
//             </div>
//           )}
//         </AnimatePresence>
//       </motion.div>

//       <Modal show={showModal} onHide={closeModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Blog</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedBlog && (
//             <>
//               <div className="mb-3">
//                 <label className="form-label">Title</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={selectedBlog.blog_title}
//                   onChange={(e) => setSelectedBlog({ ...selectedBlog, blog_title: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Content</label>
//                 <textarea
//                   className="form-control"
//                   rows="5"
//                   value={selectedBlog.blog_body}
//                   onChange={(e) => setSelectedBlog({ ...selectedBlog, blog_body: e.target.value })}
//                 />
//               </div>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={closeModal}>Cancel</Button>
//           <Button className="btn-gradient" onClick={handleSave}>Save Changes</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

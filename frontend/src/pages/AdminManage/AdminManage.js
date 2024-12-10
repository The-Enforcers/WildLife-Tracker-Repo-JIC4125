import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tab,
  Tabs,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import { useSnackbar } from "../../components/SnackBar/SnackBar";
import { Link } from "react-router-dom";
import userAvatar from "../../assets/Avatar.png";

const AdminManage = () => {
  const [users, setUsers] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPagePosts, setCurrentPagePosts] = useState(1);
  const [totalPagesUsers, setTotalPagesUsers] = useState(1);
  const [totalPagesPosts, setTotalPagesPosts] = useState(1);
  const [totalResultsUsers, setTotalResultsUsers] = useState(0);
  const [totalResultsPosts, setTotalResultsPosts] = useState(0);
  const [searchQueryUsers, setSearchQueryUsers] = useState("");
  const [searchQueryPosts, setSearchQueryPosts] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const showSnackbar = useSnackbar();

  const fetchUsers = async (page = 1) => {
    try {
      const query = `page=${page}&search=${searchQueryUsers}&role=${selectedRole}`;
      const response = await fetch(
        `https://localhost:5001/api/admin/users?${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
      setTotalPagesUsers(data.pagination.totalPages);
      setTotalResultsUsers(data.pagination.totalResults);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchReportedPosts = async (page = 1) => {
    try {
      const query = `page=${page}&search=${searchQueryPosts}`;
      const response = await fetch(
        `https://localhost:5001/api/admin/reported-posts?${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch reported posts");
      const data = await response.json();
      console.log(data);
      setReportedPosts(
        data.posts.sort((a, b) => b.reportCount - a.reportCount)
      );
      setTotalPagesPosts(data.pagination.totalPages);
      setTotalResultsPosts(data.pagination.totalResults);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (tabValue === 0) fetchUsers(currentPageUsers);
    else if (tabValue === 1) fetchReportedPosts(currentPagePosts);
    // eslint-disable-next-line
  }, [
    tabValue,
    currentPageUsers,
    currentPagePosts,
    searchQueryUsers,
    searchQueryPosts,
    selectedRole,
  ]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await fetch(`https://localhost:5001/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      fetchUsers(currentPageUsers);
      showSnackbar(`User role updated to ${newRole}`, "success");
    } catch (error) {
      showSnackbar("Failed to update user role", "error");
      console.error(error.message);
    }
  };

  const handleSearchChangeUsers = (e) => setSearchQueryUsers(e.target.value);
  const handleSearchChangePosts = (e) => setSearchQueryPosts(e.target.value);
  const handleRoleFilterChange = (e) => setSelectedRole(e.target.value);

  const handlePageChangeUsers = (event, value) => {
    setCurrentPageUsers(value);
    fetchUsers(value);
  };

  const handlePageChangePosts = (event, value) => {
    setCurrentPagePosts(value);
    fetchReportedPosts(value);
  };

  const handleBanUser = async (userId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to ban the author of this post?"
    );

    if (!isConfirmed) {
      return; // Exit if the user cancels
    }

    try {
      const response = await fetch(
        `https://localhost:5001/api/admin/users/${userId}/ban`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to ban user");
      fetchUsers(currentPageUsers);
      showSnackbar("User banned successfully", "success");
    } catch (err) {
      showSnackbar("Failed to ban user", "error");
      console.error(err.message);
    }
  };

  // eslint-disable-next-line
  const handleUnbanUser = async (userId) => {
    try {
      const response = await fetch(
        `https://localhost:5001/api/admin/users/${userId}/unban`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to unban user");
      fetchUsers(currentPageUsers);
      showSnackbar("User unbanned successfully", "success");
    } catch (err) {
      showSnackbar("Failed to unban user", "error");
      console.error(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!isConfirmed) {
      return; // Exit if the user cancels
    }

    try {
      const response = await fetch(
        `https://localhost:5001/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete post");
      fetchReportedPosts(currentPagePosts);
      showSnackbar("Post deleted successfully", "success");
    } catch (err) {
      showSnackbar("Failed to delete post", "error");
      console.error(err.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box width={"75%"}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard
        </Typography>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
        >
          <Tab label="User Management" />
          <Tab label="Reported Animal Profiles" />
        </Tabs>

        {/* User Management */}
        {tabValue === 0 && (
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <TextField
                  label="Search"
                  fullWidth
                  value={searchQueryUsers}
                  onChange={handleSearchChangeUsers}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={selectedRole}
                    onChange={handleRoleFilterChange}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="banned">Banned</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TableContainer style={{ maxHeight: "450px", overflow: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <img
                            src={
                              user.picture || userAvatar
                            }
                            alt={`${user.displayName}'s profile`}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <Typography
                            component="a"
                            href={`/user/${user._id}`}
                            style={{
                              textDecoration: "none",
                              color: "black",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.textDecoration = "none";
                            }}
                          >
                            {user.displayName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                        >
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                          <MenuItem value="banned">Banned</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination and Results below */}
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={totalPagesUsers}
                page={currentPageUsers}
                onChange={handlePageChangeUsers}
                color="primary"
              />
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <Typography variant="h6">
                {totalResultsUsers} results found
              </Typography>
            </Box>
          </Box>
        )}

        {/* Reported Posts Management */}
        {tabValue === 1 && (
          <Box mt={2}>
            <TextField
              label="Search"
              fullWidth
              value={searchQueryPosts}
              onChange={handleSearchChangePosts}
            />
            <TableContainer style={{ maxHeight: "450px", overflow: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Author</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Report Count
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Reporters</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {reportedPosts.map((post) => (
                    <TableRow key={post._id}>
                      {/* Ensure key is unique */}
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Link to={`/posts/${post._id}`}>
                            <img
                              src={
                                `https://${window.location.hostname}:5001/api/posts/image/${post.postImage}` ||
                                "https://via.placeholder.com/60"
                              }
                              alt={`${post.title}`}
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: "5px",
                                marginRight: "10px",
                              }}
                            />
                          </Link>
                          <Link
                            to={`/posts/${post._id}`}
                            style={{
                              textDecoration: "none",
                              color: "black",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.textDecoration = "none";
                            }}
                          >
                            {post.title}
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Link to={`/user/${post.authorId._id}`}>
                            <img
                              src={
                                post.authorImage ||
                                userAvatar
                              }
                              alt={`${post.authorId.displayName}'s profile`}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                marginRight: "10px",
                              }}
                            />
                          </Link>
                          <Link
                            to={`/user/${post.authorId._id}`}
                            style={{
                              textDecoration: "none",
                              color: "black",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.textDecoration = "none";
                            }}
                          >
                            {post.authorId.displayName}
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell>{post.reportCount}</TableCell>
                      <TableCell>
                        <Box>
                          {post.reports.map((reporter, index) => (
                            <Box
                              key={reporter.userId || `anonymous-${index}`}
                              display="flex"
                              alignItems="center"
                              mb={1}
                            >
                              {reporter.userId ? ( 
                                <Link
                                  to={`/user/${reporter.userId}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.textDecoration = "underline";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.textDecoration = "none";
                                  }}
                                >
                                  <Box display="flex" alignItems="center">
                                    <img
                                      src={
                                        reporter.picture ||
                                        userAvatar
                                      }
                                      alt={`${reporter.name}'s profile`}
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                      }}
                                    />
                                    {reporter.name}
                                  </Box>
                                </Link>
                              ) : (
                                <Box display="flex" alignItems="center">
                                  <img
                                    src={userAvatar}
                                    alt="Anonymous profile"
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "50%",
                                      marginRight: "10px",
                                    }}
                                  />
                                  <Typography color="textSecondary">
                                    Anonymous
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ))}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          fullWidth
                          color="error"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Delete
                        </Button>
                        <Box mt={1}>
                          <Button
                            variant="outlined"
                            fullWidth
                            color="error"
                            style={{
                              borderRadius: "5px",
                              border: "1px error solid",
                            }}
                            onClick={() => handleBanUser(post.authorId._id)}
                          >
                            Ban
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination and Results below */}
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination
                count={totalPagesPosts}
                page={currentPagePosts}
                onChange={handlePageChangePosts}
                color="primary"
              />
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <Typography variant="h6">
                {totalResultsPosts} results found
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminManage;

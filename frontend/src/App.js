import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage";
import UnifiedLogin from "./components/UnifiedLogin";
import AdminLogin from "./components/AdminLogin";
import EmployeeLogin from "./components/EmployeeLogin";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import HRDashboard from "./components/HRDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import MyTasks from "./components/MyTasks";
import RequestLeave from "./components/RequestLeave";
import MyAttendance from "./components/MyAttendance";
import EmployeeProfile from "./components/EmployeeProfile";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import HRLeaveRequests from "./components/HRLeaveRequests";
import HRTaskManagement from "./components/HRTaskManagement";
import HRAttendanceReports from "./components/HRAttendanceReports";
import AdminSystemSettings from "./components/AdminSystemSettings";
import AdminAuditLogs from "./components/AdminAuditLogs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Global.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />

                    <Routes>
                        <Route path="/" element={<UnifiedLogin />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/employee-login" element={<EmployeeLogin />} />

                        <Route
                            path="/admin-dash"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/hr-dash"
                            element={
                                <ProtectedRoute requiredRole="HR">
                                    <HRDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <AnalyticsDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/employee-dash"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYEE">
                                    <EmployeeDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/list"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <EmployeeList />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/add"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <EmployeeForm />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/edit/:id"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <EmployeeForm />
                                </ProtectedRoute>
                            }
                        />

                        {/* Employee Routes */}
                        <Route
                            path="/my-tasks"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYEE">
                                    <MyTasks />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/request-leave"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYEE">
                                    <RequestLeave />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/my-attendance"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYEE">
                                    <MyAttendance />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYEE">
                                    <EmployeeProfile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/notifications"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYEE">
                                    <Notifications />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute requiredRole="EMPLOYEE">
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />

                        {/* HR Routes */}
                        <Route
                            path="/employees"
                            element={
                                <ProtectedRoute requiredRole="HR">
                                    <EmployeeList />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/add-employee"
                            element={
                                <ProtectedRoute requiredRole="HR">
                                    <EmployeeForm />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/tasks"
                            element={
                                <ProtectedRoute requiredRole="HR">
                                    <HRTaskManagement />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/leave-requests"
                            element={
                                <ProtectedRoute requiredRole="HR">
                                    <HRLeaveRequests />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/attendance"
                            element={
                                <ProtectedRoute requiredRole="HR">
                                    <HRAttendanceReports />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/reports"
                            element={
                                <ProtectedRoute requiredRole="HR">
                                    <HRAttendanceReports />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/departments"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/system"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <AdminSystemSettings />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/audit"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <AdminAuditLogs />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

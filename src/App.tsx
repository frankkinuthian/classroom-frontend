import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/dashboard";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Home,
  UserPlus,
  Users,
} from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import ClassList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import SubjectsShow from "./pages/subjects/show";
import ClassesShow from "./pages/classes/show";
import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentsShow from "./pages/departments/show";
import EnrollmentsList from "./pages/enrollments/list";
import EnrollmentsCreate from "./pages/enrollments/create";
import EnrollmentsShow from "./pages/enrollments/show";
import FacultyList from "./pages/faculty/list";
import FacultyShow from "./pages/faculty/show";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import { authProvider } from "./providers/auth";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "T3UKAn-Hjr93H-ajCL6z",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Home", icon: <Home /> },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  show: "/subjects/show/:id",
                  meta: { label: "Subjects", icon: <BookOpen /> },
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  show: "/classes/show/:id",
                  meta: { label: "Classes", icon: <GraduationCap /> },
                },
                {
                  name: "departments",
                  list: "/departments",
                  create: "/departments/create",
                  show: "/departments/show/:id",
                  meta: { label: "Departments", icon: <Building2 /> },
                },
                {
                  name: "enrollments",
                  list: "/enrollments",
                  create: "/enrollments/create",
                  show: "/enrollments/show/:id",
                  meta: { label: "Enrollments", icon: <UserPlus /> },
                },
                {
                  name: "users",
                  list: "/faculty",
                  show: "/faculty/show/:id",
                  meta: { label: "Faculty", icon: <Users /> },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                <Route
                  element={
                    <Authenticated
                      key="protected-pages"
                      fallback={<Navigate to="/login" replace />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<Dashboard />} />

                  {/* Subjects */}
                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>

                  {/* Classes */}
                  <Route path="classes">
                    <Route index element={<ClassList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>

                  {/* Departments */}
                  <Route path="departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="show/:id" element={<DepartmentsShow />} />
                  </Route>

                  {/* Enrollments */}
                  <Route path="enrollments">
                    <Route index element={<EnrollmentsList />} />
                    <Route path="create" element={<EnrollmentsCreate />} />
                    <Route path="show/:id" element={<EnrollmentsShow />} />
                  </Route>

                  {/* Faculty */}
                  <Route path="faculty">
                    <Route index element={<FacultyList />} />
                    <Route path="show/:id" element={<FacultyShow />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

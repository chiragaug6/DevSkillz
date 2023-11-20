import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AboutUs from "./Pages/AboutUs";
import NotFoundPage from "./Pages/NotFoundPage";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import CourseList from "./Pages/Courses/CourseList";
import Contact from "./Pages/Contact";
import CourseDescription from "./Pages/Courses/CourseDescription";
import Denied from "./Pages/Denied";
import CreateCourse from "./Pages/Courses/CreateCourse";
import RequireAuth from "./Components/Auth/RequireAuth";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/about" element={<AboutUs />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/courses" element={<CourseList />}></Route>
        <Route
          path="course/description"
          element={<CourseDescription />}
        ></Route>

        {/* Requires authentication with the role "ADMIN" */}
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          {/* Protected Route: Create Course Page */}
          <Route path="/course/create" element={<CreateCourse />}></Route>
        </Route>

        <Route path="/denied" element={<Denied />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </>
  );
};

export default App;

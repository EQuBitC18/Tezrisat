// @ts-ignore
import Home from "./pages/Home.tsx";
import MCBuilderWelcome from "./pages/MCBuilderWelcome.tsx";
import MCBuilderBasis from "./pages/MCBuilderBasis.tsx";
import Welcome from "./pages/Welcome.tsx";
import {Routes, Route, Navigate, HashRouter} from 'react-router-dom';
import LoadingPage from "./pages/LoadingPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
// @ts-ignore
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.tsx";
// @ts-ignore
import Login from "./components/Login.tsx";
import MCBuilderBasisTwo from "./pages/MCBuilderBasisTwo.tsx";
import Microcourse from "./pages/Microcourse.tsx";
import ProfileEdit from "./pages/ProfileEdit.tsx";
import AboutPage from "./pages/About.tsx";



// @ts-ignore
function Logout() {
    localStorage.clear();
    return <Navigate to="/login"/>
}

// @ts-ignore
function RegisterAndLogout() {
    localStorage.clear();
    return <RegisterPage route={"/api/user/register/"} method="register"/>
}

function App() {
    return (
        <HashRouter>
                <Routes>
                    <Route path="/" element={
                        <Welcome/>
                    }/>
                    <Route path="/about" element={
                        <AboutPage/>
                    }/>

                    <Route path="/home" element={
                        //<ProtectedRoute>
                            <Home/>
                        //</ProtectedRoute>
                    }/>
                    <Route path="/profile" element={
                        //<ProtectedRoute>
                            <ProfileEdit/>
                        //</ProtectedRoute>
                    }/>
                    <Route path="/mc-builder-welcome" element={
                        //<ProtectedRoute>
                            <MCBuilderWelcome/>
                        //</ProtectedRoute>
                    }/>
                    <Route path="/mc-builder-basis" element={
                        //<ProtectedRoute>
                            <MCBuilderBasis/>
                        //</ProtectedRoute>
                    }/>
                    <Route path="/mc-builder-basis-two" element={
                        //<ProtectedRoute>
                            <MCBuilderBasisTwo/>
                        //</ProtectedRoute>
                    }/>
                    <Route path="/loading-page" element={
                        //<ProtectedRoute>
                            <LoadingPage/>
                        //</ProtectedRoute>
                    }/>
                    <Route path="/microcourse/:id" element={
                        //<ProtectedRoute>
                            <Microcourse/>
                        //</ProtectedRoute>
                    }/>
                    <Route path="/logout" element={
                        //<ProtectedRoute>
                            <Logout/>
                        //</ProtectedRoute>
                        //<Route path="/login" element={<Login/>}/>
                        //<Route path="/register" element={<RegisterAndLogout/>}/>
                    }/>


                    <Route path="*" element={<NotFound/>}/>
                </Routes>
        </HashRouter>
    );
}

export default App;
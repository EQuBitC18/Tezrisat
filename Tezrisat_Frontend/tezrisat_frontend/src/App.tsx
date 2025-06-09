// @ts-ignore
import Home from "./pages/Home.tsx";
import MCBuilderWelcome from "./pages/MCBuilderWelcome.tsx";
import MCBuilderBasis from "./pages/MCBuilderBasis.tsx";
import Welcome from "./pages/Welcome.tsx";
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import LoadingPage from "./pages/LoadingPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
// @ts-ignore
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./components/Login.tsx";
import MCBuilderBasisTwo from "./pages/MCBuilderBasisTwo.tsx";
import Microcourse from "./pages/Microcourse.tsx";
import ProfileEdit from "./pages/ProfileEdit.tsx";
import Plans from "./pages/Plans.tsx";
import Pricing from "./pages/Pricing.tsx";
import AboutPage from "./pages/About.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";
import StripeSuccessPage from "./pages/StripeSuccessPage.tsx";
import Billing from "./pages/Billing.tsx";

// @ts-ignore
function Logout() {
    localStorage.clear();
    return <Navigate to="/login"/>
}

function RegisterAndLogout() {
    localStorage.clear();
    return <RegisterPage route={"/api/user/register/"} method="register"/>
}

function App() {
    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <Welcome/>
                    }/>
                    <Route path="/pricing" element={
                        <Pricing/>
                    }/>
                    <Route path="/about" element={
                        <AboutPage/>
                    }/>

                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Home/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfileEdit/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/plans" element={
                        <ProtectedRoute>
                            <Plans/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/billing" element={
                        <ProtectedRoute>
                            <Billing/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/payment" element={
                        <ProtectedRoute>
                            <PaymentPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/success" element={
                        <ProtectedRoute>
                            <StripeSuccessPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/mc-builder-welcome" element={
                        <ProtectedRoute>
                            <MCBuilderWelcome/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/mc-builder-basis" element={
                        <ProtectedRoute>
                            <MCBuilderBasis/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/mc-builder-basis-two" element={
                        <ProtectedRoute>
                            <MCBuilderBasisTwo/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/loading-page" element={
                        <ProtectedRoute>
                            <LoadingPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/microcourse/:id" element={
                        <ProtectedRoute>
                            <Microcourse/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/logout" element={
                        <ProtectedRoute>
                            <Logout/>
                        </ProtectedRoute>
                    }/>

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<RegisterAndLogout/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
        </BrowserRouter>
    );
}

export default App;
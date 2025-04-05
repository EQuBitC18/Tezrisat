// @ts-ignore
import LoginPage from "../pages/LoginPage.tsx";

// TODO Improve the design of the "Login" page ✅

function Login() {
    return <LoginPage route="/api/token/" method="login"/>
}

export default Login;
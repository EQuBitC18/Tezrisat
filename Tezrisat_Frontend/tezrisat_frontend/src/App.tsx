import Home from "./pages/Home.tsx";
import MCBuilderWelcome from "./pages/MCBuilderWelcome.tsx";
import MCBuilderBasis from "./pages/MCBuilderBasis.tsx";
import {Routes, Route, HashRouter} from 'react-router-dom';
import LoadingPage from "./pages/LoadingPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import MCBuilderBasisTwo from "./pages/MCBuilderBasisTwo.tsx";
import Microcourse from "./pages/Microcourse.tsx";
import AboutPage from "./pages/About.tsx";

function App() {
    return (
        <HashRouter>
                <Routes>
                    <Route path="/" element={
                        <Home/>
                    }/>
                    <Route path="/about" element={
                        <AboutPage/>
                    }/>

                    <Route path="/home" element={
                        <Home/>
                    }/>
                    <Route path="/mc-builder-welcome" element={
                        <MCBuilderWelcome/>
                    }/>
                    <Route path="/mc-builder-basis" element={
                        <MCBuilderBasis/>
                    }/>
                    <Route path="/mc-builder-basis-two" element={
                        <MCBuilderBasisTwo/>
                    }/>
                    <Route path="/loading-page" element={
                        <LoadingPage/>
                    }/>
                    <Route path="/microcourse/:id" element={
                        <Microcourse/>
                    }/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
        </HashRouter>
    );
}

export default App;

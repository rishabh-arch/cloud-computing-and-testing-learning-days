import './App.css';
import { React, lazy, Suspense, useContext,useEffect } from "react"
import Home from "./components/Home"
import Coronolive from "./components/CoronaLive"
import News from "./components/News"
import About from "./components/About"
import Navbar from "./components/Navbar"
import Registration from "./components/features/Registration/Registration"
import Login from "./components/features/Registration/Login"
import ForgotPass from "./components/features/Registration/ForgotPass"
import ChangePass from "./components/features/Registration/ChangePass"
import NewPass from "./components/features/Registration/NewPass"
import Contactus from "./components/features/Contact/Contact"
import Twitter from "./components/Twitter"
import LinkUrl from "./components/LinkUrl"
import Footer from "./components/Footer"
import SearchPage from './components/SearchPage'
// import Freeconsultancy from "./components/FreeConsultancy"
import { Route, Switch, Redirect } from "react-router-dom"
import { AuthContext } from './components/Context/AuthContext';
import useScrollToTop from './components/features/js_features/useScrollTop'
import ReactGA from 'react-ga';
// import axios from "axios"
const userNews = lazy(() => import('./User/User_News'));
const userSupplies = lazy(() => import('./User/User_Resource'));

// const SearchPage = lazy(() => import('./components/SearchPage'));
function App() {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
useEffect(()=>{
  ReactGA.initialize('UA-197082753-2');
  ReactGA.pageview(window.location.pathname + window.location.search);
},[])
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" render={() => <Home />} />
        {/* <Route exact path="/freeconsultancy" component={Freeconsultancy} /> */}
        <Route exact path="/about" component={About} />
        <Route exact path="/feed" render={() => <News />} />
        <Route exact path="/registration" component={Registration} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/CoronaLive" component={Coronolive} />
        <Route exact path="/Twitter" component={Twitter} />
        <Route exact path="/Contactus" component={Contactus} />
        <Route exact path="/forgotPassword" component={ForgotPass} />
        <Route exact path="/ChangePassword" component={ChangePass} />
        <Route exact path="/NewPassword" component={NewPass} />
        <Route exact path="/LinkUrl" component={LinkUrl} />
        <Route exact path="/search" render={() =><SearchPage/>} />

        {
          (!isAuthenticated) ? null :
            <>
              <Suspense fallback={<>...Loading</>}>

                <Route exact path="/userNews" component={userNews} />
                <Route exact path="/userSupplies" component={userSupplies} />
              </Suspense>
            </>

        }
        {/* <Suspense fallback={<>...Loading</>}>
        </Suspense> */}
        <Redirect to="/" />
      </Switch>
      <Footer />
    </>
  );
}

export default App;

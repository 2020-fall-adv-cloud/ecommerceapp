import React, {
    useState
    , useEffect
} from 'react';

import { 
    HashRouter
    , Route
    , Switch 
} from 'react-router-dom';

import Nav from './Nav';
import Admin from './Admin';
import Main from './Main';
import Profile from './Profile';

const Router = () => {
    const [current, setCurrent] = useState('home');

    useEffect(
        () => {
            
            setRoute();
            window.addEventListener('hashchange', setRoute);

            return () =>  window.removeEventListener('hashchange', setRoute);
        }
        , []
    );

    const setRoute = () => {
        // Get the location from the window object. location is an array of strings.
        const location = window.location.href.split('/');

        // We only care about the last part of the window location... Get the last string in the location array.
        const pathname = location[location.length - 1];
        console.log('pathname: ', pathname);
        
        setCurrent(pathname ? pathname : 'home');
    };

    return (
        <HashRouter>
            <Nav current={current} />
            <Switch>
                <Route exact path='/' component={Main} />
                <Route path='/admin' component={Admin} />
                <Route path='/profile' component={Profile} />
                <Route component={Main} />
            </Switch>
        </HashRouter>
    );
}
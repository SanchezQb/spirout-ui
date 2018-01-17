import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Search from './Search'
import Category from './Category'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import Content from './Content'
import SingleContent from './SingleContent'
import Request from './Request'
import Pay from './Pay'
import Upload from './Upload'
import About from './About'
import Profile from './Profile'
import ViewRequests from './ViewRequests'
import SingleRequest from './SingleRequest'
import Contact from './Contact'



const Main = () => {
    return (
        <main>
            <Switch>
                <Route exact path='/' component={Category} />
                <Route exact path='/contact' component={Contact} />
                <Route exact path='/category/:id' component={Content} />
                <Route exact path='/category/:id/:id' component={SingleContent} />
                <Route exact path='/about' component={About} />
                <Route exact path='/upload' component={Upload} />
                <Route exact path='/user/:id' component={Profile} />
                <Route exact path='/users/:id/upload' component={Upload} />
                <Route exact path='/pay' component={Pay} />
                <Route exact path='/requests' component={ViewRequests} />
                <Route exact path='/requests/:id' component={SingleRequest} />
                <Route exact path='/request' component={Request} />    
                <Route exact path='/search' component={Search} />
                <Route exact path='/signup' component={SignupPage} />
                <Route exact path='/login' component={LoginPage} />
            </Switch>
        </main>
    )
    

}
export default Main
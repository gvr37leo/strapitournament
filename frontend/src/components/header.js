import React from 'react';
import { Link } from 'react-router-dom';
import {get, getHost, getLoggedInUser, isLoggedIn} from '../pages/utils'

export default class Header extends React.Component{

    constructor(){
        super();
        this.state = {
            loaded:false
        }
    }


    componentDidMount(){

        get('webpages',{
            populate:'*'
        }).then(data => {
            this.setState({
                loaded:true,
                homepage:homepagedata.data,
                webpages:data.data
            })
        })

        // var homepage = Umbraco.AssignedContentItem.Root<Homepage>();
        // var isLoggedIn = Context.User?.Identity?.IsAuthenticated ?? false;
        // var logoutModel = new PostRedirectModel();
        // // You can modify this to redirect to a different URL instead of the current one
        // logoutModel.RedirectUrl = null;
    }

    render(){
        if(this.state.loaded == false)return <div>loading</div>

        return <nav style={{"boxShadow":"0px 8px 8px 5px #0000006b","backgroundSize":"contain","backgroundImage":`url('${getHost() + this.state?.homepage?.attributes?.navigationbar?.data?.attributes?.url}')`}} className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to={"/"}>
                    <img src={getHost() + this.state?.homepage?.attributes?.logo?.data?.attributes?.url} width="30" height="30" alt=""/>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link style={{"color":"#e7e7e7","textShadow":"0 0 5px black","fontWeight":"bold"}} className="nav-link" to="/tournament">Tournaments</Link>
                        </li>
                        <li className="nav-item">
                            <Link style={{"color":"#e7e7e7","textShadow":"0 0 5px black","fontWeight":"bold"}} className="nav-link" to="/leaderboard">Leaderboard</Link>
                        </li>
                        {(() => {
                            return this.state.webpages.filter(w => w.attributes.parent.data == null).map(webpage => {
                                if(webpage.attributes.children.data.length == 0){
                                    return <li key={webpage.id} className="nav-item">
                                        <Link style={{"color":"#e7e7e7","textShadow":"0 0 5px black","fontWeight":"bold"}} className="nav-link" to={`/webpage/${webpage.id}`}>{webpage.attributes.title}</Link>
                                    </li>
                                }else{
                                    return <li key={webpage.id} className="nav-item dropdown">
                                        <Link style={{"color":"#e7e7e7","textShadow":"0 0 5px black","fontWeight":"bold"}} className="nav-link dropdown-toggle"  id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false" to={`/webpage/${webpage.id}`}>{webpage.attributes.title}</Link>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            {webpage.attributes.children.data.map(child => {
                                                return <li key={child.id}><Link className="dropdown-item" to={`/webpage/${child.id}`}>{child.attributes.title}</Link></li>
                                            })}
                                        </ul>
                                    </li>
                                }
                            })
                        })()}
                        
                            
                    </ul>
                    <div style={{"display":"flex","justifyContent":"space-around"}}>
                        {this.state.homepage.attributes.socialmedia.map((sm,i) => {
                            return <a key={i} target="_blank" style={{'marginRight':'10px'}} href={sm.url}><img height="50" src={getHost() + sm.image?.data?.attributes?.url}/></a>
                        })}
                    </div>
                    {(() => {
                        if(isLoggedIn()){
                        
                            return <React.Fragment>
                                <div style={{"marginRight":"10px",color:'white'}}>Welcome <a href="/member-edit"><b>{getLoggedInUser().user.username}</b></a></div>
                                <button onClick={() => {
                                    localStorage.removeItem('logindata')
                                    location.reload()
                                }} type="button" className="btn btn-primary">Log out</button>
                            </React.Fragment>
                        }else{
                            return <form className="d-flex">
                                <a href={`${getHost()}/api/connect/discord`} className="btn btn-primary">login with discord</a>
                                {/* <button type='button' onClick={() => {
                                    fetch(`${getHost()}/api/auth/local`,{
                                        method:'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body:JSON.stringify({
                                            identifier:'piet@gmail.com',
                                            password:'$RF5tg^YH',
                                        })
                                    })
                                    .then(res => res.json())
                                    .then((data) => {
                                        localStorage.setItem('logindata',JSON.stringify(data))
                                        console.log(data)
                                    })
                                }} href="/login" style={{"marginRight":"10px"}} className="btn btn-primary" >Login</button>
                                <a href="/register" className="btn btn-primary" >Signup</a> */}
                            </form>
                        }
                    })()}
                </div>
            </div>
        </nav>
    }
}

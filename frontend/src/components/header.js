import React from 'react';
import {get, getHost, isLoggedIn} from '../pages/utils'

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
                <a className="navbar-brand" href="/">
                    <img src={getHost() + this.state?.homepage?.attributes?.logo?.data?.attributes?.url} width="30" height="30" alt=""/>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a style={{"color":"#e7e7e7","textShadow":"0 0 5px black","fontWeight":"bold"}} className="nav-link" href="/tournament">Tournaments</a>
                        </li>
                        <li className="nav-item">
                            <a style={{"color":"#e7e7e7","textShadow":"0 0 5px black","fontWeight":"bold"}} className="nav-link" href="/leaderboard">leaderboard</a>
                        </li>
                        {(() => {
                            return this.state.webpages.filter(w => w.attributes.parent.data == null).map(webpage => {
                                if(webpage.attributes.children.data.length == 0){
                                    return <li key={webpage.id} className="nav-item">
                                        <a style={{"color":"#e7e7e7","textShadow":"0 0 5px black","fontWeight":"bold"}} className="nav-link" href={`/webpage/${webpage.id}`}>{webpage.attributes.title}</a>
                                    </li>
                                }else{
                                    return <li key={webpage.id} className="nav-item dropdown">
                                        <a style={{"color":"#e7e7e7","textShadow":"0 0 5px black","fontWeight":"bold"}} className="nav-link" href={`/webpage/${webpage.id}`}>{webpage.attributes.title}</a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            {webpage.attributes.children.data.map(child => {
                                                return <li key={child.id}><a className="dropdown-item" href={`/webpage/${child.id}`}>{child.attributes.title}</a></li>
                                            })}
                                        </ul>
                                        
                                    </li>
                                }
                            })
                        })()}
                        
                            
                    </ul>
                    <div style={{"display":"flex","justifyContent":"space-around"}}>
                        {this.state.homepage.attributes.socialmedia.map((sm,i) => {
                            return <a key={i} target="_blank" style={{'marginRight':'10px'}} href={sm.url}><img height="50" src="@item.Image?.Url()"/></a>
                        })}
                    </div>
                    {(() => {
                        if(isLoggedIn()){
                        
                            return <React.Fragment>
                                <div style={{"marginRight":"10px"}}>Welcome <a href="/member-edit"><b>username</b></a></div>
                                <button onClick={() => {
                                    console.log('logout')
                                }} type="submit" className="btn btn-primary">Log out</button>
                            </React.Fragment>
                        }else{
                            return <form className="d-flex">
                                <a href="/login" style={{"marginRight":"10px"}} className="btn btn-primary" >Login</a>
                                <a href="/register" className="btn btn-primary" >Signup</a>
                            </form>
                        }
                    })()}
                </div>
            </div>
        </nav>
    }
}

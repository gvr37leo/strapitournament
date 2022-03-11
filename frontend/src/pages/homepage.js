import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {get,getCustom,getHost, orderUsers} from './utils'
// import ReactDOM from 'react-dom';

export default function Homepage(){

    var [state,setState] = React.useState({loaded:false})

    useEffect(() => {
        getCustom('getHomePageData',{}).then(data => {
            setState({
                loaded:true,
                homepage:homepagedata.data,
                ...data,
            })
        })
    },[])

    if(state.loaded == false)return <div>loading</div>


    return <div className="row">
        <div className="col-xl-9">
            <div className="row">
                <div className="col-3 d-none d-xl-block">
                    <img style={{"width":"100%","padding":"20px 0px 10px"}} src={getHost() + state?.homepage?.attributes?.banner?.data?.attributes?.url} />
                </div>
                <div className="col">
                    <div className="row" style={{"padding":"20px 0px 10px"}}>
                        <div className="col">
                            
                            <div style={{"boxShadow":"0px 8px 8px 5px #0000006b"}} id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                {
                                    state.webpages.map((webpage,i) => {
                                        return <button key={i} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={i} className={i == 0 ? "active" : ""} aria-current="true" aria-label={"Slide " + i}></button>
                                    })
                                }
                            </div>
                            <div className="carousel-inner">
                                {
                                    state.webpages.map((webpage,i) => {
                                        return <div key={i} style={{"maxHeight":"300px"}} className={`carousel-item  ${i == 0 ? 'active' : ''}`}>
                                            <Link to={`/webpage/${webpage.id}`}>
                                                <img style={{"maxHeight":"300px","objectFit":"cover","borderRadius":"3px"}} src={getHost() + (webpage?.banner?.url ?? '/Warhammer.jpg')} className="d-block w-100" alt="..."/>
                                                <div className="carousel-caption d-none d-md-block">
                                                    <h5 style={{"textShadow":"0px 0px 6px #000000"}}>{webpage.title}</h5>
                                                </div>
                                            </Link>
                                        </div>
                                    })
                                }
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col" style={{"display":"flex","flexWrap":"wrap","color":"black", "gap":'10px 30px'}}>

                            {(() => {
                                return state.tournaments
                                // .filter(t => {
                                //     return new Date(t.startsat).getTime() + 24 * 3600 * 1000 >= Date.now()
                                // })
                                // .sort((a,b) => new Date(a.attributes.startsat) - new Date(b.attributes.startsat))
                                .map((tournament,i) => {
                                    return <div key={i} className="card" style={{"flexGrow":"1","width":"18rem","boxShadow":"0px 8px 8px 5px #0000006b"}}>
                                        <img src={getHost() + tournament.image?.url} className="card-img-top" alt="..."/>
                                        <div className="card-body">
                                            <Link to={`/tournament/${tournament.id}`}><h5 className="card-title">{tournament.title}</h5></Link>
                                            <div>{new Date(tournament.startsat).toLocaleString()}</div>
                                                {(() => {
                                                    if (tournament.ExternaltournamentLink == null) {
                                                        return <div>{tournament.signupcount} people signed up</div>	
                                                    }
                                                })()}
                                        </div>
                                    </div>
                                })
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-xl-3" style={{}}>
            <div style={{"margin":"20px 0 0","overflowX":"auto"}}>
                <table style={{"margin":"0px"}} className="w-auto table table-light table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">tourny wins</th>
                            <th scope="col">wins</th>
                            <th scope="col">losses</th>
                            <th scope="col">country</th>
                            <th scope="col">clan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            // orderUsers(state.users,state.matches)
                            return state.users.map((user,i) => {
                                return <tr key={i}>
                                    <td scope="row"><b>{i + 1}</b></td>
                                    <td><Link to={`/profile/${user.id}`}>{user.username}</Link></td>
                                    <td>{user.tournywins}</td>
                                    <td>{user.wins}</td>
                                    <td>{user.losses}</td>
                                    <td>{user.country}</td>
                                    <td>{user.clan}</td>
                                </tr>
                            })
                        })()}
                    </tbody>
                </table>
            </div>
            
        </div>
    </div>
}






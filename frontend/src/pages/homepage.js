import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Leaderboard from './leaderboard';
import {get,getCustom,getHost, orderUsers} from './utils'
import Carousel from './carousel'

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
                            <Carousel id="carousel1" itemcount={1} carouselitems={state.webpages.map(wp => {
                                return {
                                    link:`/webpage/${wp.id}`,
                                    title:wp.title,
                                    imageurl:wp?.banner?.url == null ? '/Warhammer.jpg' : getHost() + wp?.banner?.url,
                                }
                            })}></Carousel>   
                        </div>
                    </div>
                    <div className="row">
                        <div className="col" style={{"display":"flex","flexWrap":"wrap","color":"black", "gap":'10px 30px'}}>
                            {(() => {
                                return state.tournaments
                                .map((tournament,i) => {
                                    return <div key={i} className="card" style={{"flexGrow":"1","width":"18rem","boxShadow":"0px 8px 8px 5px #0000006b"}}>
                                        <img src={getHost() + tournament.image?.url} className="card-img-top" alt="..."/>
                                        <div className="card-body">
                                            <Link to={`/tournament/${tournament.id}`}><h5 className="card-title">{tournament.title}</h5></Link>
                                            <div>{new Date(tournament.startsat).toLocaleString()}</div>
                                                {(() => {
                                                    if (tournament.ExternaltournamentLink == null) {
                                                        return <div>{tournament.signupcount} people signed up</div>	
                                                    }else{
                                                        return <a href={tournament.ExternaltournamentLink.url}>{tournament.ExternaltournamentLink.title}</a>
                                                    }
                                                })()}
                                        </div>
                                    </div>
                                })
                            })()}
                        </div>
                    </div>
                    <div className='row' style={{marginTop:'15px'}}>
                        <div className='col'>
                            <Carousel id={'carousel2'} itemcount={3} carouselitems={state.homepage.attributes.bottomrow.map(item => {
                                var imageurl = item?.image?.data?.attributes?.url
                                return {
                                    link:imageurl == null ? '/Warhammer.jpg' : imageurl,
                                    title:item.title,
                                    imageurl:imageurl == null ? '/Warhammer.jpg' : getHost() + imageurl,
                                }
                            })}></Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-xl-3" style={{}}>
            <Leaderboard></Leaderboard>
        </div>
    </div>
}






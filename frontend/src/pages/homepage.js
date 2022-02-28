import React from 'react';
import {get,getHost, orderUsers} from './utils'
// import ReactDOM from 'react-dom';

export default class Homepage extends React.Component{
    //get leaderboard
    //get guides/blogs
    //get tournaments with their signups count
    //login functionality

    constructor(){
        super();
        this.state = {
            loaded:false,
            matches:[],
            webpages:[],
            tournaments:[],
            homepage:{},
        }

    }


    componentDidMount(){
        // https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest-api.html#api-parameters
        // sort:['startat:asc']
        // filters:{name:{'$eq':'john'}}

        // homepage for image links
        // webpages for slider
        // tournaments for cards
        // matches for leaderboard ?populate players
        Promise.all([get('matches',{populate:'*'}),get('webpages',{populate:'*'}),get('tournaments',{populate:'*'}),get('users')]).then((res) => {
            var [matches,webpages,tournaments,users] = res
            this.setState({
                loaded:true,
                matches:matches.data,
                webpages:webpages.data,
                tournaments:tournaments.data,
                homepage:homepagedata.data,
                users:users
            })
            console.log(res)
        })
    }

    render(){
        if(this.state.loaded == false){
            return null
        }

        return <div className="row">
            <div className="col-xl-9">
                <div className="row">
                    <div className="col-3 d-none d-xl-block">
                        <img style={{"width":"100%","padding":"20px 0px 10px"}} src={getHost() + this.state?.homepage?.attributes?.banner?.data?.attributes?.url} />
                    </div>
                    <div className="col">
                        <div className="row" style={{"padding":"20px 0px 10px"}}>
                            <div className="col">
                                
                                <div style={{"boxShadow":"0px 8px 8px 5px #0000006b"}} id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-indicators">
                                    {
                                        this.state.webpages.map((webpage,i) => {
                                            return <button key={i} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={i} className={i == 0 ? "active" : ""} aria-current="true" aria-label={"Slide " + i}></button>
                                        })
                                    }
                                </div>
                                <div className="carousel-inner">
                                    {
                                        this.state.webpages.map((webpage,i) => {
                                            return <div key={i} style={{"maxHeight":"300px"}} className={`carousel-item  ${i == 0 ? 'active' : ''}`}>
                                                <a href={`/webpage/${webpage.id}`}>
                                                    <img style={{"maxHeight":"300px","objectFit":"cover","borderRadius":"3px"}} src={getHost() + webpage.attributes.banner.data.attributes.url} className="d-block w-100" alt="..."/>
                                                    <div className="carousel-caption d-none d-md-block">
                                                        <h5 style={{"textShadow":"0px 0px 6px #000000"}}>{webpage.attributes.title}</h5>
                                                    </div>
                                                </a>
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
                            <div className="col" style={{"display":"flex","flexWrap":"wrap","color":"black"}}>

                                {(() => {
                                    return this.state.tournaments
                                    .filter(t => {
                                        return new Date(t.attributes.startsat).getTime() + 24 * 3600 * 1000 >= Date.now()
                                    })
                                    .sort((a,b) => new Date(a.attributes.startsat) - new Date(b.attributes.startsat))
                                    .map((tournament,i) => {
                                        return <div key={i} className="card" style={{"flexGrow":"1","width":"18rem","margin":"0 10px 10px 0px","boxShadow":"0px 8px 8px 5px #0000006b"}}>
                                            <img src={getHost() + tournament.attributes.image.data.attributes.url} className="card-img-top" alt="..."/>
                                            <div className="card-body">
                                                <a href={`/tournament/${tournament.id}`}><h5 className="card-title">{tournament.attributes.title}</h5></a>
                                                <div>{tournament.attributes.startsat} PST</div>
                                                    {(() => {
                                                        if (tournament.attributes.ExternaltournamentLink == null) {
                                                            return <div>{0} people signed up</div>	
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
                                orderUsers(this.state.users,this.state.matches)
                                // var userdict = {}
                                // for(var user of this.state.users){
                                //     user.wins = 0
                                //     user.tournywins = 0
                                //     user.losses = 0
                                //     user.draws = 0
                                //     userdict[user.id] = user
                                // }

                                // for(var match of this.state.matches){
                                //     var istournywin = match.attributes.depth == 0 ? 1 : 0
                                //     if(match.attributes.score1 > match.attributes.score2){
                                //         userdict[match.attributes.player1.data.id].wins++
                                //         userdict[match.attributes.player1.data.id].tournywins += istournywin
                                //         userdict[match.attributes.player2.data.id].losses++
                                //     }else if(match.attributes.score2 > match.attributes.score1){
                                //         userdict[match.attributes.player2.data.id].wins++
                                //         userdict[match.attributes.player2.data.id].tournywins += istournywin
                                //         userdict[match.attributes.player1.data.id].losses++
                                //     }else{
                                //         userdict[match.attributes.player1.data.id].draws++
                                //         userdict[match.attributes.player2.data.id].draws++
                                //     }
                                // }

                                // this.state.users.sort((a,b) => a.tournywins - b.tournywins)

                                return this.state.users.map((user,i) => {
                                    return <tr key={i}>
                                        <td scope="row"><b>{i + 1}</b></td>
                                        <td><a href={`/profile/${user.id}`}>{user.username}</a></td>
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
    
}








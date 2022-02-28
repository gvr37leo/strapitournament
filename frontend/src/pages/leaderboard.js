import React from 'react';
import {get,orderUsers} from './utils'

export default class Leaderboard extends React.Component{


    constructor(){
        super();
        this.state = {
            loaded:false
        }
	}

	componentDidMount(){

        Promise.all([get('matches',{populate:'*'}),get('users')]).then((res) => {
            var [matches,users] = res
            this.setState({
                loaded:true,
                matches:matches.data,
                users:users,
            })
            console.log(res)
        })

        	// Layout = "master.cshtml";
        	// var Request = HttpContextAccessor.HttpContext.Request;

        	// var orderedplayers = Functions.GetOrderedPlayers(MemberService,Umbraco);
        	// orderedplayers = orderedplayers.Where(t => t.player.Name.ToLower().Contains(Request.Query["search"].ToString().ToLower())).ToList();	
	}

    render(){
        if(this.state.loaded == false)return <div>loading</div>

        orderUsers(this.state.users,this.state.matches)
        return <div>
            <div style={{margin:'10px'}}>
                <form className="form-inline">
                    <div>
                        <input name="search" />
                        <button onClick={() => {
                            console.log('search')
                        }} className="btn btn-primary" type="button">search</button>
                    </div>
                    
                    
                </form>
            </div>

            <table style={{'marginTop':'20px'}} className="table table-light table-bordered">
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
                    {this.state.users.map((user,i) => {
                        return <tr key={i}>
                            <td scope="row"><b>{i + 1}</b></td>
                            <td><a href={`/profile/${user.id}`}>{user.username}</a></td>
                            <td>{user.tournywins}</td>
                            <td>{user.wins}</td>
                            <td>{user.losses}</td>
                            <td>{user.country}</td>
                            <td>{user.clan}</td>
                        </tr>
                    })}
                    {/* @for (int i = 0; i < orderedplayers.Count(); i++){
                        
                        var stats = orderedplayers[i];
                        var player = stats.player;
                        <tr>
                            <td scope="row"><b>@(stats.placement + 1)</b></td>
                            <td><a href="/player-profile?playerid=@player.Id">@player.Name</a></td>
                            <td>@stats.tournamentwins</td>
                            <td>@stats.wins</td>
                            <td>@stats.losses</td>
                            <td>@(player.GetValue<string>("country"))</td>
                            <td>@player.GetValue("clan")</td>
                        </tr>
                    } */}
                </tbody>
            </table>
        </div>
    }
}





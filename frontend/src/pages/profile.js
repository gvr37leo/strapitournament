import React from 'react';
import {get} from './utils'

export default class Profile extends React.Component{

    constructor(){

    }

    componentDidMount(){

        Promise.all([get('user/1'),]).then((res) => {
            var [user] = res
            this.setState({
                user:user.data,
            })
            console.log(res)
            this.state.matches = user.data.matches
        })

        // 	Layout = "master.cshtml";
        // 	var Request = HttpContextAccessor.HttpContext.Request;
        // 	int playerid = int.Parse(Request.Query["playerid"]);
        // 	var matches = Umbraco.AssignedContentItem.Root().Descendants<Match>();
        // 	var member = MemberService.GetById(playerid);

        // 	matches = matches.Where(m => m.Player1?.Id == playerid || m.Player2?.Id == playerid).OrderByDescending(m => m.CreateDate);

        // 	var wins = matches.Count(m => {
        // 		if(m.Score1 == m.Score2){
        // 			return false;
        // 		}
        // 		var winner = m.Player1;
        // 		if(m.Score2 > m.Score1) {
        // 			winner = m.Player2;
        // 		}
        // 		return winner.Id == member.Id;
        // 	});        
    }

    render(){
        return <div>
            <h1>@member.Name</h1>
            <div>wins @wins</div>
            <div>losses @(matches.Count() - wins)</div>

            <table style={{'margin-top':'20px;'}} className="table table-light table-bordered">
                <thead>
                    <tr>
                        <th>player1</th>
                        <th>score1</th>
                        <th>player2</th>
                        <th>score2</th>
                        <th>date</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.matches.map(match => {
                        
                        var winner = null;
                        if (match.Score2 > match.Score1) {
                            winner = match.Player2;
                        }else if (match.Score1 > match.Score2) {
                            winner = match.Player1;
                        }
                        return <tr className={winner?.Id == this.member?.Id ? "table-success" : "table-danger"}>
                            <td><a href="/player-profile?playerid=@match.Player1?.Id">@match.Player1?.Name</a></td>
                            <td>@match.Score1</td>
                            <td><a href="/player-profile?playerid=@match.Player2?.Id">@match.Player2?.Name</a></td>
                            <td>@match.Score2</td>
                            <td>@match.CreateDate.ToShortDateString()</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    }
}



	
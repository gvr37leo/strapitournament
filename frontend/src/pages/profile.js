import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {get,getCustom,getHost} from './utils'

export default function Profile(){
    var [state,setState] = useState({loaded:false})

	var params = useParams()

    useEffect(() => {

        getCustom(`getUserWithMatches`,{userid:params.id})
        .then((data) => {
            setState({
                loaded:true,
                user:data,
                matches:data.matches1.concat(data.matches2).map(m => {m.updatedAt = new Date(m.updatedAt); return m;}).sort((a,b) => b.updatedAt - a.updatedAt)
            })
        })
    },[params])

    if(state.loaded == false)return <div>loading</div>

    var tournywins = 0
    var wins = 0
    var losses = 0
    var draws = 0
    for(var match of state.matches.filter(m => m.scoreReported == true)){
        if(match.score1 == match.score2){
            draws++
            continue
        }else{
            var winnerid = match.player1.id
            if(match.score2 > match.score1){
                winnerid = match.player2.id
            }
            if(winnerid == params.id){
                wins++
                if(match.depth == 0){
                    tournywins++
                }
            }else{
                losses++
            }
        }

    }

    return <div style={{color:'white'}}>
        <h1>{state.user.username}</h1>
        <div>wins {wins}</div>
        <div>losses {losses}</div>

        <table style={{'marginTop':'20px'}} className="table table-light table-bordered">
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
                {state.matches.map(match => {
                    var winner = null;
                    if (match.score2 > match.score1) {
                        winner = match.player2;
                    }else if (match.score1 > match.score2) {
                        winner = match.player1;
                    }
                    return <tr key={match.id} className={winner?.id == params.id ? "table-success" : "table-danger"}>
                        <td><Link to={`/profile/${match.player1?.id}`}>{match.player1?.username}</Link></td>
                        <td>{match.score1}</td>
                        <td><Link to={`/profile/${match.player2?.id}`}>{match.player2?.username}</Link></td>
                        
                        <td>{match.score2}</td>
                        <td>{new Date(match.updatedAt).toLocaleString()}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}

	
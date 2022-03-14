import React, { useEffect, useState } from 'react';
import {get,isLoggedIn,getLoggedInUser, getHost, getCustom} from './utils'
import { Link, useParams } from 'react-router-dom'

// https://staxmanade.com/CssToReact/
// https://www.youtube.com/watch?v=vGtVSwpOlsM  oath

export default function Tournament(){

	var [state,setState] = useState({loaded:false,isAdmin:false})

	var params = useParams()
	

	useEffect(() => {
		if(isLoggedIn()){
			
		}
		Promise.all([
			get(`tournaments/${params.id}`,{populate:[
			'tournament_signups',
			'matches',
			'matches.player1',
			'matches.player2',
			'matches.parentMatch',
			'tournament_signups.users_permissions_user',
			'rounddescription',
			'image',
			]}),
			isLoggedIn() ? getCustom('getUserWithRole',{userid:getLoggedInUser().user.id}) : null
		]).then(([data1,data2]) => {
			setState({
				loaded:true,
				isAdmin:data2?.role?.name == 'admin',
				homepage:homepagedata.data,
				tournament:data1.data,
			}) 
		})
    },[])

    if(state.loaded == false)return <div>loading</div>

	return <div className="row" style={{"justifyContent":"center"}}>
			<div className="column" style={{
				"background": `url('${getHost() + state.homepage.attributes?.pagebackground?.data?.attributes?.url}')`,
				"color": "black",
				"margin": "10px",
				"padding": "10px",
				"maxWidth": "50rem",
				"borderRadius": "3px",
				"backgroundRepeat": "repeat-y",
				"backgroundSize": "100%",
				"boxShadow": "black 0px 5px 9px 2px"
			}}>
				<div>
					<h1>{state.tournament.attributes.title}</h1> 
					<img style={{"width":"100%","borderRadius":"3px"}} src={getHost() + state.tournament.attributes.image.data.attributes.url}/>
					<div>current time {new Date().toLocaleString()}</div>
					<div>tournament starts at {new Date(state.tournament.attributes.startsat).toLocaleString()}</div>
					<div>checkins begin at {new Date(new Date(state.tournament.attributes.startsat) - 3600 * 1000).toLocaleString()}</div>

					{(() => {
						if(state.isAdmin){
							return <div>
								<button type="button" onClick={(e) => {
									e.target.disabled = true
									getCustom('generatebracket',{
										tournamentid:state.tournament.id,
										includeAll:false,
									}).finally(() => {
										e.target.disabled = false
										location.reload()
									})
								}} className="btn btn-primary">generate bracket</button>

								<button style={{marginLeft:'20px'}} type="button" onClick={(e) => {
									e.target.disabled = true
									getCustom('generatebracket',{
										tournamentid:state.tournament.id,
										includeAll:true,
									}).finally(() => {
										e.target.disabled = false
										location.reload()
									})
								}} className="btn btn-primary">generate bracket all</button>
							
							</div>
						}
					})()}
					

					{signupcheckinbutton(state)}
					{(() => {
						if(state.tournament.attributes.ExternalTournamentLink != null){
							<a href={state.tournament.attributes.ExternalTournamentLink}><h1>{state.tournament.attributes.ExternalTournamentLink}</h1></a>
						}
					})()}
					<div className='ck-content' style={{"margin":"10px","padding":"10px","border":"1px solid black","borderRadius":"3px"}} dangerouslySetInnerHTML={{__html:state.tournament.attributes.description}}></div>
				</div>
		
		
				
				<style>
					{`.matchcard{
						border:1px solid black;
						border-radius: 3px;
						padding: 3px;
						margin: 3px;
						width: 160px;
						background: white;
						box-shadow: black 0px 5px 9px 2px;
					}`}
				</style>
				{/* @*brackets*@ */}
				<div style={{"padding":"10px","overflowX":"auto"}}>
					<div style={{'display':'flex'}}>
						{(() => {
							return state.tournament.attributes.rounddescription.reverse().map((desc,i) => {
								return <div key={i} style={{width:'166px'}}>
									<div>round {i + 1}</div>
									<div>{desc.text}</div>
								</div>
							})
						})()}
					</div>
					{(() => {
						return renderTree(state.tournament.attributes.matches.data.find(m => m.attributes.depth == 0),state)
					})()}
				</div>
				
		
				{/* signup/checkin form */}
				{signupcheckinbutton(state)}
		
				{/* @*signedup players*@ */}
				{(state.tournament.ExternalTournamentLink == null) ? 
					<div>
						<table className="table table-dark table-bordered w-auto">
							<thead>
								<tr>
									<th>Player</th>
									<th>Checked in</th>
								</tr>
							</thead>
							<tbody>
								{state.tournament.attributes.tournament_signups.data.map((signup,i) => <tr key={i}>
									<td><Link to={`/profile/${signup.attributes.users_permissions_user.data.id}`}>{signup.attributes.users_permissions_user.data.attributes.username}</Link></td>
									<td>{signup.attributes.checkedin ? "yes" : "no"}</td>
								</tr>)}
							</tbody>
						</table>
					</div> : null
				}
			</div>
		</div>
}

function renderTree(match,state) {
	if(match == null) {
		return;
	}
	var maxdepth = state.tournament.attributes.matches.data.reduce((p,c) => (c.attributes.depth > p.attributes.depth) ? c : p)
	var children = state.tournament.attributes.matches.data.filter(m => m.attributes.parentMatch?.data?.id == match.id)
	if(children.length == 0) {
		return renderCard(match,state);
	} else {
		return <div key={match.id} style={{"display":"inline-flex","alignItems":"center","justifyContent":"start", 'magin':match.attributes.depth == maxdepth - 2 ? '10px':''}} >
			<div style={{"display":"flex","flexDirection":"column","alignItems":"flex-end"}}>
				{children.map(child => renderTree(child,state))}
			</div>
			{renderCard(match,state)}
		</div>
	}
}

function renderCard(match,state) {
	return <div key={match.id} className="matchcard" id="match-@match.Id">
		{(() => {
			
			if (isLoggedIn() && Date.now() > new Date(state.tournament.attributes.startsat)) {
				var user = getLoggedInUser().user
				if(
					(match.attributes.player1?.data != null && match.attributes.player2?.data != null)
					&& (match.attributes.scoreReported == false)
					&& (match.attributes.player1.data.id == user.id || match.attributes.player2.data.id == user.id)
				) {
					return <div style={{"display":"flex","flexDirection":"column"}}>
						<input id="inputscore1" placeholder={match.attributes.player1.data.attributes.username} type="number" value={0} name="score1"/>
						<input id="inputscore2"placeholder={match.attributes.player2.data.attributes.username} type="number" value={0} name="score2"/>
						<button onClick={(e) => {
							e.target.disabled = true
							getCustom('reportscore',{
								matchid:match.id,
								score1:inputscore1.valueAsNumber,
								score2:inputscore2.valueAsNumber,
							}).finally(() => {
								e.target.disabled = false
								location.reload()
							})
						}} type="submit" className="btn btn-primary">report score</button>
					</div>
				}
			}
		})()}
		<div>
			<div>{match.attributes.player1?.data != null ? `${match.attributes.player1.data.attributes.username}:${match.attributes.score1}` : 'TBD'}</div>
		</div>
		<div>
			<div>{match.attributes.player2?.data != null ? `${match.attributes.player2.data.attributes.username}:${match.attributes.score2}` : 'TBD'}</div>
		</div>
	</div>
}

function signupcheckinbutton(state){
	if (state.tournament.attributes.ExternalTournamentLink != null) {
		return
	}
	if(isLoggedIn() == false){
		return <div>log in to sign up for tournaments</div>
	}

	return <div style={{"margin":"10px 10px 10px 0"}}>
		{(() => {
			var user = getLoggedInUser().user
			var signup = state.tournament.attributes.tournament_signups.data.find(s => s.attributes.users_permissions_user.data.id == user.id);
			if(signup == null) {
				return <button type="submit" onClick={(e) => {
					e.target.disabled = true
					//tournamentid loggedinmemberid
					getCustom('signup',{tournamentid:state.tournament.id})
					.finally(() => {
						e.target.disabled = false
						location.reload()
					})
				}} className="btn btn-primary">Sign up for tournament</button>
			} else {
				if (signup.attributes.checkedin) {
					return <div>you're checked in</div>
				} else {
					if(Date.now() >= new Date(state.tournament.attributes.startsat) - 3600 * 1000){
						return <button type="submit" onClick={(e) => {
							e.target.disabled = true
							getCustom('checkin',{tournamentid:state.tournament.id})
							.finally(() => {
								e.target.disabled = false
								location.reload()
							})
						}} className="btn btn-primary">Check in for tournament</button>
					}else{
						return <div>checkins havent started yet</div>
					}

				}
			}
		})()}
	</div>
}



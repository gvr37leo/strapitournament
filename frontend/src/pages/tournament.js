import React from 'react';
import {get,isLoggedIn,getLoggedInUser, getHost} from './utils'
import { useParams } from 'react-router-dom'

// https://staxmanade.com/CssToReact/
// https://www.youtube.com/watch?v=vGtVSwpOlsM  oath
export default class Tournament extends React.Component{

	constructor(){
		super()
		this.state = {
			loaded:false,
		}
	}

	componentDidMount(){
		get(`tournaments/${1}`,{populate:[
			'tournament_signups',
			'matches',
			'matches.player1',
			'matches.player2',
			'matches.parentMatch',
			'tournament_signups.users_permissions_user',
			'rounddescription',
			'image',

		]}).then((data) => {
			this.setState({
				loaded:true,
				homepage:homepagedata.data,
				tournament:data.data,
			}) 
			console.log(data.data)
		})
		
	}

	render(){
		if(this.state.loaded == false){
			return <div>loading</div>
		}

		return <div className="row" style={{"justifyContent":"center"}}>
			<div className="column" style={{
				"background": `url('${getHost() + this.state.homepage.attributes.pagebackground.data.attributes.url}')`,
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
					<h1>{this.state.tournament.attributes.title}</h1> 
					<img style={{"width":"100%","borderRadius":"3px"}} src={getHost() + this.state.tournament.attributes.image.data.attributes.url}/>
					<div>current time {new Date().toUTCString()} (PST -8:00)</div>
					<div>tournament starts at {new Date(this.state.tournament.attributes.startsat).toUTCString()}</div>
					<div>checkins begin at {new Date(new Date(this.state.tournament.attributes.startsat) - 3600 * 1000).toUTCString()}</div>
					{this.signupcheckinbutton()}
					{(() => {
						if(this.state.tournament.attributes.ExternalTournamentLink != null){
							<a href={this.state.tournament.attributes.ExternalTournamentLink}><h1>{this.state.tournament.attributes.ExternalTournamentLink}</h1></a>
						}
					})()}
					<div style={{"margin":"10px","padding":"10px","border":"1px solid black","borderRadius":"3px"}}>{this.state.tournament.attributes.description}</div>
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
				{/* @{
					var matches = node.Descendants<Match>();
					var matchesbylevel = matches.GroupBy(m => m.Depth).ToDictionary(g => g.Key, g => g.ToList());
					var maxdepth = matchesbylevel.Count;
					var root = matches.FirstOrDefault(m => m.Depth == 0);
		
					
		
					
				} */}
				<div style={{"padding":"10px","overflowX":"auto"}}>
					<div style={{'display':'flex'}}>
						{(() => {
							return this.state.tournament.attributes.rounddescription.reverse().map((desc,i) => {
								return <div key={i} style={{width:'166px'}}>
									<div>round {i + 1}</div>
									<div>{desc.text}</div>
								</div>
							})
						})()}
					</div>
					{(() => {
						return this.renderTree(this.state.tournament.attributes.matches.data.find(m => m.attributes.depth == 0))
					})()}
				</div>
				
		
				{/* signup/checkin form */}
				{this.signupcheckinbutton()}
		
				{/* @*signedup players*@ */}
				{(this.state.tournament.ExternalTournamentLink == null) ? 
					<div>
						<table className="table table-dark table-bordered w-auto">
							<thead>
								<tr>
									<th>Player</th>
									<th>Checked in</th>
								</tr>
							</thead>
							<tbody>
								{this.state.tournament.attributes.tournament_signups.data.map((signup,i) => <tr key={i}>
									<td><a href={`/profile/${signup.attributes.users_permissions_user.data.id}`}>{signup.attributes.users_permissions_user.data.attributes.username}</a></td>
									<td>{signup.attributes.checkedin ? "yes" : "no"}</td>
								</tr>)}
							</tbody>
						</table>
					</div> : null
				}
			</div>
		</div>
	}

	renderTree(match) {
		if(match == null) {
			return;
		}
		var maxdepth = this.state.tournament.attributes.matches.data.reduce((p,c) => (c.attributes.depth > p.attributes.depth) ? c : p)
		var children = this.state.tournament.attributes.matches.data.filter(m => m.attributes.parentMatch?.data?.id == match.id)
		if(children.length == 0) {
			return this.renderCard(match);
		} else {
			return <div key={match.id} style={{"display":"inline-flex","alignItems":"center","justifyContent":"start", 'magin':match.attributes.depth == maxdepth - 2 ? '10px':''}} >
				<div style={{"display":"flex","flexDirection":"column","alignItems":"flex-end"}}>
					{children.map(child => this.renderTree(child))}
				</div>
				{this.renderCard(match)}
			</div>
		}
	}

	renderCard(match) {
		return <div key={match.id} className="matchcard" id="match-@match.Id">
			{(() => {
				if (isLoggedIn() && Date.now() > new Date(this.state.tournament.attributes.startsat)) {
					if(
						(match.attributes.player1 != null && match.attributes.player2 != null)
						&& (match.attributes.scoreReported == false)
						&& (match.attributes.player1.id == loggedinmember.id || match.attributes.player2.id == loggedinmember.id)
					) {
						<div style={{"display":"flex","flexDirection":"column"}}>
							<input placeholder="@match.Player1?.Name" type="number" name="score1"/>
							<input placeholder="@match.Player2?.Name" type="number" name="score2"/>
							<button onClick={() => {
								// match.id
								//loggedinuserid
								console.log('report score')
							}} type="submit" className="btn btn-primary">report score</button>
						</div>
					}
				}
			})()}
			<div>
				<div>{match.attributes.player1 != null ? `${match.attributes.player1.data.attributes.username}:${match.attributes.score1}` : 'TBD'}</div>
			</div>
			<div>
				<div>{match.attributes.player2 != null ? `${match.attributes.player2.data.attributes.username}:${match.attributes.score2}` : 'TBD'}</div>
			</div>
		</div>
	}

    signupcheckinbutton(){

		if (this.state.tournament.ExternalTournamentLink == null) {
			return <div style={{"margin":"10px 10px 10px 0"}}>
				{(() => {
					if(isLoggedIn()){
						var signup = this.signups.FirstOrDefault(s => s.Player.Key == this.loggedinmember.Key);
						if(signup == null) {
							return <button type="submit" onClick={() => {
								//tournamentid loggedinmemberid
								console.log('signup')
							}} className="btn btn-primary">Sign up for tournament</button>
						} else {
							if (signup.CheckedIn) {
								return <div>you're checked in</div>
							} else {
								if(Date.now() >= this.StartsAt - 3600){
									return <button type="submit" onClick={() => {
										//tournament id loggedinmemberid
										console.log('checkin')
									}} className="btn btn-primary">Check in for tournament</button>
								}
	
							}
						}
					}else{
						return <div>log in to sign up for tournaments</div>
					}
				})()}
			</div>
		}

    }
}

// @inject IMemberService MemberService;
// @{
// 	Layout = "Master.cshtml";
// 	var node = Umbraco.AssignedContentItem as Tournament;
// 	var isLoggedIn = Context.User?.Identity?.IsAuthenticated ?? false;
// 	IMember loggedinmember = null;
// 	if(isLoggedIn){
// 		loggedinmember = MemberService.GetById(Context.User.Identity.GetUserId<int>());
// 		if(loggedinmember == null) {
// 			isLoggedIn = false;
// 		}
// 	}
// 	var rounddescriptions = node.RoundDescription.ToList();
// 	var homepage = node.Root<Homepage>();
// 	//var signups = Caching.getData($"signedupplayers:{node.Id}",TimeSpan.FromMinutes(10),() => node.Descendants<TournamentSignup>().Cast<IPublishedContent>().ToList()).Cast<TournamentSignup>();
// 	var signups = node.Descendants<TournamentSignup>();
// }





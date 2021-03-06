import React from 'react';
import { Link } from 'react-router-dom';
import {get, getHost} from './utils'

export default class Tournaments extends React.Component{

	constructor(){
		super()
		this.state = {
			loaded:false,
		}
	}

	componentDidMount(){
		get('tournaments',{populate:['image'],sort:['startsat:desc'],pagination:{page:1,pageSize:300}}).then(data => {

			this.setState({
				loaded:true,
				tournaments:data.data
			})
		})
	}

	render(){
		if(this.state.loaded == false)return <div>loading</div>

		return <div>
			<h1 style={{color:'white'}}>Tournaments</h1>
			<div style={{"display":"flex","flexWrap":"wrap"}}>
				{this.state.tournaments.map(tournament => 
					<Link key={tournament.id} to={`/tournament/${tournament.id}`}>
						<div style={{"background":"white","color":"black","padding":"10px","margin":"10px","borderRadius":"3px","border":"1px solid black"}}>
							<div>{tournament.Name}</div>
							<img style={{"maxWidth":"300px"}} src={getHost() + tournament?.attributes?.image?.data?.attributes?.url}></img>
							<p>{new Date(tournament.attributes.startsat).toLocaleString()}</p>
						</div>
					</Link>
				)}
			</div>
		</div>
	}
}


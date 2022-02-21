import React from 'react';
// import ReactDOM from 'react-dom';

export default class Homepage extends React.Component{
    //get leaderboard
    //get guides/blogs
    //get tournaments with their signups count
    //login functionality

    constructor(){
        super();
        this.state = {
            tournaments:[],
        }
    }

    componentDidMount(){
        Promise.all([get('matches'),get('webpages'),get('tournaments'),get('homepage')]).then((res) => {
            var [matches,webpages,tournaments,homepage] = res
            this.setState({
                matches:matches.data,
                webpages:webpages.data,
                tournaments:tournaments.data,
                homepage:homepage.data,
            })
            console.log(res)
        })
    }

    render(){
        return <div>
            {this.state.tournaments.map(tournament => (<div key={tournament.id}>
                {tournament.attributes.title}
            </div>))}
        </div>
    }

    

    
    // return <div class="row">
    //     <div class="col-xl-9">
    //         <div class="row">
    //             <div class="col-3 d-none d-xl-block">
    //                 <img style="width:100%; padding:20px 0px 10px;" src="@homepage.Banner?.Url()" />
    //             </div>
    //             <div class="col">
    //                 <div class="row" style="padding:20px 0px 10px;">
    //                     <div class="col">
    //                         @{
    //                             var blogs = blogsnode.Children<Document>();
    //                             var guides = guidesnode.Children<Document>();
    //                             var carouselitems = blogs.Concat(guides).OrderByDescending(b => b.UpdateDate).Take(10).ToList();
    //                         }
    //                         <div style="box-shadow: 0px 8px 8px 5px #0000006b;" id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    //                         <div class="carousel-indicators">
    //                             @for(int i = 0; i < carouselitems.Count(); i++){
    //                                 var blog = carouselitems[i];
    //                                 <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="@i" class="@(blog == blogs.First() ? "active" : "")" aria-current="true" aria-label="Slide @i"></button>
    //                             }
    //                         </div>
    //                         <div class="carousel-inner">
    //                             @foreach (var item in carouselitems){
    //                                 <div style="max-height:300px;" class="carousel-item @(item == carouselitems.First() ? "active" : "") ">
    //                                     <a href="@item.Url()">
    //                                         <img style="max-height:300px; object-fit: cover; border-radius:3px;" src="@(item?.Image?.Url() ?? "/images/wh3placeholder.jpg")" class="d-block w-100" alt="...">
    //                                         <div class="carousel-caption d-none d-md-block">
    //                                             <h5 style="text-shadow: 0px 0px 6px #000000;">@item.Name</h5>
    //                                         </div>
    //                                     </a>
    //                                 </div>
    //                             }
    //                         </div>
    //                         <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    //                             <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    //                             <span class="visually-hidden">Previous</span>
    //                         </button>
    //                         <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    //                             <span class="carousel-control-next-icon" aria-hidden="true"></span>
    //                             <span class="visually-hidden">Next</span>
    //                         </button>
    //                         </div>
    //                     </div>
    //                 </div>
    //                 <div class="row">
    //                     <div class="col" style="display:flex; flex-wrap: wrap; color:black;">
    //                         @foreach (var tournament in events.Children<Tournament>().Where(t => t.StartsAt + TimeSpan.FromHours(24) >= DateTime.Now).OrderBy(t => t.StartsAt).Take(10))
    //                         {
    //                             <div class="card" style="flex-grow:1; width: 18rem; margin:0 10px 10px 0px; box-shadow: 0px 8px 8px 5px #0000006b;">
    //                             <img src="@tournament.Image?.Url()" class="card-img-top" alt="...">
    //                             <div class="card-body">
    //                                 <a href="@tournament.Url()"><h5 class="card-title">@tournament.Name</h5></a>
    //                                 <div>@tournament.StartsAt.ToShortDateString() @tournament.StartsAt.ToShortTimeString() PST</div>
    //                                     @if (tournament.ExternalTournamentLink == null) {
    //                                         <div>@(tournament.Descendants<TournamentSignup>().Count()) people signed up</div>	
    //                                     }
    //                             </div>
    //                             </div>
    //                         }
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
            
    //     </div>
    //     <div class="col-xl-3" style="">
    //         @{
    //             var players = MemberService.GetAll(0, int.MaxValue, out var totalMembers);
                
    //             var orderedplayers = Functions.GetOrderedPlayers(MemberService,Umbraco).Take(15).ToList();
                
    //         }
    //         <div style="margin: 20px 0 0; overflow-x:auto;">
    //             <table style="margin:0px;" class="w-auto table table-light table-bordered">
    //                 <thead>
    //                     <tr>
    //                         <th scope="col">#</th>
    //                         <th scope="col">Name</th>
    //                         <th scope="col">tourny wins</th>
    //                         <th scope="col">wins</th>
    //                         <th scope="col">losses</th>
    //                         <th scope="col">country</th>
    //                         <th scope="col">clan</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     @for (int i = 0; i < orderedplayers.Count(); i++){
    //                         var tuple = orderedplayers[i];
    //                         var player = tuple.player;
    //                         <tr>
    //                             <td scope="row"><b>@(tuple.placement + 1)</b></td>
    //                             <td><a href="/player-profile?playerid=@player.Id">@player.Name</a></td>
    //                             <td>@tuple.tournamentwins</td>
    //                             <td>@tuple.wins</td>
    //                             <td>@tuple.losses</td>
    //                             <td>@player.GetValue("country")</td>
    //                             <td>@player.GetValue("clan")</td>
    //                         </tr>
    //                     }
    //                 </tbody>
    //             </table>
    //         </div>
            
    //     </div>
    // </div>
}



async function get(type){
    var res = await fetch(`http://localhost:1337/api/${type}`)
    var data = await res.json()
    return data
}





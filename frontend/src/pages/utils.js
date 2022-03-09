
export async function get(type,parameters){
    var querystring = $.param(parameters)
    // var res = await fetch(`http://64.225.54.10:1337/api/${type + querystring}`)
    var res = await fetch(`${getHost()}/api/${type + '?' + querystring}`)
    var data = await res.json()
    return data
}

export async function getCustom(url,body){
    
    var headers = {
        'Content-Type': 'application/json'
    }
    if(isLoggedIn()){
        headers.Authorization = `Bearer ${getLoggedInUser().jwt}`
    }
    return fetch(`${getHost()}/api/${url}`,{
        method:'POST',
        headers: headers,
        body:JSON.stringify(body)
    }).then(res => res.json())
}

export function isLoggedIn(){
    return localStorage.getItem('logindata') != null
}

export function getLoggedInUser(){
    return JSON.parse(localStorage.getItem('logindata'))
}
export function getHost(){
    if(process.env.REACT_APP_ENVIRONMENT == 'production'){
        return 'http://157.245.119.170:1337'
    }else{
        return 'http://localhost:1337'
    }
}

export function orderUsers(users,matches){
    var userdict = {}
    for(var user of users){
        user.wins = 0
        user.tournywins = 0
        user.losses = 0
        user.draws = 0
        userdict[user.id] = user
    }

    for(var match of matches.filter(m => m.attributes.scoreReported == true)){
        var istournywin = match.attributes.depth == 0 ? 1 : 0
        if(match.attributes.score1 > match.attributes.score2){
            userdict[match.attributes.player1.data.id].wins++
            userdict[match.attributes.player1.data.id].tournywins += istournywin
            userdict[match.attributes.player2.data.id].losses++
        }else if(match.attributes.score2 > match.attributes.score1){
            userdict[match.attributes.player2.data.id].wins++
            userdict[match.attributes.player2.data.id].tournywins += istournywin
            userdict[match.attributes.player1.data.id].losses++
        }else{
            userdict[match.attributes.player1.data.id].draws++
            userdict[match.attributes.player2.data.id].draws++
        }
    }

    users.sort((a,b) => a.tournywins - b.tournywins)
    return users
}
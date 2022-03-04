// public IActionResult SignupTournament(int tournamentid,string memberguid)
// {
//     var tournament = UmbracoContext.Content.GetById(tournamentid) as Tournament;
//     var signups = tournament.Descendants<TournamentSignup>();
//     var member = Services.MemberService.GetByKey(new Guid(memberguid));
//     if(signups.Any(s => s.Player?.Key == member?.Key)) {
//         return BadRequest("already signed up");
//     }
//     if(DateTime.Now >= tournament.StartsAt) {
//         return BadRequest("tournament already started");
//     }
//     //check tournament startsat
//     //check if user already signedup
//     //optional check tournament state

//     //if all is well
//     var tournamentsignupsnode = tournament.FirstChild<TournamentSignups>();
//     if(tournamentsignupsnode == null) {
//         var signupscontent = Services.ContentService.Create("signups",tournament.Key,TournamentSignups.ModelTypeAlias);
//         Services.ContentService.SaveAndPublish(signupscontent);
//         tournamentsignupsnode = UmbracoContext.Content.GetById(signupscontent.Id) as TournamentSignups;
//     }

//     var signupcontent = Services.ContentService.Create(member.Name,tournamentsignupsnode.Key, TournamentSignup.ModelTypeAlias);
//     //signupcontent.SetValue("tournament",new GuidUdi("document",tournament.Key));
//     signupcontent.SetValue("player", new GuidUdi("member", new Guid(memberguid)));
//     Services.ContentService.SaveAndPublish(signupcontent);
//     //Ok("sign up succesfull");
//     //Caching.refresh($"signedupplayers:{tournament.Id}");
//     return RedirectToCurrentUmbracoPage();
// }

// public IActionResult CheckinTournament(int tournamentid, string memberguid) {
//     var tournament = UmbracoContext.Content.GetById(tournamentid) as Tournament;
//     var member = Services.MemberService.GetByKey(new Guid(memberguid));
//     var signups = tournament.Descendants<TournamentSignup>();
//     var signupnode = signups.FirstOrDefault(s => s?.Player?.Key == member?.Key);
//     if(DateTime.Now < (tournament.StartsAt - TimeSpan.FromHours(1))) {
//         return BadRequest($"checkins havent started yet, checkin will open at {tournament.StartsAt - TimeSpan.FromHours(1)}");
//     }  

//     if(signupnode == null) {
//         return BadRequest("not yet signed up");
//     } else {
//         var signupcontent = Services.ContentService.GetById(signupnode.Id);
//         signupcontent.SetValue("checkedIn", true);
//         Services.ContentService.SaveAndPublish(signupcontent);
//         //Ok("checkin succesfull");
//         return RedirectToCurrentUmbracoPage();
//     }
// }

// public IContent generateMatchTree(IContent parent,int playercount,List<Member> players,ref int playeri,IContent tournament, List<IContent> allmatches,ref int matchcounter, int depth, Guid matchesnodekey) {
//     //count matches
//     var self = Services.ContentService.Create("match", matchesnodekey, Match.ModelTypeAlias);
//     allmatches.Add(self);
//     self.SetValue("NextMatch", parent?.GetUdi());
//     self.SetValue("depth", depth);
//     if(playercount == 0) {

//     }else if (playercount == 1) {
//         self.SetValue("Player1", new GuidUdi("member", players[playeri++].Key));
//     } else if (playercount == 2) {
//         self.SetValue("Player1", new GuidUdi("member", players[playeri++].Key));
//         self.SetValue("Player2", new GuidUdi("member", players[playeri++].Key));
//     } else if(playercount == 3) {
//         self.SetValue("Player1", new GuidUdi("member", players[playeri++].Key));
//         generateMatchTree(self, 2, players, ref playeri, tournament, allmatches, ref matchcounter, depth + 1, matchesnodekey);
//     } else {
//         var leftsize = (int)Math.Ceiling(playercount / 2f);
//         var rightsize = (int)Math.Floor(playercount / 2f);
//         generateMatchTree(self, leftsize, players, ref playeri, tournament, allmatches, ref matchcounter, depth + 1, matchesnodekey);
//         generateMatchTree(self, rightsize, players, ref playeri, tournament, allmatches, ref matchcounter, depth + 1, matchesnodekey);
//     }
//     self.Name = $"match {matchcounter++}";
//     Services.ContentService.SaveAndPublish(self);
//     return self;
// }

// public IActionResult GenerateTournamentBracket(int tournamentid,bool includeAll = false){
//     //Umbraco.Extensions;
//     //Udi.Create()
//     //delete old matches belonging tot his tournament
//     var tournament = UmbracoContext.Content.GetById(tournamentid);
//     var oldmatchContent = Services.ContentService.GetByIds(tournament.Descendants<Match>().Select(m => m.Id)).ToList();
//     foreach (var item in oldmatchContent) {
//         Services.ContentService.Delete(item);
//     }

//     var matchesnode = tournament.FirstChild<Matches>();
//     if (matchesnode == null) {
//         var matchescontentnode = Services.ContentService.Create("matches", tournament.Key, Matches.ModelTypeAlias);
//         Services.ContentService.SaveAndPublish(matchescontentnode);
//         matchesnode = tournament.FirstChild<Matches>();
//     }




//     //var x = UmbracoContext.Content.GetById(tournamentid).Descendants<TournamentSignup>().FirstOrDefault();
//     var signedupmembers = UmbracoContext.Content.GetById(tournamentid).Descendants<TournamentSignup>().Where(s => s.CheckedIn || includeAll).Select(s => s.Value<Member>("Player")).ToList();
//     int playeri = 0;
//     var generatedMatches = new List<IContent>();
//     int matchcounter = 1;
//     generateMatchTree(null, signedupmembers.Count, signedupmembers, ref playeri, Services.ContentService.GetById(tournamentid), generatedMatches, ref matchcounter,0, matchesnode.Key);

//     var ipubmatches = generatedMatches.Select(m => UmbracoContext.Content.GetById(m.Id) as Match).ToList();

//     return Ok(SerializeMatches(ipubmatches));
// }

// public IActionResult ReportScore(int matchid, string memberguid, int score1,int score2)
// {
//     var match = Services.ContentService.GetById(matchid);
//     var pubmatch = UmbracoContext.Content.GetById(matchid) as Match;
//     if (
//         (pubmatch.Player1?.Key == new Guid(memberguid) || pubmatch.Player2?.Key == new Guid(memberguid))
//         &&
//         (pubmatch.Player1ScoreReported == false || pubmatch.Player2ScoreReported == false)
//     ) {
//         match.SetValue("score1", score1);
//         match.SetValue("player1ScoreReported", true);
//         match.SetValue("score2", score2);
//         match.SetValue("player2ScoreReported", true);
//         Services.ContentService.SaveAndPublish(match);

//         pubmatch = UmbracoContext.Content.GetById(matchid) as Match;
//         if (pubmatch.Player1ScoreReported && pubmatch.Player2ScoreReported) {
//             var winner = pubmatch.Player1;
//             if (pubmatch.Score2 > pubmatch.Score1) {
//                 winner = pubmatch.Player2;
//             }

//             var nextmatch = pubmatch?.NextMatch?.SafeCast<Match>();
//             if (nextmatch != null) {
//                 var contentnextmatch = Services.ContentService.GetById(nextmatch.Id);
//                 if (nextmatch?.Player1 == null) {
//                     contentnextmatch.SetValue("player1", new GuidUdi("member", winner.Key));
//                 } else if (nextmatch?.Player2 == null) {
//                     contentnextmatch.SetValue("player2", new GuidUdi("member", winner.Key));
//                 }
//                 Services.ContentService.SaveAndPublish(contentnextmatch);
//             }
//         }
//         return RedirectToCurrentUmbracoPage();
//     } else {
//         return BadRequest("score not updated");
//     }
// }

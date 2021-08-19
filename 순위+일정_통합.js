// 리그 설정
const id = "130"
const s = "39182"

// MyTeam 설정
// 울산:2646 전북:2631 수원삼성:2637 대구:2645 수원FC:2629 포항:2649 인천:2641 제주:2628 강원:2624 서울:2640 광주:2634 성남:2644
const myTeamId = "2637"
let myTeamColor = "#FFFF00"
let txColor = "#FFFFFF"
let logoColor = "#FFFFFF"
let highlightColor = "#FFFFFF"
let titleTxColor = "#FFFFFF"
let titleColor = ""
let bgColor = ""
let underBarColor = ""
let underBarOpacity = 1
getColor(myTeamId)

const widget = new ListWidget()
if (myTeamId != "2644")
    widget.backgroundColor = new Color(bgColor, 1)
else
    widget.backgroundColor = new Color(bgColor, 0.9)

const backgroundStack = widget.addStack()
backgroundStack.layoutHorizontally()
const standingStack = backgroundStack.addStack()
standingStack.layoutVertically()
standingStack.size = new Size(160, 160)
const dummyStack = backgroundStack.addStack()
dummyStack.size = new Size(10, 160)
const scheduleStack = backgroundStack.addStack()
scheduleStack.layoutVertically()
scheduleStack.size = new Size(155, 160)

// 순위 코드 Start -----------------------------------------------------------------------------------------------
// "K LEAGUE" Title
const headStack = standingStack.addStack()
headStack.layoutHorizontally()
headStack.size = new Size(153, 22)
const a = headStack.addText("K ")
a.font = Font.boldMonospacedSystemFont(15)
a.textColor = new Color(logoColor, 1)
const b = headStack.addText("LEAGUE")
b.font = Font.semiboldRoundedSystemFont(15)
b.textColor = new Color(logoColor, 1)

// 순위 데이터 얻기
const url = `https://feedmonster.onefootball.com/feeds/il/en/competitions/${id}/${s}/standings.json`
const req = new Request(url)
const res = await req.loadJSON()

// 순위 데이터 화면에 출력
const titleStack = standingStack.addStack()
titleStack.layoutHorizontally()
titleStack.backgroundColor = new Color(titleColor, 1)
titleStack.cornerRadius = 3
titleStack.setPadding(5, 2, 0, 2)
createStack(titleStack, '순위', 25, 1)
createStack(titleStack, '팀', 14, 1)
createStack(titleStack, '경기', 25, 1)
createStack(titleStack, '승', 20, 1)
createStack(titleStack, '무', 20, 1)
createStack(titleStack, '패', 20, 1)
createStack(titleStack, '승점', 25, 1)

let myTeamRanking = 0
for (const item of res.groups[0].ranking) {
    if (item.team.idInternal == myTeamId) {
        myTeamRanking = item.index
        if (myTeamRanking < 3)
            myTeamRanking = 3
        else if (myTeamRanking > 10)
            myTeamRanking = 10
        break
    }
}

for (const item of res.groups[0].ranking) {
    const ranking = item.index
    if (Math.abs(ranking - myTeamRanking) <= 2) {
        const teamStack = standingStack.addStack()
        teamStack.layoutHorizontally()
        teamStack.setPadding(4, 0, 0, 0)

        // 순위, 구단명, 경기수, 승, 무, 패, 득실차
        const ranking = item.index
        const playedNum = item.team.teamstats.played
        const winNum = item.team.teamstats.won
        const drawNum = item.team.teamstats.drawn
        const loseNum = item.team.teamstats.lost
        const point = item.team.teamstats.points

        // 챔스권 팀 설정
        const clStack = teamStack.addStack()
        clStack.size = new Size(2, 14)
        clStack.cornerRadius = 2
        if (ranking <= 3)
            clStack.backgroundColor = new Color(highlightColor, 1)
        // 강등권 팀 설정
        else if (ranking >= 11)
            clStack.backgroundColor = new Color(highlightColor, 1)

        createStack(teamStack, `${ranking}`, 25, 0)
        const teamImage = await loadImage(`https://images.onefootball.com/icons/teams/56/${item.team.idInternal}.png`)
        const teamImagewidget = teamStack.addImage(teamImage)
        teamImagewidget.imageSize = new Size(14, 14)
        createStack(teamStack, `${playedNum}`, 25, 0)
        createStack(teamStack, `${winNum}`, 20, 0)
        createStack(teamStack, `${drawNum}`, 20, 0)
        createStack(teamStack, `${loseNum}`, 20, 0)
        createStack(teamStack, `${point}`, 27, 0)

        // MyTeam 설정
        if (item.team.idInternal == myTeamId) {
            teamStack.backgroundColor = new Color(myTeamColor, 0.3)
            if (myTeamId == "2644")
                teamStack.backgroundColor = new Color(myTeamColor, 0.2)
        }
        const underStack = standingStack.addStack()
        underStack.size = new Size(153, 1)
        underStack.borderColor = new Color(underBarColor, underBarOpacity)
        underStack.borderWidth = 1
    }
}
// 순위 코드 End -----------------------------------------------------------------------------------------------

// 일정 코드 Start -----------------------------------------------------------------------------------------------
// MatchDay 데이터 얻기
const matchDayUrl = `https://feedmonster.onefootball.com/feeds/il/en/competitions/${id}/${s}/matchdaysOverview.json`
const req1 = new Request(matchDayUrl)
const matchDayJson = await req1.loadJSON()

// MyTeam의 NextMatch 데이터 얻기
let closeMatchHometeamName = ""
let closeMatchAwayteamName = ""
let closeMatchHometeamId = 0
let closeMatchAwayteamId = 0
let closeMatchMonth = 13
let closeMatchDay = 32
let closeMatchHours = 0
let closeMatchMinutes = 0
let closeMatchDayofTheWeek = 0

for (const matchday of matchDayJson.matchdays) {
    const matchUrl = `https://api.onefootball.com/scores-mixer/v1/en/cn/matchdays/${matchday.id}`
    const req2 = new Request(matchUrl)
    const matchJson = await req2.loadJSON()

    // 예정경기 중 가장이른 경기찾기
    for (const item of matchJson.kickoffs) {
        for (const match of item.groups[0].matches) {
            if (match.period == "PreMatch" && (match.team_home.id == myTeamId || match.team_away.id == myTeamId)) {
                const date = new Date(item.kickoff)
                if (date.getMonth() < closeMatchMonth) {
                    closeMatchHometeam = match.team_home.name
                    closeMatchAwayteam = match.team_away.name
                    closeMatchHometeamId = match.team_home.id
                    closeMatchAwayteamId = match.team_away.id
                    closeMatchMonth = date.getMonth()
                    closeMatchDay = date.getDate()
                    closeMatchHours = date.getHours()
                    closeMatchMinutes = date.getMinutes()
                    closeMatchDayofTheWeek = date.getDay()
                }
                else if (date.getMonth() == closeMatchMonth && date.getDate() < closeMatchDay) {
                    closeMatchHometeam = match.team_home.name
                    closeMatchAwayteam = match.team_away.name
                    closeMatchHometeamId = match.team_home.id
                    closeMatchAwayteamId = match.team_away.id
                    closeMatchMonth = date.getMonth()
                    closeMatchDay = date.getDate()
                    closeMatchHours = date.getHours()
                    closeMatchMinutes = date.getMinutes()
                    closeMatchDayofTheWeek = date.getDay()
                }
            }
        }
    }
}
closeMatchHometeam = enToKr(closeMatchHometeam)
closeMatchAwayteam = enToKr(closeMatchAwayteam)

// MatchDay 날짜 출력
const matchDayTitle = scheduleStack.addStack()
matchDayTitle.size = new Size(155, 22)
matchDayTitle.setPadding(4, 0, 0, 0)
let minutes = ""
if (closeMatchMinutes < 10)
    minutes = `0${closeMatchMinutes}`
else
    minutes = `${closeMatchMinutes}`
const DayOfTheWeek = getDayOfTheWeek(closeMatchDayofTheWeek)
const c = matchDayTitle.addText(`${closeMatchMonth + 1}.${closeMatchDay} ${DayOfTheWeek}  ${closeMatchHours}:${minutes}`)
c.font = Font.boldMonospacedSystemFont(12)
c.textColor = new Color(txColor, 1)
c.centerAlignText()

// MatchDay 팀정보 출력
const matchTeamTitle = scheduleStack.addStack()
matchDayTitle.size = new Size(155, 36)
const homeTeamImage = await loadImage(`https://images.onefootball.com/icons/teams/56/${closeMatchHometeamId}.png`)
const awayTeamImage = await loadImage(`https://images.onefootball.com/icons/teams/56/${closeMatchAwayteamId}.png`)
matchTeamTitle.layoutHorizontally()

const homeImage = matchTeamTitle.addImage(homeTeamImage) // Hometeam Image
homeImage.imageSize = new Size(25, 25)

const hometeamNameStack = matchTeamTitle.addStack()      // Hometeam Name
hometeamNameStack.size = new Size(45, 36)
hometeamNameStack.setPadding(4, 0, 0, 0)
hometeamName = hometeamNameStack.addText(closeMatchHometeam)
if (closeMatchHometeam == "수원FC" || closeMatchAwayteam == "수원FC")
    hometeamName.font = Font.boldMonospacedSystemFont(12)
else
    hometeamName.font = Font.boldMonospacedSystemFont(14)
hometeamName.textColor = new Color(txColor, 1)

const vsStack = matchTeamTitle.addStack()                // "VS"
vsStack.size = new Size(15, 36)
vsStack.setPadding(6, 0, 0, 0)
vs = vsStack.addText("VS")
vs.font = Font.boldMonospacedSystemFont(10)
vs.textColor = new Color(txColor, 1)

const awayteamNameStack = matchTeamTitle.addStack()      // Away Name
awayteamNameStack.size = new Size(45, 36)
awayteamNameStack.setPadding(4, 0, 0, 0)
awayteamName = awayteamNameStack.addText(closeMatchAwayteam)
if (closeMatchHometeam == "수원FC" || closeMatchAwayteam == "수원FC")
    awayteamName.font = Font.boldMonospacedSystemFont(12)
else
    awayteamName.font = Font.boldMonospacedSystemFont(14)
awayteamName.textColor = new Color(txColor, 1)

const awayImage = matchTeamTitle.addImage(awayTeamImage) // Away Image
awayImage.imageSize = new Size(25, 25)

// MatchDay 구장정보 출력
const matchstadiumTitle = scheduleStack.addStack()
matchstadiumTitle.size = new Size(155, 22)
matchstadiumTitle.setPadding(4, 0, 0, 0)
const matchstadium = getMatchStadium(closeMatchHometeam)
const d = matchstadiumTitle.addText(matchstadium)
d.font = Font.boldMonospacedSystemFont(10)
d.textColor = new Color(txColor, 1)
d.centerAlignText()

// 일정 코드 End -----------------------------------------------------------------------------------------------

// 관련 함수
function createStack(stack, text, width, isTitle) {
    const element = stack.addStack()
    element.size = new Size(width, 16)
    const elementText = element.addText(text)
    elementText.font = Font.mediumRoundedSystemFont(11)
    elementText.textColor = new Color(txColor, 1)
    if (isTitle == 1) {
        elementText.textColor = new Color(titleTxColor, 1)
        elementText.font = Font.mediumRoundedSystemFont(10)
    }
}

function enToKr(name) {
    if (name == "Ulsan")
        return "울산"
    else if (name == "Jeonbuk Motors")
        return "전북"
    else if (name == "Suwon Bluewings")
        return "수원"
    else if (name == "Daegu")
        return "대구"
    else if (name == "Suwon")
        return "수원FC"
    else if (name == "Pohang Steelers")
        return "포항"
    else if (name == "Incheon United")
        return "인천"
    else if (name == "Jeju United")
        return "제주"
    else if (name == "Gangwon")
        return "강원"
    else if (name == "Seoul")
        return "서울"
    else if (name == "Gwangju")
        return "광주"
    else if (name == "Seongnam")
        return "성남"
}

// 울산:2646 전북:2631 수원삼성:2637 대구:2645 수원FC:2629 포항:2649 인천:2641 제주:2628 강원:2624 서울:2640 광주:2634 성남:2644
function getColor(id) {
    if (id == "2646") {
        bgColor = "#014099"
        titleColor = "#1D2D5C"
        underBarColor = "#F9BE00"
    }
    else if (id == "2631") {
        bgColor = "#85D641"
        titleColor = "#276A52"
        underBarColor = "#F9BE00"
        myTeamColor = "#276A52"
    }
    else if (id == "2637") {
        bgColor = "#194996"
        titleColor = "#E71A0F"
        underBarColor = "#FFFFFF"
        underBarOpacity = 0.5
    }
    else if (id == "2645") {
        bgColor = "#8FCFF1"
        titleColor = "#0072BC"
        underBarColor = "#FFFFFF"
        underBarOpacity = 0.5
    }
    else if (id == "2629") {
        bgColor = "#013A70"
        titleColor = "#EB0028"
        underBarColor = "#EB0028"
    }
    else if (id == "2649") {
        bgColor = "#AD181D"
        titleColor = "#000000"
        underBarColor = "#000000"
    }
    else if (id == "2641") {
        bgColor = "#2E57A6"
        titleColor = "#000000"
        underBarColor = "#000000"
        logoColor = "FBC808"
        highlightColor = "FBC808"
    }
    else if (id == "2628") {
        bgColor = "#F58125"
        titleColor = "#E51937"
        underBarColor = "#FFFFFF"
        underBarOpacity = 0.5
    }
    else if (id == "2624") {
        bgColor = "#DD5828"
        titleColor = "#006058"
        underBarColor = "#FABF00"
    }
    else if (id == "2640") {
        bgColor = "#B5191A"
        titleColor = "#000000"
        underBarColor = "#A28848"
        logoColor = "#A28848"
        highlightColor = "#A28848"
    }
    else if (id == "2634") {
        bgColor = "#FFD24F"
        titleColor = "#C41230"
        underBarColor = "#C41230"
        logoColor = "#C41230"
        txColor = "#C41230"
        highlightColor = "#C41230"
        myTeamColor = "#C41230"
        underBarOpacity = 0.5
    }
    else if (id == "2644") {
        bgColor = "#000000"
        titleColor = "#FFFFFF"
        underBarColor = "#FFFFFF"
        titleTxColor = "#000000"
        myTeamColor = "#FFFFFF"
        underBarOpacity = 0.5
    }
}

function getDayOfTheWeek(day) {
    if (day == 0)
        return "(일)"
    else if (day == 1)
        return "(월)"
    else if (day == 2)
        return "(화)"
    else if (day == 3)
        return "(수)"
    else if (day == 4)
        return "(목)"
    else if (day == 5)
        return "(금)"
    else
        return "(토)"
}

function getMatchStadium(homeTeam) {
    if (homeTeam == "울산")
        return "울산 문수 축구경기장"
    else if (homeTeam == "전북")
        return "전주 월드컵 경기장"
    else if (homeTeam == "수원")
        return "수원 월드컵 경기장"
    else if (homeTeam == "대구")
        return "DGB대구은행파크"
    else if (homeTeam == "수원FC")
        return "수원 종합 운동장"
    else if (homeTeam == "포항")
        return "포항 스틸야드"
    else if (homeTeam == "인천")
        return "인천 축구 전용경기장"
    else if (homeTeam == "제주")
        return "제주 월드컵 경기장"
    else if (homeTeam == "강원")
        return "강릉 종합 운동장"
    else if (homeTeam == "서울")
        return "서울 월드컵 경기장"
    else if (homeTeam == "광주")
        return "광주 축구 전용경기장"
    else if (homeTeam == "성남")
        return "탄천 종합 운동장"
}

async function loadImage(imgUrl) {
    let req = new Request(imgUrl)
    let image = await req.loadImage()
    return image
}

Script.setWidget(widget)
Script.complete()
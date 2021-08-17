// 리그 설정
const id= "130"
const s = "39182"

// MyTeam 설정
// 울산:2646 전북:2631 수원삼성:2637 대구:2645 수원FC:2629 포항:2649 인천:2641 제주:2628 강원:2624 서울:2640 광주:2634 성남:2644
const myTeamId = "2646" 
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
if(myTeamId != "2644")
    widget.backgroundColor = new Color(bgColor, 1)
else
    widget.backgroundColor = new Color(bgColor, 0.9)

// "K LEAGUE" Title
const headStack = widget.addStack()
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
const titleStack = widget.addStack()
titleStack.layoutHorizontally()
titleStack.backgroundColor = new Color(titleColor, 1)
titleStack.cornerRadius = 3
titleStack.setPadding(5, 2, 0, 1)
createStack(titleStack, '순위', 25, 1)
createStack(titleStack, '팀', 14, 1)
createStack(titleStack, '경기', 25, 1)
createStack(titleStack, '승', 20, 1)
createStack(titleStack, '무', 20, 1)
createStack(titleStack, '패', 20, 1)
createStack(titleStack, '승점', 25, 1)

let myTeamRanking = 0
for (const item of res.groups[0].ranking){
    if(item.team.idInternal == myTeamId){
        myTeamRanking = item.index
        if(myTeamRanking < 3)
            myTeamRanking = 3
        else if(myTeamRanking > 10)
            myTeamRanking = 10
        break
    }
}

for (const item of res.groups[0].ranking){
    const ranking = item.index
    if(Math.abs(ranking - myTeamRanking) <= 2){
        const teamStack = widget.addStack()
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
        createStack(teamStack, `${point}`, 26, 0)

        // MyTeam 설정
        if(item.team.idInternal == myTeamId){
            teamStack.backgroundColor = new Color(myTeamColor, 0.3)
            if(myTeamId == "2644")
                teamStack.backgroundColor = new Color(myTeamColor, 0.2)
        } 
        const underStack = widget.addStack()
        underStack.size = new Size(152, 1)
        underStack.borderColor = new Color(underBarColor, underBarOpacity)
        underStack.borderWidth = 1
    }
}

function createStack(stack, text, width, isTitle) {
    const element = stack.addStack()
    element.size = new Size(width, 16)
    const elementText = element.addText(text)
    elementText.font = Font.mediumRoundedSystemFont(11)
    elementText.textColor = new Color(txColor, 1)
    if (isTitle == 1){
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
function getColor(id){
    if (id == "2646"){
        bgColor = "#014099"
        titleColor = "#1D2D5C"
        underBarColor = "#F9BE00"
    }
    else if (id == "2631"){
        bgColor = "#85D641"
        titleColor = "#276A52"
        underBarColor = "#F9BE00"
        myTeamColor = "#276A52"
    }
    else if (id == "2637"){
        bgColor = "#194996"
        titleColor = "#E71A0F"
        underBarColor = "#FFFFFF"
        underBarOpacity = 0.5
    }
    else if (id == "2645"){
        bgColor = "#8FCFF1"
        titleColor = "#0072BC"
        underBarColor = "#FFFFFF"
        underBarOpacity = 0.5
    }
    else if (id == "2629"){
        bgColor = "#013A70"
        titleColor = "#EB0028"
        underBarColor = "#EB0028"
    }
    else if (id == "2649"){
        bgColor = "#AD181D"
        titleColor = "#000000"
        underBarColor = "#000000"
    }
    else if (id == "2641"){
        bgColor = "#2E57A6"
        titleColor = "#000000"
        underBarColor = "#000000"
        logoColor = "FBC808"
        highlightColor = "FBC808"
    }
    else if (id == "2628"){
        bgColor = "#F58125"
        titleColor = "#E51937"
        underBarColor = "#FFFFFF"
        underBarOpacity = 0.5
    }
    else if (id == "2624"){
        bgColor = "#DD5828"
        titleColor = "#006058"
        underBarColor = "#FABF00"
    }
    else if (id == "2640"){
        bgColor = "#B5191A"
        titleColor = "#000000"
        underBarColor = "#A28848"
        logoColor = "#A28848"
        highlightColor = "#A28848"
    }
    else if (id == "2634"){
        bgColor = "#FFD24F"
        titleColor = "#C41230"
        underBarColor = "#C41230"
        logoColor = "#C41230"
        txColor = "#C41230"
        highlightColor = "#C41230"
        myTeamColor = "#C41230"
        underBarOpacity = 0.5
    }
    else if (id == "2644"){
        bgColor = "#000000"
        titleColor = "#FFFFFF"
        underBarColor = "#FFFFFF"
        titleTxColor = "#000000"
        myTeamColor = "#FFFFFF"
        underBarOpacity = 0.5
    }
}

async function loadImage(imgUrl) {
    let req = new Request(imgUrl)
    let image = await req.loadImage()
    return image
}

Script.setWidget(widget)
Script.complete()
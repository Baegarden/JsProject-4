const widget = new ListWidget()
widget.backgroundColor = new Color("#AD181D ", 1)

// K league Title
const headStack = widget.addStack()
headStack.layoutHorizontally()
headStack.size = new Size(155, 22)
const a = headStack.addText("K ")
a.font = Font.boldMonospacedSystemFont(15)
a.textColor = new Color("#FFFFFF", 1)
const b = headStack.addText("LEAGUE")
b.font = Font.semiboldRoundedSystemFont(15)
b.textColor = new Color("#FFFFFF", 1)

// K League id:130 s:39182
const id= "130"
const s = "39182"

// 울산:2646 전북:2631 수원삼성:2637 대구:2645 수원FC:2629 포항:2649
// 인천:2641 제주:2628 강원:2624 서울:2640 광주:2634 성남:2644
const myTeamId = "2649" // 포항

// 데이터 얻기
const url = `https://feedmonster.onefootball.com/feeds/il/en/competitions/${id}/${s}/standings.json`
const req = new Request(url)
const res = await req.loadJSON()

// 데이터 화면에 출력
const titleStack = widget.addStack()
titleStack.layoutHorizontally()
titleStack.backgroundColor = new Color("#000000", 1)
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
            clStack.backgroundColor = new Color("#000000", 1)
        // 강등권 팀 설정
        else if (ranking >= 11)
            clStack.backgroundColor = new Color("#000000", 1)

        createStack(teamStack, `${ranking}`, 25, 0)
        const teamImage = await loadImage(`https://images.onefootball.com/icons/teams/56/${item.team.idInternal}.png`)
        const teamImagewidget = teamStack.addImage(teamImage)
        teamImagewidget.imageSize = new Size(14, 14)
        createStack(teamStack, `${playedNum}`, 25, 0)
        createStack(teamStack, `${winNum}`, 20, 0)
        createStack(teamStack, `${drawNum}`, 20, 0)
        createStack(teamStack, `${loseNum}`, 20, 0)
        createStack(teamStack, `${point}`, 25, 0)

        // MyTeam 설정
        if(item.team.idInternal == myTeamId) 
            teamStack.backgroundColor = new Color("#FFFF00", 0.3)
        const underStack = widget.addStack()
        underStack.size = new Size(151, 1)
        underStack.borderColor = new Color("#000000", 1)
        underStack.borderWidth = 1
    }
}

function createStack(stack, text, width, isTitle) {
    const element = stack.addStack()
    element.size = new Size(width, 16)
    const elementText = element.addText(text)
    elementText.font = Font.mediumRoundedSystemFont(11)
    elementText.textColor = new Color("#FFFFFF", 1)
    if (isTitle == 1){
        elementText.textColor = new Color("#FFFFFF", 1)
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

async function loadImage(imgUrl) {
    let req = new Request(imgUrl)
    let image = await req.loadImage()
    return image
}

Script.setWidget(widget)
Script.complete()
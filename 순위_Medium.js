const widget = new ListWidget()
const headStack = widget.addStack()
headStack.layoutHorizontally()
headStack.size = new Size(328, 22)
const a = headStack.addText("K ")
a.font = Font.boldMonospacedSystemFont(15)
a.textColor = new Color("#001D49", 1)
const b = headStack.addText("LEAGUE")
b.font = Font.semiboldRoundedSystemFont(15)
b.textColor = new Color("#001D49", 1)

// K League id:130 s:39182
const id= "130"
const s = "39182"

// 울산:2646 전북:2631 수원삼성:2637 대구:2645 수원FC:2629 포항:2649
// 인천:2641 제주:2628 강원:2624 서울:2640 광주:2634 성남:2644
const myTeamId = "2634" // 수원

// 데이터 얻기
const url = `https://feedmonster.onefootball.com/feeds/il/en/competitions/${id}/${s}/standings.json`
const req = new Request(url)
const res = await req.loadJSON()

// 데이터 화면에 출력
const titleStack = widget.addStack()
titleStack.layoutHorizontally()
titleStack.backgroundColor = new Color("#001D49", 1)
titleStack.cornerRadius = 3
titleStack.setPadding(4, 0, 2, 3)
createStack(titleStack, ' 순위', 30, 1)
createStack(titleStack, ' 구단명', 140, 1)
createStack(titleStack, '경기수', 35, 1)
createStack(titleStack, ' 승', 30, 1)
createStack(titleStack, ' 무', 30, 1)
createStack(titleStack, ' 패', 30, 1)
createStack(titleStack, ' 승점', 30, 1)

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
        teamStack.setPadding(3, 0, 1, 3)

        // 순위, 구단명, 경기수, 승, 무, 패, 득실차
        const ranking = item.index

        // const teamName = item.team.name -> 팀명 영어
        const teamName = enToKr(item.team.name)
        const playedNum = item.team.teamstats.played
        const winNum = item.team.teamstats.won
        const drawNum = item.team.teamstats.drawn
        const loseNum = item.team.teamstats.lost
        const point = item.team.teamstats.points

        // 챔스권 팀 설정
        const clStack = teamStack.addStack()
        clStack.size = new Size(2, 16)
        clStack.cornerRadius = 2
        if (ranking <= 3)
            clStack.backgroundColor = new Color("#0000FF", 1)

        // 강등권 팀 설정
        else if (ranking >= 11)
            clStack.backgroundColor = new Color("#FF0044", 1)

        createStack(teamStack, `${ranking}`, 30, 0)
        const teamImage = await loadImage(`https://images.onefootball.com/icons/teams/56/${item.team.idInternal}.png`)
        const teamImagewidget = teamStack.addImage(teamImage)
        teamImagewidget.imageSize = new Size(16, 16)
        createStack(teamStack, `${teamName}`, 120, 0)
        createStack(teamStack, `${playedNum}`, 40, 0)
        createStack(teamStack, `${winNum}`, 30, 0)
        createStack(teamStack, `${drawNum}`, 30, 0)
        createStack(teamStack, `${loseNum}`, 30, 0)
        createStack(teamStack, `${point}`, 30, 0)

        // MyTeam 설정
        if(item.team.idInternal == myTeamId) {
            teamStack.backgroundColor = new Color("ffff00", 0.2)
            teamStack.cornerRadius = 3
        }
        const underStack = widget.addStack()
        underStack.size = new Size(328, 1)
        underStack.borderColor = new Color("#001D49", 0.1)
        underStack.borderWidth = 1
    }
}

function createStack(stack, text, width, isTitle) {
    const element = stack.addStack()
    element.size = new Size(width, 16)
    const elementText = element.addText(text)
    elementText.font = Font.mediumRoundedSystemFont(13)
    if (isTitle == 1){
        elementText.textColor = new Color("#FFFFFF", 1)
        elementText.font = Font.mediumRoundedSystemFont(12)
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
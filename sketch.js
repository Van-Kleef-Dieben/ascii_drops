
let grid = []
let sizeX
let sizeY

let vkdPeriod = 300
let lastVKDframeCount = vkdPeriod
let frameCount = 0;

let direction = false
let string = "###-##-###"
let font = "iA Writer Mono"

// let f = 100;
// let myNumberMin = 0;
// let myNumberMax = 1000;
// let myNumberStep = 10;

let gui;

const dX = 15

const dY = 23

let fp = 0.02
let df = 20
let dv = 5000
let vp = 0.01
let chars = " .:-=+#▓▒░█"
let c = "#222"
let o = false

function setup() {

	var qs = QuickSettings.create(10, 10, "Rain drops", document.querySelector("body")[0]);
	qs.addRange("flow", 0, 0.5, fp, 0.01, (e) => { fp = e})
	qs.addRange("drop frequency", 1, 300, df, 1, (e) => { df = e})
	qs.addRange("drop volume", 1, 15000, dv, 1, (e) => { dv = e})
	qs.addRange("vaporization", 0, 0.1, vp, 0.001, (e) => { vp = e})
	qs.addText("ASCII chars", chars, (e) => { chars = e });    
	qs.addColor("color", c, e => { console.log(e); c = color(e) });                  // creates a color input    
	qs.addBoolean("opacity", o, e => o = e)



	let w = displayWidth
	let h = 400

	createCanvas(w, h);
	textFont(font)
	// textStyle("bold")
	textSize(20)
	textAlign(CENTER, TOP)

	sizeX = (w / dX) | 0
	sizeY = (h / dY) | 0

	for (let i = 0; i < sizeX; i++) 
	{
		grid[i] = []
		for (let j = 0; j < sizeY; j++) 
		{
			grid[i][j] = 
			{ 
				amount: 0,
				_amount: 0
			}
		}
	}
}

function addDrop()
{
	let x = random(sizeX) | 0
	let y = random(sizeY) | 0

	if (x >= sizeX || y >= sizeY)
	{
		return;
	}

	grid[x][y].amount = dv
}

function updateGrid()
{
			
	for (let i = 0; i < sizeX; i++) 
	{
		for (let j = 0; j < sizeY; j++) 
		{

			let p0 = grid[i][j]
			p0._amount += p0.amount
			let flow = 0

			for (const {a, b } of [{a: -1, b: 0}, {a: 1, b: 0}, {a: 0, b: -1}, {a: 0, b: 1}])
			{
				if (i + a >= 0 && i + a < sizeX && j + b >= 0 && j + b < sizeY)
				{
					let p1 = grid[i + a][j + b];

					if (p1.amount < p0.amount)
					{
						let f = (p0.amount - p1.amount) * fp
						p1._amount += f
						flow += f
						p0._amount -= f
					}
				}
				
			}
		
			

		}
	}

	for (let i = 0; i < sizeX; i++) 
	{
		for (let j = 0; j < sizeY; j++) 
		{
			let p = grid[i][j]
			p.amount = p._amount * (1 - vp)
			p._amount = 0
		}
	}
}

function drawGrid()
{
	for (let i = 0; i < sizeX; i++) 
	{
		for (let j = 0; j < sizeY; j++) 
		{
			let p = grid[i][j]

			const index = min((p.amount / 256 * chars.length) | 0, chars.length - 1)
			
			textAlign("left, top")
			

			if (o)
			{
				let cc = color(c)
				cc.setAlpha(min(p.amount, 256))
				fill(cc)
			} 
			else
			{
				fill(c)
			}
			text(chars[index], i * dX, j * dY)
		}
	}
}

function draw() 
{

	frameCount++

	if ((frameCount + (random(20) | 0)) % df === 0)
	{
		addDrop()
	}

	clear()
	background(255)
	
	updateGrid()
	drawGrid()

}
	


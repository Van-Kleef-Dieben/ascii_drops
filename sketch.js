
let grid = []
let sizeX
let sizeY
let maxAge = 256

let vkdPeriod = 300
let lastVKDframeCount = vkdPeriod
let frameCount = 0;

let direction = false
let string = "###-##-###"
let font = "iA Writer Mono"

const dX = 15
const dY = 23

const fp = 0.01

function setup() {

	let w = displayWidth
	let h = 400

	createCanvas(w, h);
	textFont(font)
	textStyle("bold")
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

	// vkd((sizeX / 2 - string.length / 2)| 0, sizeY / 2 | 0 )
}

function mouseClicked()
{
	let x = mouseX / dX | 0
	let y = mouseY / dY | 0

	if (x >= sizeX || y >= sizeY)
	{
		return;
	}

	grid[x][y].amount = 4300
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
			p.amount = p._amount
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

			const chars = [ "", ".", "░",  "▒", "▓",  "█" ]
			const index = min((p.amount / maxAge * chars.length) | 0, chars.length - 1)
			
			textAlign("left, top")
			const c = color("black")
			fill(c)
			text(chars[index], i * dX, j * dY)
		}
	}
}

function draw() 
{

	frameCount++

	clear()
	background(255)
	
	updateGrid()
	drawGrid()

}
	


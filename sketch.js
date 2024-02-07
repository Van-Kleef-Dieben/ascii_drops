
let grid = []
let sizeX
let sizeY
let maxAge = 255

let direction = false
let string = "VAN KLEEF-DIEBEN"
let font = "iA Writer Mono"

const dX = 15
const dY = 23

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
			grid[i][j] = { letter: null, age: 0 }
		}
	}

	vkd((sizeX / 2 - string.length / 2)| 0, sizeY / 2 | 0 )
}

function vkd(x, y)
{
	let s = string
	let v 
	let max
	
	direction = !direction

	if (direction)
	{
		v = x
		max = sizeX
	}
	else
	{
		v = y
		max = sizeY
	}

	for (let i = 0; i < s.length; i++) {

		if (v + i >= max)
		{
			continue
		}

		if (direction)
		{
			grid[x + i][y] = { letter: s[i], age: 300, color: color("#444"), count: 4, class: "source" }
		
		}
		else
		{
			grid[x][y + i] = { letter: s[i], age: 300, color: color("#444"), count: 4, class: "source" }
		}

		
	}
}

function random_vkd() 
{
	let x
	let y

	let found = false

	while(!found)
	{
		x = random(sizeX) | 0
		y = random(sizeY - 4) | 0  + 2

		if (y > (sizeY - string.length / 2))
		{
			continue
		}

		// found = getNeighbors(x, y, 5).length > 2
		found = true
	}

	vkd(x, y)

}

function getNeighbors(x, y, r)
{
	let neighbors = []
	for (let i = x - r + 1; i < x + r; i++) 
	{
		for (let j = y - r + 1; j < y + r; j++) 
		{
			if (i < 0 || i >= sizeX || j < 0 || j >= sizeY)
			{
				continue;
			}

			if (grid[i][j].letter !== null)
			{
				neighbors.push(grid[i][j])
			}
		} 
	}

	return neighbors;
}

function calculateFood(x, y)
{
	let neighbors = getNeighbors(x, y, 3);

	if (neighbors.length === 0)
	{
		return 0
	}

	let food = neighbors.reduce((total, neighbor) => { return max(total, neighbor.age) }, 0)

	return food
}

function draw() {
	
	clear()
	for (let i = 0; i < sizeX; i++) 
	{
		for (let j = 0; j < sizeY; j++) 
		{
			if (grid[i][j].letter !== null)
			{
				let c = grid[i][j].color
				c.setAlpha(grid[i][j].age)
				fill(c)
				text(grid[i][j].letter, i * dX, j * dY)

				if (grid[i][j].class === "food")
				{
					let chars = [ "░",  "▒", "▓",  "█", ".", ]
					grid[i][j].letter = chars[(grid[i][j].age / maxAge * chars.length | 0)]
				}
				
				
				if (grid[i][j].class === "source" && grid[i][j].age < 200)
				{
					chars =[ ":", "."]
					grid[i][j].age -= random() * 3
					if (random() * 20 > 15) 
					{
						grid[i][j].letter = chars[random() * chars.length | 0]
					}
					
				}

				//if (random() * 200 > 150)
				//{
					grid[i][j].age--
				//}

				if (grid[i][j].age < 0)
				{
					grid[i][j].letter = null
				}

			}
			
			else 
			{
				
				let food = calculateFood(i, j);
				if (food > 130) {
					grid[i][j] = { 
						letter: "X",
						age: food * 0.9, 
						color: color(128, 128, 128),
						class: "food"
					}
				}
				
			}
		}
		
	}

	if (random() * 10000 > 9900)
	{
		random_vkd()
	}
}

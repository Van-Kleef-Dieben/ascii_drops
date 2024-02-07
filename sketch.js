
let grid = []
let sizeX
let sizeY
let maxAge = 255



let direction = false
let string = "VAN KLEEF-DIEBEN"

const dX = 15
const dY = 20

function setup() {

	let w = displayWidth
	let h = 400

	createCanvas(w, h);
	textFont("ia")
	textStyle("bold")
	textSize(20)
	textAlign(CENTER, TOP)

	sizeX = (w / dX) | 0
	sizeY = (h / dY) | 0

	for (let i = 0; i < sizeX; i++) 
	{
		grid[i] = []
		for (let j = 0; j < sizeX; j++) 
		{
			grid[i][j] = { letter: null, age: 0 }
		}
	}

	vkd(40, 10)
}

function vkd(x, y)
{
	let s = string
	
	direction = !direction

	for (let i = 0; i < s.length; i++) {

		if ((direction ? x : y) + i >= (direction ? sizeX : sizeY))
		{
			continue
		}

		grid[x + (direction ? i : 0)][y + (direction ? 0 : i)] = { letter: s[i], age: 300, color: color("#444"), count: 4, class: "source" }
		
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

// function distanceToClass(c, x, y)
// {
// 	let d = -1

// 	for (let i = 0; i < sizeX; i++) 
// 	{
// 		for (let j = 0; j < sizeY; j++)
// 		{
// 			if (i < 0 || i >= sizeX || j < 0 || j >= sizeY)
// 			{
// 				continue;
// 			}

// 			if (grid[i][j].class !== c)
// 			{
// 				continue
// 			}

// 			let dd = Math.sqrt((x - i) * (x - i) + (y - j) * (y - j)) | 0

// 			if (dd < d || d === -1)
// 			{
// 				d = dd
// 			}
// 		}
// 	}

// 	return d
// }

function draw() {
	// background(220);
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
					let chars = [ "░",  "▒", "▓",  "█", ]
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

				if (random() * 200 > 150)
				{
					grid[i][j].age--
				}
				// grid[i][j].age -= (d !== -1 ? d : 10)

				if (grid[i][j].age < 0)
				{
					grid[i][j].letter = null
				}

				// if (random() * 1000 > 990)
				// {
				// 	let found = false
				// 	let x
				// 	let y

				// 	for ( x = i - 3; x < i + 3; x++)
				// 	{
				// 		for ( y = j - 3; y < j + 3; y++)
				// 		{
				// 			if (x < 0 || x > sizeX || y < 0 || y > sizeY || grid[x][y].letter !== null) 
				// 			{
				// 				continue
				// 			}

				// 			found = true;
				// 			break;
				// 		}

				// 		if (found)
				// 		{
				// 			break;
				// 		}
				// 	}

				// 	if (found) 
				// 	{
				// 		grid[x][y] = { letter: random().toString(36).substring(2, 3), age: 255, color: color(150, 200, 100), count: 1 }
				// 	}
				// }
			}
			
			else 
			{
				if (random() * 100000 > 99500)
				{
					let food = calculateFood(i, j);
					if (food > 100) {
						grid[i][j] = { 
							// letter: random().toString(36).substring(2, 3), 
							letter: ".",
							age: min(food * random() * 1.1, maxAge), 
							color: color(200, 128, 128),
							class: "food"
						}
					}
				}
			}
		}
		
	}

	if (random() * 100000 > 99900)
	{
		random_vkd()
	}
}
